"use client";

// Hooks
import { useEffect, useState } from "react";
// Context
import { useProjects } from "@/contexts/ProjectsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TasksContext";
import { Plus } from "lucide-react";
import { TaskBoard } from "./TaskBoard";
import { AddTaskModal } from "./AddTaskModal";

interface TasksContainerProps {
  projectId: string;
}

export function TasksContainer({ projectId }: TasksContainerProps) {
  const [showTaskModal, setShowTaskModal] = useState(false);

  const { mounted, user } = useAuth();
  const { getProjectById, selectedProject, states } = useProjects();
  const { fetchTasks, tasks, loading: tasksLoading } = useTasks();

  useEffect(() => {
    if (mounted && user) {
      getProjectById(projectId);
      fetchTasks(projectId);
    }
  }, [projectId, getProjectById, fetchTasks, mounted, user]);

  if (states.loading || (tasksLoading && tasks.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!selectedProject) {
    return <div>No se encontró el proyecto.</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-10/12 mx-auto mt-12 min-h-screen">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{selectedProject.nombre}</h1>
          <p className="text-lg text-gray-600 max-w-xl">
            {selectedProject.descripcion}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg 
          shadow-blue-500/30 hover:bg-blue-600 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all"
          onClick={() => setShowTaskModal(true)}
        >
          <Plus /> Nueva tarea
        </button>
      </header>
      <TaskBoard openModal={() => setShowTaskModal(true)} tasks={tasks} />
      <AddTaskModal
        projectId={projectId}
        closeModal={() => setShowTaskModal(false)}
        showModal={showTaskModal}
      />
    </div>
  );
}
