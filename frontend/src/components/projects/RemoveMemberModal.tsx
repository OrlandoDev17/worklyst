"use client";

import { X, UserMinus } from "lucide-react";
import { useUsers } from "@/contexts/UsersContext";

interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemoveMember: (userId: string) => Promise<boolean>;
  memberIds: string[];
}

export function RemoveMemberModal({
  isOpen,
  onClose,
  onRemoveMember,
  memberIds,
}: RemoveMemberModalProps) {
  const { getUserById } = useUsers();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <article className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <header className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900">Eliminar Miembros</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </header>

        <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {memberIds.length === 0 ? (
            <p className="text-center py-4 text-gray-500 text-sm">
              No hay miembros para eliminar.
            </p>
          ) : (
            memberIds.map((id) => {
              const u = getUserById(id);
              if (!u) return null;

              return (
                <li
                  key={id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-800 text-sm">
                      {u.nombre || u.usuario}
                    </p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <button
                    onClick={async () => {
                      const success = await onRemoveMember(id);
                      // Si después de borrar no quedan más, cerramos el modal
                      if (success && memberIds.length <= 1) onClose();
                    }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar del proyecto"
                  >
                    <UserMinus className="size-5" />
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </article>
    </div>
  );
}
