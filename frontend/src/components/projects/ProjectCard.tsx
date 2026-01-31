// Components
import Link from "next/link";
import { ProjectStateTag } from "./ProjectStateTag";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { Dropdown, DropdownItem } from "@/components/common/Dropdown";
import { AddMemberModal } from "./AddMemberModal";
import { CreateProjectModal } from "./CreateProjectModal";
import { RemoveMemberModal } from "./RemoveMemberModal";
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
} from "lucide-react";
// Types
import type { Project, User } from "@/lib/types";
// Contexts
import { useUsers } from "@/contexts/UsersContext";
import { useProjects } from "@/contexts/ProjectsContext";
import { ConfirmDeletion } from "../common/ConfirmDeletion";

export function ProjectCard(project: Project) {
  const {
    id,
    nombre,
    descripcion,
    miembros = [],
    creadorId,
    estado,
    creadoEn,
    actualizadoEn,
  } = project;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);

  const { getUserById } = useUsers();
  const { updateProject, deleteProject, addMember, removeMember } =
    useProjects();

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

  // --- HELPERS ---

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Forzamos una lista de miembros: si no hay, usamos al creador
  const displayMembers =
    miembros && miembros.length > 0 ? miembros : creadorId ? [creadorId] : [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Link
        href={`/projects/${id}`}
        onClick={(e) => showDropdown && e.preventDefault()}
      >
        <article className="flex flex-col gap-4 p-6 rounded-xl border border-gray-200 shadow-lg shadow-gray-500 hover:-translate-y-1 hover:border-blue-500/80 hover:shadow-blue-500/50 transition-all duration-300">
          <header className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h3 className="text-xl font-semibold">{nombre}</h3>
            <div className="relative">
              <button onClick={handleDropdownToggle}>
                <Ellipsis className="p-2 size-10 rounded-full text-gray-600 hover:bg-gray-200 hover:text-blue-500 transition-colors duration-200" />
              </button>
              <Dropdown
                isOpen={showDropdown}
                onClose={() => setShowDropdown(false)}
                items={items}
              />
            </div>
          </header>
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-4">
            <span className="text-sm text-gray-500">
              Creado: {formatDate(creadoEn)}
            </span>
            <p className="text-gray-700">{descripcion}</p>
            <ProjectStateTag
              estado={estado as "active" | "completed" | "overdue"}
            />
          </div>
          <footer className="flex items-center justify-between">
            <ul className="flex items-center gap-2">
              {displayMembers.map((uuid) => {
                const member = getUserById(uuid);

                return (
                  <li key={uuid}>
                    <MemberAvatar name={member?.nombre || ""} />
                  </li>
                );
              })}
            </ul>
            <span className="flex items-center gap-2 text-sm text-gray-600">
              <RefreshCw className="size-4" />
              Actualizado: {formatDate(actualizadoEn)}
            </span>
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
          currentMembers={miembros}
        />
      )}

      {/* Modal de Eliminar Miembro */}
      {showRemoveMemberModal && (
        <RemoveMemberModal
          isOpen={showRemoveMemberModal}
          onClose={() => setShowRemoveMemberModal(false)}
          onRemoveMember={handleRemoveMemberSubmit}
          memberIds={miembros}
        />
      )}
    </>
  );
}
