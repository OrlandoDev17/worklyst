"use client";

import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import type { User } from "@/lib/types";
import { useAuth } from "./AuthContext";

interface UsersContextType {
  usersMap: Record<string, User>; // Diccionario id -> usuario
  loading: boolean;
  searchUsers: (query: string) => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  getUserById: (id: string) => User | undefined;
}

const UsersContext = createContext<UsersContextType | null>(null);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(false);

  const { mounted } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Helper para el Token
  const getHeaders = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenAcceso")}`,
      },
    }),
    [],
  );

  // Función para guardar usuarios en el mapa sin borrar los que ya están
  const saveToCache = useCallback((users: User[]) => {
    setUsersMap((prev) => {
      const newEntries: Record<string, User> = {};
      users.forEach((u) => {
        if (u.id) {
          newEntries[u.id] = u;
        }
      });
      return { ...prev, ...newEntries }; // Mezclamos lo viejo con lo nuevo
    });
  }, []);

  // 1. Buscar por nombre/email
  const searchUsers = useCallback(
    async (query: string) => {
      if (!query || !mounted) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/api/users?nombre=${query}`,
          getHeaders(),
        );
        saveToCache(res.data);
      } catch (err) {
        console.error("Error buscando usuarios");
      } finally {
        setLoading(false);
      }
    },
    [API_URL, mounted, getHeaders, saveToCache],
  );

  // 2. Traer todos (útil para administradores o selectores)
  const fetchAllUsers = useCallback(async () => {
    if (!mounted) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users`, getHeaders());
      saveToCache(res.data);
    } catch (err) {
      console.error("Error al traer todos los usuarios");
    } finally {
      setLoading(false);
    }
  }, [API_URL, mounted, getHeaders, saveToCache]);

  // 3. Obtener uno del mapa (Síncrono)
  const getUserById = (id: string) => usersMap[id];

  return (
    <UsersContext.Provider
      value={{ usersMap, loading, searchUsers, fetchAllUsers, getUserById }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) throw new Error("useUsers must be used within UsersProvider");
  return context;
};
