"use client";

// Hooks
import { useRef, useState } from "react";
import { useProjectModalAnimation } from "@/hooks/useProjectModalAnimation";
// Icons
import { Search, X } from "lucide-react";
// Components
import { ProjectInput } from "@/components/projects/ProjectInput";
// Context
import { useTasks } from "@/contexts/TasksContext";
import { Task } from "@/lib/types";

interface AddTaskModalProps {
  closeModal: () => void;
  showModal: boolean;
  projectId: string;
}

export function AddTaskModal({
  closeModal,
  showModal,
  projectId,
}: AddTaskModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useProjectModalAnimation(showModal, overlayRef, contentRef);

  const { createTask } = useTasks();

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const taskData: Task = {
      titulo: formData.get("titulo") as string,
      descripcion: formData.get("descripcion") as string,
      fechaLimite: formData.get("fechaLimite") as string,
      asignadoA: formData.get("asignadoA") as string,
      estado: formData.get("estado") as "pending" | "completed" | "in-progress",
    };

    await createTask(projectId, taskData);
    closeModal();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 opacity-0"
    >
      <article
        ref={contentRef}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg max-w-md w-full"
      >
        <header className="flex items-center justify-between">
          <h4 className="text-xl font-medium">Nueva Tarea</h4>
          <button onClick={closeModal}>
            <X className="p-2 size-10 rounded-lg text-gray-600 hover:bg-red-500 hover:text-white transition-colors duration-200" />
          </button>
        </header>
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <ProjectInput
            label="Titulo"
            name="titulo"
            placeholder="Ej. Diseñar la interfaz de usuario"
          />
          <ProjectInput
            label="Descripcion"
            name="descripcion"
            placeholder="Describe la tarea"
          />
          <label className="flex flex-col gap-2">
            Fecha Limite
            <input
              type="date"
              name="fechaLimite"
              id="fechaLimite"
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
          </label>
          <div className="relative mt-2">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400`}
            />
            <input
              type="text"
              name="asignadoA"
              placeholder="Asignar a..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Crear Tarea
          </button>
        </form>
      </article>
    </div>
  );
}
