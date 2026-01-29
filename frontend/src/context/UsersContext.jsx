/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/api";

const UsersContext = createContext();

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}

export function UsersProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchUsers = useCallback(async (query) => {
    if (!query) return [];

    // Static check for AI System Bot to avoid unnecessary API calls and 404s
    if (query.trim() === "IA System Bot") {
      return [
        {
          id: "ia-system-bot",
          nombre: "IA System Bot",
          usuario: "IA System Bot",
          email: "bot@worklyst.ai",
          iniciales: "AI",
        },
      ];
    }

    setLoading(true);
    try {
      const res = await api.get(`/api/users?nombre=${query}`);
      // Filter out bot users from search results
      return res.data.filter(
        (user) =>
          user.id !== "IA System Bot" &&
          user.id !== "ia-system-bot" &&
          user.nombre !== "IA System Bot",
      );
    } catch (err) {
      console.error("Error searching users", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (id) => {
    if (!id) return null;

    // 1. Guard para el Bot (Ya lo tienes, está perfecto)
    if (
      id === "IA System Bot" ||
      id === "ia-system-bot" ||
      id === "IA_SYSTEM_BOT"
    ) {
      return {
        id: "ia-system-bot",
        nombre: "IA System Bot",
        email: "bot@worklyst.ai",
        iniciales: "AI",
      };
    }

    try {
      // 2. Encodeamos el ID por si vienen caracteres especiales o espacios
      const res = await api.get(`/api/users/${encodeURIComponent(id)}`);
      return res.data;
    } catch (err) {
      // Si es 404, no es un error crítico de sistema, sino que el usuario no existe
      if (err.response && err.response.status === 404) {
        console.warn(`Usuario con ID ${id} no encontrado en la base de datos.`);
      } else {
        console.error(`Error fetch user ${id}`, err);
      }
      return null;
    }
  }, []);

  return (
    <UsersContext.Provider
      value={{
        searchUsers,
        getUserById,
        loading,
        error,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
