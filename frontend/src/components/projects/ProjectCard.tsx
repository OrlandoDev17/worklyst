// Components
import Link from "next/link";
import { ProjectStateTag } from "./ProjectStateTag";
import { Dropdown, DropdownItem } from "@/components/common/Dropdown";
import { AddMemberModal } from "./AddMemberModal";
import { CreateProjectModal } from "./CreateProjectModal";
import { RemoveMemberModal } from "./RemoveMemberModal";
import { ConfirmDeletion } from "@/components/common/ConfirmDeletion";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { ProgressBar } from "@/components/common/ProggresBar";
// Hooks
import { useState } from "react";
// Icons
import {
  Ellipsis,
  Pencil,
  RefreshCw,
  UserMinus,
  UserPlus,
  Trash2,
  Calendar,
} from "lucide-react";
// Types
import type { Project, User } from "@/lib/types";
// Contexts
import { useProjects } from "@/contexts/ProjectsContext";

export function ProjectCard(project: Project) {
  const {
    id,
    nombre,
    descripcion,
    estado,
    creadoEn,
    actualizadoEn,
    miembros = [],
  } = project;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);

  const { updateProject, deleteProject, addMember, removeMember } =
    useProjects();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  // --- FUNCIONES DE ACCION ---

  // == EDITAR ==

  const handleEdit = () => {
    setShowEditModal(true);
    setShowDropdown(false);
  };

  const handleUpdateSubmit = async (projectData: Project) => {
    return await updateProject(id!, projectData);
  };

  // == ELIMINAR ==

  const handleDelete = () => {
    setShowDeleteModal(true);
    setShowDropdown(false);
  };

  const handleDeleteSubmit = async () => {
    return await deleteProject(id!);
  };

  // == AGREGAR MIEMBRO ==

  const handleAddMember = () => {
    setShowAddMemberModal(true);
    setShowDropdown(false);
  };

  const handleAddMemberSubmit = async (user: User) => {
    if (!user || !user.id) {
      console.error("User or user ID is missing");
      return false;
    }

    const success = await addMember(id!, user.id, 0);

    if (success) {
      setShowAddMemberModal(false);
      setShowDropdown(false);
    }
    return success;
  };

  // == ELIMINAR MIEMBRO ==

  const handleRemoveMember = () => {
    setShowRemoveMemberModal(true);
    setShowDropdown(false);
  };

  const handleRemoveMemberSubmit = async (userId: string) => {
    const success = await removeMember(id!, userId);

    if (success) {
      setShowRemoveMemberModal(false);
      setShowDropdown(false);
    }
    return success;
  };

  // --- CONFIGURACION EL DROPDOWN ---

  const items: DropdownItem[] = [
    {
      label: "Editar proyecto",
      icon: Pencil,
      onClick: handleEdit,
    },
    {
      label: "Agregar miembro",
      icon: UserPlus,
      onClick: handleAddMember,
    },
    {
      label: "Eliminar miembro",
      icon: UserMinus,
      onClick: handleRemoveMember,
    },
    {
      label: "Eliminar proyecto",
      icon: Trash2,
      variant: "danger",
      onClick: handleDelete,
    },
  ];

  const maxVisibleMembers = 4;

  return (
    <>
      <Link
        href={`/projects/${id}`}
        onClick={(e) => showDropdown && e.preventDefault()}
      >
        <article className="flex flex-col h-full gap-4 p-6 rounded-xl border border-gray-200 shadow-lg shadow-gray-200 hover:shadow-blue-500/30 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 bg-white group">
          <header className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h3 className="text-xl font-bold group-hover:text-blue-500 transition">
              {nombre}
            </h3>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
              >
                <Ellipsis className="p-2 size-10 rounded-full text-gray-500 hover:bg-gray-100 transition-colors" />
              </button>
              <Dropdown
                isOpen={showDropdown}
                onClose={() => setShowDropdown(false)}
                items={items}
              />
            </div>
          </header>

          <div className="flex flex-col gap-3 flex-1 border-b border-gray-200 pb-4">
            <span className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Calendar className="size-3" /> CREADO EL {formatDate(creadoEn)}
            </span>
            <p className="text-gray-600 text-sm line-clamp-3">{descripcion}</p>
            <ProjectStateTag estado={estado as any} />
            <ProgressBar totalTasks={10} completedTasks={4} />
          </div>

          <footer
            className="flex items-center justify-between
          "
          >
            <ul className="flex items-center">
              {miembros
                .sort((a, b) => (a.rol === "owner" ? -1 : 1))
                .slice(0, maxVisibleMembers)
                .map((miembro) => (
                  <li className="-ml-2 relative" key={miembro.id}>
                    <MemberAvatar name={miembro?.nombre} />
                  </li>
                ))}
              {miembros.length > maxVisibleMembers && (
                <li className="-ml-2 relative">
                  <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-xs border-2 border-white">
                    +{miembros.length - maxVisibleMembers}
                  </div>
                </li>
              )}
            </ul>

            <div className="text-right">
              <span className="flex items-center gap-1 text-xs text-gray-400 uppercase font-medium">
                <RefreshCw className="size-3" /> Actualizado:{" "}
                {formatDate(actualizadoEn)}
              </span>
            </div>
          </footer>
        </article>
      </Link>

      {/* Modal de Edición */}
      {showEditModal && (
        <CreateProjectModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          initialData={project}
          onSubmit={handleUpdateSubmit}
        />
      )}

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <ConfirmDeletion
          type="project"
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onSubmit={handleDeleteSubmit}
        />
      )}

      {/* Modal de Agregar Miembro */}
      {showAddMemberModal && (
        <AddMemberModal
          isOpen={showAddMemberModal}
          onClose={() => setShowAddMemberModal(false)}
          onAddMember={handleAddMemberSubmit}
        />
      )}

      {/* Modal de Eliminar Miembro */}
      {showRemoveMemberModal && (
        <RemoveMemberModal
          isOpen={showRemoveMemberModal}
          onClose={() => setShowRemoveMemberModal(false)}
          onRemoveMember={handleRemoveMemberSubmit}
          members={project.miembros || []}
        />
      )}
    </>
  );
}
