"use client";

// Hooks
import { useRef, useState, useEffect, useMemo } from "react";
import { useProjectModalAnimation } from "@/hooks/useProjectModalAnimation";
import { useDebounce } from "@/hooks/useDebounce";
// Context
import { useUsers } from "@/contexts/UsersContext";
// Types
import { Project, User } from "@/lib/types";
// Icons
import { Plus, Search, X, UserPlus, Pencil } from "lucide-react";
// Components
import { ProjectInput } from "./ProjectInput";
import { MemberAvatar } from "@/components/common/MemberAvatar";
// Constants
import { PROJECT_FORM } from "@/lib/constants";

interface ProjectModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSubmit: (project: Project) => Promise<boolean>;
  initialData?: Project;
}

export function CreateProjectModal({
  showModal,
  setShowModal,
  onSubmit,
  initialData,
}: ProjectModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // -- LOGICA PARA MIEMBROS --
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const { searchUsers, usersMap, loading } = useUsers();

  // ANIMACION
  useProjectModalAnimation(showModal, overlayRef, contentRef);

  // BUSCAR USUARIO (Solo si hay 3 o más letras)
  useEffect(() => {
    if (debouncedSearch.trim().length >= 3) {
      searchUsers(debouncedSearch);
    }
  }, [debouncedSearch, searchUsers]);

  // FILTRAR RESULTADOS:
  // 1. Que el término de búsqueda coincida con el nombre/email
  // 2. Que no esté ya seleccionado
  const searchResults = useMemo(() => {
    const cleanSearch = searchTerm.toLowerCase().trim();
    if (cleanSearch.length < 3) return [];

    return Object.values(usersMap).filter((u) => {
      const matchesSearch =
        u.nombre?.toLowerCase().includes(cleanSearch) ||
        u.usuario?.toLowerCase().includes(cleanSearch) ||
        u.email?.toLowerCase().includes(cleanSearch);

      const isNotSelected = !selectedMembers.some((m) => m.id === u.id);

      return matchesSearch && isNotSelected;
    });
  }, [usersMap, searchTerm, selectedMembers]);

  const addMember = (user: User) => {
    setSelectedMembers((prev) => [...prev, user]);
    setSearchTerm("");
  };

  const removeMember = (userId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const projectData: Project = {
      ...initialData,
      nombre: formData.get("nombre") as string,
      descripcion: formData.get("descripcion") as string,
      miembros: selectedMembers.map((m) => m.id!),
    };

    const success = await onSubmit(projectData);
    if (success) {
      setShowModal(false);
      setSelectedMembers([]);
      setSearchTerm("");
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 hidden items-center justify-center bg-black/60 backdrop-blur-sm opacity-0"
    >
      <article
        ref={contentRef}
        className="relative flex flex-col gap-6 max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl"
      >
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {initialData ? "Editar Proyecto" : "Nuevo Proyecto"}
            </h3>
          </div>
          <button onClick={() => setShowModal(false)}>
            <X className="size-6 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </header>

        <form
          id="project-form"
          onSubmit={handleCreateProject}
          className="flex flex-col gap-5"
        >
          {PROJECT_FORM.map((input) => (
            <ProjectInput
              key={input.name}
              {...input}
              defaultValue={
                initialData
                  ? (initialData[input.name as keyof Project] as string)
                  : ""
              }
            />
          ))}

          {!initialData && (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-700">
                Añadir Equipo
              </label>

              {/* Chips de seleccionados */}
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs border border-blue-100"
                  >
                    <span className="truncate max-w-[100px]">
                      {m.nombre || m.usuario}
                    </span>
                    <button type="button" onClick={() => removeMember(m.id!)}>
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Buscador */}
              <div className="relative">
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${loading ? "text-blue-500 animate-pulse" : "text-gray-400"}`}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Dropdown de resultados filtrados */}
                {searchResults.length > 0 && (
                  <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-40 overflow-y-auto p-1">
                    {searchResults.map((u) => (
                      <li key={u.id}>
                        <button
                          type="button"
                          onClick={() => addMember(u)}
                          className="w-full flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-2 text-left">
                            <MemberAvatar
                              name={u.nombre || ""}
                              className="size-6"
                            />
                            <div>
                              <p className="text-xs font-bold">
                                {u.nombre || u.usuario}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <UserPlus className="size-4 text-gray-400 group-hover:text-blue-500" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </form>

        <footer className="flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="project-form"
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-500 text-white font-medium shadow-lg shadow-blue-500/25"
          >
            {initialData ? (
              <Pencil className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
            {initialData ? "Guardar" : "Crear"}
          </button>
        </footer>
      </article>
    </div>
  );
}
