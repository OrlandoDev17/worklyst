import { useEffect, useState } from "react";
import { X, Search, Check, Plus } from "../common/Icons";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";

const INPUT_STYLES =
  "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400";
const LABEL_STYLES = "text-sm font-semibold text-gray-700 tracking-wide";

function FormField({ label, children }) {
  return (
    <label className="flex flex-col gap-2 relative">
      <span className={LABEL_STYLES}>{label}</span>
      {children}
    </label>
  );
}

export function ProjectModal({ onClose, onAddProject }) {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const { user: currentUser } = useAuth();
  const { searchUsers, loading: isSearching } = useUsers();

  // Logica de busqueda con Debounce
  useEffect(() => {
    const performSearch = async () => {
      if (search.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const results = await searchUsers(search);
        // Filtrar usuario actual y miembros ya añadidos
        const filtered = results.filter(
          (u) =>
            u.id !== currentUser?.id && !members.find((m) => m.id === u.id),
        );
        setSuggestions(filtered);
      } catch (error) {
        console.error("Error en búsqueda:", error);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [search, members, currentUser, searchUsers]);

  const addMember = (user) => {
    setMembers([...members, user]);
    setSearch("");
    setSuggestions([]);
  };

  const removeMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // e.currentTarget is the form element when triggered via onSubmit
    const formData = new FormData(e.currentTarget);

    onAddProject({
      nombre: formData.get("nombre"),
      descripcion: formData.get("descripcion"),
      miembros: members.map((m) => m.id),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <article className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Crear nuevo proyecto
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Comienza tu colaboración
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          id="create-project-form"
          onSubmit={handleSubmit}
          className="p-6 flex flex-col gap-6"
        >
          <FormField label="Nombre del Proyecto">
            <input
              type="text"
              name="nombre"
              required
              className={INPUT_STYLES}
              placeholder="Ej: Rediseño de Sitio Web"
              autoFocus
            />
          </FormField>

          <FormField label="Descripción">
            <textarea
              name="descripcion"
              rows={3}
              className={`${INPUT_STYLES} resize-none`}
              placeholder="Describe brevemente el objetivo del proyecto..."
            />
          </FormField>

          <div className="flex flex-col gap-3">
            <span className={LABEL_STYLES}>Equipo</span>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 size-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${INPUT_STYLES} pl-10`}
                placeholder="Añadir miembros..."
              />
              {isSearching && (
                <div className="absolute right-3 top-3.5">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}

              {/* Dropdown de sugerencias */}
              {suggestions.length > 0 && (
                <ul className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                  {suggestions.map((u) => (
                    <li key={u.id}>
                      <button
                        type="button"
                        onClick={() => addMember(u)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700">
                            {u.usuario}
                          </span>
                          <span className="text-xs text-gray-500">
                            {u.email}
                          </span>
                        </div>
                        <Plus className="size-4 text-gray-300 group-hover:text-blue-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Members List */}
            <div className="flex flex-wrap gap-2 min-h-[30px]">
              {/* Creator Chip */}
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 select-none">
                <span className="size-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                  {currentUser?.nombre?.[0] || "Y"}
                </span>
                <span>Tú (Creador)</span>
              </div>

              {members.map((m) => (
                <div
                  key={m.id}
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-100 animate-in fade-in slide-in-from-left-2 duration-200"
                >
                  <span className="font-medium">{m.usuario}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="hover:text-blue-900 rounded-full p-0.5 hover:bg-blue-100 transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="create-project-form"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm flex items-center gap-2"
          >
            <Check className="size-4" />
            Crear Proyecto
          </button>
        </div>
      </article>
    </div>
  );
}
