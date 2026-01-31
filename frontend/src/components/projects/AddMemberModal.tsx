"use client";

// Hooks
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
// Contexts
import { useUsers } from "@/contexts/UsersContext";
// Types
import type { User } from "@/lib/types";
// Icons
import { Search, X, UserPlus } from "lucide-react";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (user: User) => Promise<boolean>;
  currentMembers?: string[];
}

export function AddMemberModal({
  isOpen,
  onClose,
  onAddMember,
  currentMembers = [],
}: AddMemberModalProps) {
  // Estados
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { searchUsers, usersMap, loading } = useUsers();

  // Logica de busqueda con Debounce
  useEffect(() => {
    if (debouncedSearch.length >= 3) {
      searchUsers(debouncedSearch);
    }
  }, [debouncedSearch, searchUsers]);

  // Filtramos los usuarios del UsersMap que coincidan con la busqueda
  const filteredResults = useMemo(() => {
    if (searchTerm.length < 3) return [];

    return Object.values(usersMap).filter((user) => {
      // Asegurar que existe y tiene ID
      if (!user || !user.id) return false;
      const matchesSearch =
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const isNotMember = !currentMembers.includes(user.id!);

      return matchesSearch && isNotMember;
    });
  }, [usersMap, searchTerm, currentMembers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-950/40 backdrop-blur-md"
        onClick={onClose}
      />

      <article className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/50">
          <h4 className="text-lg font-bold text-gray-900">Añadir Miembro</h4>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </header>

        <div className="p-6">
          <div className="relative mb-6">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 size-5 ${loading ? "text-blue-500 animate-pulse" : "text-gray-400"}`}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <ul className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
            {filteredResults.map((user) => (
              <li key={user.id}>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!user.id) {
                      console.error(
                        "ERROR: El usuario de la lista no tiene ID",
                      );
                      return;
                    }

                    const success = await onAddMember(user);
                    if (success) onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl group transition-all border border-transparent hover:border-blue-100"
                >
                  <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase shrink-0">
                    {(user.nombre || user.usuario || "?").charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-700 truncate">
                      {user.nombre || user.usuario}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <UserPlus className="size-5 text-gray-300 group-hover:text-blue-600" />
                </button>
              </li>
            ))}

            {/* Mensajes de estado */}
            {searchTerm.length >= 3 &&
              filteredResults.length === 0 &&
              !loading && (
                <p className="text-center py-6 text-sm text-gray-400">
                  No se encontraron usuarios nuevos
                </p>
              )}
            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <p className="text-center py-6 text-xs text-gray-400">
                Escribe al menos 3 caracteres...
              </p>
            )}
          </ul>
        </div>
      </article>
    </div>
  );
}
