"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { Group, GroupMember } from "@/lib/types";
import axios from "axios";

interface GroupsContextType {
  groups: Group[];
  selectedGroup: Group | null;
  loading: boolean;
  fetchGroups: () => Promise<void>;
  getGroupById: (id: string) => Promise<void>;
  createGroup: (data: {
    nombre: string;
    descripcion: string;
    miembros: string[];
  }) => Promise<boolean>;
  updateGroup: (id: string, data: Partial<Group>) => Promise<boolean>;
  deleteGroup: (id: string) => Promise<boolean>;
  addMembers: (groupId: string, userIds: string[]) => Promise<boolean>;
  removeMember: (groupId: string, userId: string) => Promise<boolean>;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export function GroupsProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const { addToast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const APP_API_KEY = process.env.NEXT_PUBLIC_APP_API_KEY;

  const getHeaders = useCallback(
    () => ({
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-api-key": APP_API_KEY,
      },
    }),
    [token, APP_API_KEY],
  );

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/groups`, getHeaders());
      setGroups(response.data);
    } catch (error) {
      addToast("Error al cargar grupos", "error");
    } finally {
      setLoading(false);
    }
  }, [API_URL, getHeaders, addToast]);

  const createGroup = async (data: any) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/groups`,
        data,
        getHeaders(),
      );
      setGroups((prev) => [...prev, response.data.grupo]);
      addToast("Comunidad creada con éxito", "success");
      return true;
    } catch (error) {
      addToast("Error al crear la comunidad", "error");
      return false;
    }
  };

  const getGroupById = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/groups/${id}`,
        getHeaders(),
      );
      setSelectedGroup(response.data);
    } catch (error) {
      addToast("No se pudo obtener la información del grupo", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/groups/${id}`, getHeaders());
      setGroups((prev) => prev.filter((g) => g.id !== id));
      addToast("Comunidad eliminada", "info");
      return true;
    } catch (error) {
      addToast("No se pudo eliminar el grupo", "error");
      return false;
    }
  };

  const updateGroup = async (id: string, data: Partial<Group>) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/groups/${id}`,
        data,
        getHeaders(),
      );
      setGroups((prev) =>
        prev.map((g) => (g.id === id ? response.data.grupo : g)),
      );
      addToast("Comunidad actualizada", "success");
      return true;
    } catch (error) {
      addToast("No se pudo actualizar la comunidad", "error");
      return false;
    }
  };

  return (
    <GroupsContext.Provider
      value={{
        updateGroup,
        groups,
        selectedGroup,
        loading,
        fetchGroups,
        createGroup,
        getGroupById,
        deleteGroup,
        addMembers: async () => true, // Implementar similar a miembros de proyecto
        removeMember: async () => true,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (!context)
    throw new Error("useGroups debe usarse dentro de GroupsProvider");
  return context;
};
