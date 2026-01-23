import { useState } from "react";
import { Plus, X } from "../common/Icons";

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
  const [miembros, setMiembros] = useState([]);
  const [newMiembro, setNewMiembro] = useState("");

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    if (newMiembro.trim()) {
      setMiembros([...miembros, newMiembro.trim()]);
      setNewMiembro("");
    }
  };

  const removeCollaborator = (index) => {
    setMiembros(miembros.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get("nombre");
    const descripcion = formData.get("descripcion");

    if (!nombre) return;

    // No generamos ID aquí, el backend lo hará.
    // Solo pasamos nombre, descripcion y miembros (que serán procesados por el contexto/backend)
    onAddProject({
      nombre,
      descripcion,
      miembros, // Se envían los nombres/emails ingresados, aunque por ahora la API requiere UUIDs
    });
    // El modal se cierra en Projects.jsx tras la operación exitosa
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
              autoFocus
              className={INPUT_STYLES}
              placeholder="Mi nuevo proyecto..."
            />
          </FormField>

          <FormField label="Descripción">
            <textarea
              name="descripcion"
              rows={3}
              className={`${INPUT_STYLES} resize-none`}
              placeholder="Descripción breve del proyecto..."
            />
          </FormField>

          <div className="flex flex-col gap-2">
            <span className={LABEL_STYLES}>Colaboradores</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMiembro}
                onChange={(e) => setNewMiembro(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCollaborator(e);
                  }
                }}
                className={`flex-1 ${INPUT_STYLES}`}
                placeholder="Nombre o email..."
              />
              <button
                type="button"
                onClick={handleAddCollaborator}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="size-5" />
              </button>
            </div>

            {miembros.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-2">
                {miembros.map((miembro, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{miembro}</span>
                    <button
                      type="button"
                      onClick={() => removeCollaborator(index)}
                      className="hover:text-blue-900"
                    >
                      <X className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
