"use client";

import { useState } from "react";
// Types
import { Task } from "@/lib/types";
// Components
import { TaskCard } from "./TaskCard";
import { AddTaskCard } from "./AddTaskCard";
// Contexts
import { useTasks } from "@/contexts/TasksContext";
// Icons
import { Plus } from "lucide-react";

interface BoardColumnProps {
  statusKey: "pendiente" | "en_progreso" | "completada" | string;
  column: string;
  count: number;
  Icon: React.ComponentType<{ className: string }>;
  color: string;
  tasks: Task[];
  openModal: () => void;
  showAdd?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function BoardColumn({
  style,
  statusKey,
  column,
  count,
  Icon,
  color,
  tasks,
  openModal,
  showAdd,
  className,
}: BoardColumnProps) {
  // Extraemos las funciones de movimiento del contexto
  const { moveTask, setIsDragging, draggedTaskId, setDraggedTaskId } =
    useTasks();

  // Estado local para el feedback visual del Drag Over
  const [isOver, setIsOver] = useState(false);

  // --- LÓGICA DE DRAG & DROP ---

  // Se ejecuta cuando una tarea entra en el área de la columna
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Obligatorio para permitir el drop
    setIsOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  // Se ejecuta cuando el elemento arrastrado sale del área
  const handleDragLeave = () => {
    setIsOver(false);
  };

  // Se ejecuta cuando soltamos la tarea en esta columna
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    setIsDragging(false);

    // Recuperamos el ID de la tarea
    let taskId = e.dataTransfer.getData("taskId");

    // Fallback para móviles que no soportan dataTransfer correctamente
    if (!taskId && draggedTaskId) {
      taskId = draggedTaskId;
    }

    if (taskId) {
      // Movemos la tarea al estado que representa esta columna
      await moveTask(taskId, statusKey as any);
      setDraggedTaskId(null);
    }
  };

  return (
    <article
      style={style}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col gap-5 bg-gray-100 rounded-2xl p-4 min-h-[500px] transition-all duration-300 border-2 ${
        isOver
          ? "bg-blue-50/40 border-blue-200 border-dashed scale-[1.01]"
          : "bg-gray-50/50 border-transparent hover:bg-gray-50/80"
      } ${className}`}
    >
      {/* Cabecera de la Columna (Rediseñada) */}
      <header className="flex items-center justify-between pb-2 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          {/* Icono con fondo sutil */}
          <div
            className="p-2 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${color}15`, // Color con 15% de opacidad
              color: color,
            }}
          >
            <Icon className="size-5" />
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold text-gray-800 text-sm tracking-tight capitalize">
              {column.replace("_", " ")}
            </h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
              {count} {count === 1 ? "Tarea" : "Tareas"}
            </p>
          </div>
        </div>

        {/* Botón rápido de añadir (Opcional en el header para que se vea más pro) */}
        {showAdd && (
          <button
            onClick={openModal}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:text-blue-500 hover:shadow-sm transition-all"
          >
            <Plus className="size-4" />
          </button>
        )}
      </header>

      {/* Listado de Tareas */}
      <section className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-340px)] pr-1 custom-scrollbar">
        {tasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div key={task.id} className="task-card-anim">
                <TaskCard {...task} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200/60 rounded-2xl bg-white/30">
            <div className="p-3 bg-gray-100 rounded-full mb-2">
              <Icon className="size-5 text-gray-300" />
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              Sin tareas pendientes
            </p>
          </div>
        )}

        {showAdd && (
          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 w-full py-3 mt-2 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-white transition-all text-xs font-semibold group bg-transparent"
          >
            <Plus className="size-3.5 group-hover:rotate-90 transition-transform duration-300" />
            Nueva tarea
          </button>
        )}
      </section>
    </article>
  );
}
