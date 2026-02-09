"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import {
  ArrowRightLeft,
  Ellipsis,
  Pencil,
  Trash2,
  UserPlus,
  Calendar,
} from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/common/Dropdown";
import { ConfirmDeletion } from "@/components/common/ConfirmDeletion";
import { useTasks } from "@/contexts/TasksContext";
import { useTaskStatuses } from "@/contexts/TaskStatusesContext";
import { useProjects } from "@/contexts/ProjectsContext";
import { AddTaskModal } from "./AddTaskModal";
import { MemberAvatar } from "@/components/common/MemberAvatar";

export function TaskCard(task: Task) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    id,
    titulo,
    descripcion,
    estado,
    asignado_a,
    fecha_limite,
    proyecto_id,
  } = task;

  const { deleteTask, updateTask, setIsDragging, setDraggedTaskId } =
    useTasks();
  const { getStatusByKey, statuses } = useTaskStatuses();
  const { selectedProject } = useProjects();

  // 1. Obtener info del usuario asignado desde el proyecto actual
  const assignedUser = selectedProject?.miembros?.find(
    (m) => m.id === asignado_a,
  );

  // 2. Info visual del estado (color, nombre)
  const statusInfo = getStatusByKey(estado);

  // 3. Formatear fecha para la UI
  const formattedDate = fecha_limite
    ? new Date(fecha_limite).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      })
    : "Sin fecha";

  // --- LÓGICA DE DRAG AND DROP ---
  const handleDragStart = (e: React.DragEvent) => {
    // Guardamos el ID de la tarea para que BoardColumn lo reciba
    e.dataTransfer.setData("taskId", id!);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    setDraggedTaskId(id!);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // --- FUNCIONES DE ACCIÓN ---
  const handleMoveViaDropdown = async () => {
    if (statuses.length === 0) return;

    // Buscamos el siguiente estado en la lista
    const currentIndex = statuses.findIndex((s) => s.key === estado);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    await updateTask(id!, { estado: nextStatus.key });
    setShowDropdown(false);
  };

  const items: DropdownItem[] = [
    {
      label: "Editar Tarea",
      icon: Pencil,
      onClick: () => {
        setShowEditModal(true);
        setShowDropdown(false);
      },
    },
    {
      label: `Mover a: ${statuses[(statuses.findIndex((s) => s.key === estado) + 1) % statuses.length]?.name || "Siguiente"}`,
      icon: ArrowRightLeft,
      onClick: handleMoveViaDropdown,
    },
    {
      label: "Eliminar",
      icon: Trash2,
      onClick: () => {
        setShowDeleteModal(true);
        setShowDropdown(false);
      },
      variant: "danger",
    },
  ];

  return (
    <>
      <article
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="flex flex-col gap-3 p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-200 
                   hover:shadow-md hover:border-blue-200 transition-all duration-200 group 
                   cursor-grab active:cursor-grabbing"
      >
        <header className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
            {titulo}
          </h3>
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowDropdown(!showDropdown);
              }}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <Ellipsis className="size-5" />
            </button>
            <Dropdown
              isOpen={showDropdown}
              onClose={() => setShowDropdown(false)}
              items={items}
            />
          </div>
        </header>

        <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">
          {descripcion || "Sin descripción adicional..."}
        </p>

        {/* Badge de Estado */}
        <div className="flex">
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
            style={{
              backgroundColor: `${statusInfo?.color}10`,
              borderColor: `${statusInfo?.color}40`,
              color: statusInfo?.color || "#6b7280",
            }}
          >
            {statusInfo?.name || estado}
          </span>
        </div>

        <div className="h-px bg-gray-100 w-full my-1" />

        <footer className="flex items-center justify-between">
          {/* Usuario Asignado */}
          <div className="flex items-center gap-2">
            {assignedUser ? (
              <div
                className="flex items-center gap-1.5"
                title={assignedUser.nombre}
              >
                <MemberAvatar
                  name={assignedUser.nombre}
                  size="sm"
                  className="size-6 text-[9px] border border-white shadow-sm"
                />
                <span className="text-[11px] font-medium text-gray-600 truncate max-w-[70px]">
                  {assignedUser.nombre?.split(" ")[0]}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400">
                <UserPlus className="size-3.5" />
                <span className="text-[10px] font-medium">Asignar</span>
              </div>
            )}
          </div>

          {/* Fecha Límite */}
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold
            ${estado === "completada" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"}`}
          >
            <Calendar className="size-3" />
            {formattedDate}
          </div>
        </footer>
      </article>

      {/* Modales */}
      {showEditModal && (
        <AddTaskModal
          showModal={showEditModal}
          closeModal={() => setShowEditModal(false)}
          projectId={proyecto_id || ""}
          taskToEdit={task}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeletion
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onSubmit={() => deleteTask(id!)}
          type="task"
        />
      )}
    </>
  );
}
