"use client";

// Hooks
import { useEffect, useState, useRef, useLayoutEffect } from "react";
// Contexts
import { useProjects } from "@/contexts/ProjectsContext";
import { useTasks } from "@/contexts/TasksContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTaskStatuses } from "@/contexts/TaskStatusesContext";
// Components
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MemberAvatar } from "@/components/common/MemberAvatar";
import { Button } from "../common/Button";
import { Plus } from "lucide-react";
import { BoardColumn } from "./BoardColumn";
import { AddTaskModal } from "./AddTaskModal";
import { BoardColumnSkeleton } from "./skeleton/BoardColumnSkeleton";
// Icons
import { Circle, Clock, CheckCircle2, LucideIcon } from "lucide-react";
// Gsap
import gsap from "gsap";

export function ProjectDetails({ projectId }: { projectId: string }) {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const { mounted, user } = useAuth();
  const { getProjectById, selectedProject, states } = useProjects();
  const { fetchTasks, tasks, loading: tasksLoading, isDragging } = useTasks();
  const { statuses, loading: statusesLoading } = useTaskStatuses();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isProjectLoading = states.loading && !selectedProject;
  const isInitialTaskLoad = tasksLoading && tasks.length === 0;
  const isStatusesLoading = statusesLoading && statuses.length === 0;

  // Decidimos que parte esta cargando
  const showBoardSkeleton = isInitialTaskLoad || isStatusesLoading;

  useEffect(() => {
    if (mounted && user) {
      getProjectById(projectId);
      fetchTasks(projectId);
    }
  }, [projectId, getProjectById, fetchTasks, mounted, user]);

  // Animaciones de entrada
  useLayoutEffect(() => {
    if (!showBoardSkeleton && selectedProject) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // 1. Animamos el header
        tl.fromTo(
          ".header-anim",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        );

        // 2. Animamos las Columnas del tablero con un pequeño delay
        tl.fromTo(
          ".column-anim",
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.2)",
            stagger: 0.15,
          },
          "-=0.3", // Empezar un poco antes de que termine la anterior
        );
      });

      return () => ctx.revert();
    }
  }, [showBoardSkeleton, selectedProject]);

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

  const getIconByStatus = (key: string) => {
    switch (key) {
      case "pendiente":
      case "pending":
        return Circle;
      case "en_progreso":
      case "in_progress":
        return Clock;
      case "completada":
      case "completed":
        return CheckCircle2;
      default:
        return Circle;
    }
  };

  return (
    <section className="flex flex-col gap-6 2xl:gap-8">
      <Breadcrumbs items={breadcrumbsItems} />

      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 border-b-2 border-gray-200 pb-6">
        <div
          className={`flex flex-col gap-2 ${!showBoardSkeleton ? "header-anim" : ""}`}
          style={{ opacity: showBoardSkeleton ? 1 : 0 }}
        >
          <h1 className="text-2xl 2xl:text-3xl font-bold max-w-xl">
            {nombre || (
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            )}
          </h1>
          <div className="text-gray-500 text-sm 2xl:text-base max-w-xs md:max-w-xl">
            {descripcion || (
              <div className="flex flex-col gap-2 mt-2">
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <ul className="flex items-center border-0 md:border-r border-gray-200 pb-0 pr-4">
            {miembros ? (
              miembros.map(({ id, nombre }) => (
                <li key={id} className="-ml-2">
                  <MemberAvatar name={nombre} />
                </li>
              ))
            ) : (
              // Skeleton de miembros
              <div className="flex items-center -space-x-2 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-10 rounded-full bg-gray-200 border-2 border-white"
                  />
                ))}
              </div>
            )}
          </ul>
          <Button onClick={handleAddTaskModal} disabled={showBoardSkeleton}>
            <Plus />
            Nueva Tarea
          </Button>
        </div>
      </header>

      {/* ÁREA DEL TABLERO */}
      <section
        ref={scrollContainerRef}
        onDragOver={handleDragOverContainer}
        className={`flex md:grid md:grid-cols-3 gap-4 md:gap-6 min-h-[calc(100vh-280px)] overflow-x-auto pb-8 px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide select-none transition-all duration-300 ${
          isDragging ? "" : "snap-x snap-mandatory font-medium"
        }`}
      >
        {showBoardSkeleton ? (
          <BoardColumnSkeleton />
        ) : (
          statuses
            .filter((status) => status.key !== "overdue")
            .map((status) => (
              <div
                key={status.id}
                className="column-anim"
                style={{ opacity: 0 }}
              >
                <BoardColumn
                  key={status.id}
                  statusKey={status.key}
                  column={status.name}
                  count={
                    tasks.filter(
                      (task) =>
                        task.estado === status.key ||
                        task.estado === status.name,
                    ).length
                  }
                  Icon={getIconByStatus(status.key)}
                  color={status.color}
                  tasks={tasks.filter(
                    (task) =>
                      task.estado === status.key || task.estado === status.name,
                  )}
                  openModal={handleAddTaskModal}
                  showAdd={
                    status.key === "pending" || status.key === "pendiente"
                  }
                  className={`w-[85vw] md:w-auto shrink-0 snap-center first:ml-0 md:first:ml-0 `}
                />
              </div>
            ))
        )}
      </section>

      <AddTaskModal
        showModal={showAddTaskModal}
        closeModal={handleAddTaskModal}
        projectId={projectId}
      />
    </section>
  );
}
