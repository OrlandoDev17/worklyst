"use client";
import { useState } from "react";
import { useGroups } from "@/contexts/GroupContext";
import { Button } from "../common/Button";
import { X } from "lucide-react";

export function AddGroupModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const { createGroup } = useGroups();
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const success = await createGroup({
      nombre: formData.get("nombre") as string,
      descripcion: formData.get("descripcion") as string,
      miembros: [], // Podrías integrar aquí tu UserSearchSelect
    });

    if (success) onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nueva Comunidad</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="size-6 text-gray-500" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre del Grupo
            </label>
            <input
              name="nombre"
              required
              placeholder="Ej: Equipo de Diseño"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              rows={3}
              placeholder="¿De qué trata este grupo?"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <Button type="submit" className="w-full py-4" isLoading={loading}>
            Crear Comunidad
          </Button>
        </form>
      </div>
    </div>
  );
}
