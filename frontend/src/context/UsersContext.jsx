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
  const [user, setUser] = useState(null);

  const searchUsers = useCallback(async (query) => {
    if (!query) return [];
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

    // Guard: Return static bot data for system bot
    if (
      id === "IA System Bot" ||
      id === "ia-system-bot" ||
      id === "IA_SYSTEM_BOT"
    ) {
      const botUser = {
        id: "ia-system-bot",
        nombre: "IA System Bot",
        email: "bot@worklyst.ai",
        iniciales: "AI",
      };
      setUser(botUser);
      return botUser;
    }

    try {
      const res = await api.get(`/api/users/${id}`);
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error(`Error fetching user ${id}`, err);
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
        user,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
