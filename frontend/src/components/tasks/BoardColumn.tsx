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
}

export function BoardColumn({
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
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col gap-4 rounded-2xl p-4 min-h-[300px] md:min-h-[500px] transition-all duration-200 border-2 ${
        isOver
          ? "bg-blue-50/50 border-blue-300 border-dashed scale-[1.01]"
          : "bg-gray-100/60 border-transparent"
      } ${className}`}
    >
      {/* Cabecera de la Columna */}
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {/* El icono usa el color dinámico definido en el estado */}
          <div
            className="p-1.5 rounded-lg shadow-sm"
            style={{ backgroundColor: color }}
          >
            <Icon className="size-4 text-white" />
          </div>
          <h3 className="font-bold text-gray-700 text-sm tracking-tight uppercase">
            {column}
          </h3>
        </div>

        {/* Contador circular */}
        <span className="flex items-center justify-center min-w-[24px] h-6 px-2 text-[11px] font-bold text-gray-500 bg-gray-200 rounded-full">
          {count}
        </span>
      </header>

      {/* Listado de Tareas */}
      <section className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-320px)] pr-1 custom-scrollbar">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} {...task} />)
        ) : (
          // Estado vacío si no hay tareas
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-xs text-gray-400 font-medium italic">
              No hay tareas
            </p>
          </div>
        )}

        {/* Botón rápido para añadir tarea (solo en la primera columna o donde se habilite) */}
        {showAdd && (
          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 w-full py-3 mt-1 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:text-blue-500 hover:border-blue-300 hover:bg-white transition-all text-sm font-medium group"
          >
            <Plus className="size-4 group-hover:scale-110 transition-transform" />
            Añadir Tarea
          </button>
        )}
      </section>
    </article>
  );
}
