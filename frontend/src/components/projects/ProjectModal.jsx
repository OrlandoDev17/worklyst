/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Plus, X } from "../common/Icons";
import api from "../../lib/api";

const INPUT_STYLES =
  "px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all";
const LABEL_STYLES = "text-sm font-semibold text-gray-600";

function FormField({ label, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className={LABEL_STYLES}>{label}</span>
      {children}
    </label>
  );
}

export function ProjectModal({ onClose, onAddProject }) {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Logica de busqueda con Debounce
  useEffect(() => {
    const searchUsers = async () => {
      if (search.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await api.get(`/api/users?nombre=${search}`);
        setSuggestions(res.data);
      } catch (error) {
        console.error("Error Buscando usuarios", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 400);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const addMember = (user) => {
    if (!members.find((m) => m.id === user.id)) {
      setMembers([...members, user]);
    }
    setSearch("");
    setSuggestions([]);
  };

  const removeMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    onAddProject({
      nombre: formData.get("nombre"),
      descripcion: formData.get("descripcion"),
      miembros: members.map((m) => m.id),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <article className="relative bg-white p-6 rounded-xl shadow-2xl border border-white/20 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Crear proyecto
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Nombre del Proyecto">
            <input
              type="text"
              name="nombre"
              required
              className={INPUT_STYLES}
              placeholder="Mi nuevo proyecto..."
            />
          </FormField>

          <FormField label="Descripción">
            <textarea
              name="descripcion"
              rows={2}
              className={`${INPUT_STYLES} resize-none`}
              placeholder="¿De qué trata?"
            />
          </FormField>

          <div className="flex flex-col gap-2 relative">
            <span className={LABEL_STYLES}>Miembros</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`flex-1 ${INPUT_STYLES}`}
                placeholder="Buscar por nombre..."
              />
            </div>

            {/* Dropdown de sugerencias */}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 top-[70px] w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                {suggestions.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => addMember(u)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 flex flex-col transition-colors"
                    >
                      <span className="font-medium text-gray-800">
                        {u.usuario}
                      </span>
                      <span className="text-xs text-gray-500">{u.email}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Lista de miembros seleccionados */}
            <ul className="flex flex-wrap gap-2 mt-2">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100"
                >
                  <span>{m.usuario}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
