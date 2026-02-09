"use client";

// Hooks
import { useEffect, useState, useRef } from "react";
// Contexts
import { useProjects } from "@/contexts/ProjectsContext";
import { useTasks } from "@/contexts/TasksContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTaskStatuses } from "@/contexts/TaskStatusesContext";
// Components
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { Button } from "../common/Button";
import { Plus, Loader2 } from "lucide-react";
import { BoardColumn } from "./BoardColumn";
import { AddTaskModal } from "./AddTaskModal";

export function ProjectDetails({ projectId }: { projectId: string }) {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const { mounted, user } = useAuth();
  const { getProjectById, selectedProject, states } = useProjects();
  const { fetchTasks, tasks, loading: tasksLoading, isDragging } = useTasks();
  const { statuses, loading: statusesLoading } = useTaskStatuses();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mounted && user) {
      getProjectById(projectId);
      fetchTasks(projectId);
    }
  }, [projectId, getProjectById, fetchTasks, mounted, user]);

  // RECUPERAR TODOS LOS DATOS DEL PROYECTO
  const { nombre, descripcion, miembros } = selectedProject || {};

  const breadcrumbsItems = [
    { label: "Inicio", href: "/" },
    { label: "Proyectos", href: "/projects" },
    { label: nombre || "", href: `/projects/${projectId}` },
  ];

  const handleAddTaskModal = () => {
    setShowAddTaskModal(!showAddTaskModal);
  };

  // --- LÓGICA DE AUTO-SCROLL AL ARRASTRAR ---
  const handleDragOverContainer = (e: React.DragEvent) => {
    const container = scrollContainerRef.current;
    if (!container || !isDragging) return;

    const { clientX } = e;
    const { left, width } = container.getBoundingClientRect();
    const edgeSize = 100; // Aumentado para mejor respuesta en bordes
    const scrollSpeed = 15; // Velocidad de scroll incrementada

    if (clientX - left < edgeSize) {
      container.scrollLeft -= scrollSpeed;
    } else if (left + width - clientX < edgeSize) {
      container.scrollLeft += scrollSpeed;
    }
  };

  // Loading states
  const isProjectLoading = states.loading && !selectedProject;
  const isInitialTaskLoad = tasksLoading && tasks.length === 0;
  const isStatusesLoading = statusesLoading && statuses.length === 0;
  const isLoading = isProjectLoading || isInitialTaskLoad || isStatusesLoading;

  // Show loader while data is being fetched
  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-gray-500 font-medium">
            {isProjectLoading
              ? "Cargando proyecto..."
              : isStatusesLoading
                ? "Cargando estados..."
                : "Cargando tareas..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error if project not found
  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">No se encontró el proyecto.</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 2xl:gap-8">
      <Breadcrumbs items={breadcrumbsItems} />
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 border-b-2 border-gray-200 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl 2xl:text-3xl font-bold max-w-xl">{nombre}</h1>
          <p className="text-gray-500 text-sm 2xl:text-base max-w-xs md:max-w-xl">
            {descripcion}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ul className="flex items-center border-0 md:border-r border-gray-200 pb-0 pr-4">
            {miembros?.map(({ id, nombre }) => (
              <li key={id} className="-ml-2">
                <MemberAvatar name={nombre} />
              </li>
            ))}
          </ul>
          <Button onClick={handleAddTaskModal}>
            <Plus />
            Nueva Tarea
          </Button>
        </div>
      </header>

      <section
        ref={scrollContainerRef}
        onDragOver={handleDragOverContainer}
        className={`flex md:grid md:grid-cols-3 gap-4 md:gap-6 min-h-[calc(100vh-280px)] overflow-x-auto pb-8 px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide select-none transition-all duration-300 ${
          isDragging ? "" : "snap-x snap-mandatory font-medium"
        }`}
      >
        {statuses
          .filter((status) => status.key !== "overdue")
          .map((status) => (
            <BoardColumn
              key={status.id}
              statusKey={status.key}
              column={status.name}
              count={
                tasks.filter(
                  (task) =>
                    task.estado === status.key || task.estado === status.name,
                ).length
              }
              Icon={({ className }) => (
                <div
                  className={`rounded-full ${className}`}
                  style={{ backgroundColor: status.color }}
                />
              )}
              color={status.color}
              tasks={tasks.filter(
                (task) =>
                  task.estado === status.key || task.estado === status.name,
              )}
              openModal={handleAddTaskModal}
              showAdd={status.key === "pending" || status.key === "pendiente"}
              className="w-[85vw] md:w-auto shrink-0 snap-center first:ml-0 md:first:ml-0"
            />
          ))}
      </section>

      <AddTaskModal
        showModal={showAddTaskModal}
        closeModal={handleAddTaskModal}
        projectId={projectId}
      />
    </section>
  );
}
