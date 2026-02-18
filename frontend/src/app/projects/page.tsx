"use client";

// Components
import { CreateProjectCard } from "@/components/projects/CreateProjectCard";
import { ProjectStateCard } from "@/components/projects/ProjectStateCard";
// Skeleton Components
import { ProjectStateSkeleton } from "@/components/projects/skeleton/ProjectStateSkeleton";
import { ProjectCardSkeleton } from "@/components/projects/skeleton/ProjectCardSkeleton";
// Hooks
import { useEffect, useMemo, useState } from "react";
// Contexts
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectsContext";
//Constants
import { PROJECT_STATES } from "@/lib/constants";
// Icons
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { ConfirmDeletion } from "@/components/common/ConfirmDeletion";
import { AddMemberModal } from "@/components/projects/AddMemberModal";
import { RemoveMemberModal } from "@/components/projects/RemoveMemberModal";
import { Button } from "@/components/common/Button";
import type { Project, User } from "@/lib/types";

import gsap from "gsap";

export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  // States for card modals
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToAddMember, setProjectToAddMember] = useState<Project | null>(
    null,
  );
  const [projectToRemoveMember, setProjectToRemoveMember] =
    useState<Project | null>(null);

  const {
    fetchProjects,
    projects,
    createProject,
    states,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
  } = useProjects();
  const { user, mounted } = useAuth();
  const isLoading = states.loading && !isDataReady;

  useEffect(() => {
    async function loadData() {
      if (mounted && user) {
        await fetchProjects();

        setIsDataReady(true);
      }
    }

    loadData();
  }, [mounted, user, fetchProjects]);

  useEffect(() => {
    async function handleRefreshData() {
      if (mounted && user) {
        await fetchProjects();

        setIsDataReady(true);
      }
    }

    handleRefreshData();

    window.addEventListener("refresh_worklyst_data", handleRefreshData);
    return () =>
      window.removeEventListener("refresh_worklyst_data", handleRefreshData);
  }, [fetchProjects]);

  useEffect(() => {
    // Solo animamos si ya no esta cargando y hay proyectos
    if (!isLoading && projects.length > 0) {
      gsap.fromTo(
        ".project-card-anim",
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
        },
      );
    }
  }, [isLoading, projects.length]);

  const welcomeMessage = useMemo(() => {
    if (!user?.nombre) return "Usuario";
    const names = user.nombre.split(" ");
    const firstName = names[0];
    const lastInitial = names[1] ? ` ${names[1].charAt(0).toUpperCase()}.` : "";
    return `${firstName}${lastInitial}`;
  }, [user?.nombre]);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  // --- Modal Handlers ---

  const handleEditSubmit = async (projectData: Project) => {
    const success = await updateProject(projectToEdit!.id!, projectData);
    if (success) setProjectToEdit(null);
    return success;
  };

  const handleDeleteSubmit = async () => {
    const success = await deleteProject(projectToDelete!.id!);
    if (success) setProjectToDelete(null);
    return success;
  };

  const handleAddMemberSubmit = async (user: User) => {
    const success = await addMember(projectToAddMember!.id!, user.id!, 0);
    if (success) setProjectToAddMember(null);
    return success;
  };

  const handleRemoveMemberSubmit = async (userId: string) => {
    const success = await removeMember(projectToRemoveMember!.id!, userId);
    if (success) setProjectToRemoveMember(null);
    return success;
  };

  return (
    <main className="min-h-screen flex flex-col gap-4 2xl:gap-8 mt-8 2xl:mt-12 max-w-11/12 2xl:max-w-10/12 mx-auto relative">
      <header className="flex flex-col gap-4">
        <h2 className="text-lg 2xl:text-xl text-blue-500 font-semibold">
          👋 ¡Bienvenido, {mounted && welcomeMessage}!
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold tracking-wide">
              Mis Proyectos
            </h1>
            <p className="text-xs md:text-sm 2xl:text-base text-gray-500">
              Administra tus proyectos grupales aquí
            </p>
          </div>
          <Button onClick={handleShowModal}>
            <Plus />
            Nuevo Proyecto
          </Button>
        </div>
      </header>

      {isLoading ? (
        <>
          <ProjectStateSkeleton />
          <ProjectCardSkeleton />
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mt-2 2xl:mt-0">
            {PROJECT_STATES.map((state) => {
              // Calcular valor dinamicamente
              const value =
                state.id === "total"
                  ? projects.length
                  : projects.filter((p) => p.estado === state.id).length;

              return (
                <div key={state.id} className="project-card-anim">
                  <ProjectStateCard {...state} value={value} />
                </div>
              );
            })}
          </div>
          <ul
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-h-48 2xl:min-h-72 mt-4 2xl:mt-0 transition-opacity duration-500 ${isDataReady ? "opacity-100" : "opacity-0"}`}
          >
            {projects.map((project, index) => (
              <li
                key={project?.id || `project-${index}`}
                className="col-span-2 project-card-anim"
                style={{ opacity: 0 }}
              >
                <ProjectCard
                  {...project}
                  onEdit={(p) => setProjectToEdit(p)}
                  onDelete={(p) => setProjectToDelete(p)}
                  onAddMember={(p) => setProjectToAddMember(p)}
                  onRemoveMember={(p) => setProjectToRemoveMember(p)}
                />
              </li>
            ))}
            <li className="col-span-2 project-card-anim" style={{ opacity: 0 }}>
              <CreateProjectCard onClick={handleShowModal} />
            </li>
          </ul>
        </>
      )}

      {/* Modal para crear el Proyecto */}
      <CreateProjectModal
        onSubmit={createProject}
        showModal={showModal}
        setShowModal={setShowModal}
      />

      {/* Modal de Edición */}
      {projectToEdit && (
        <CreateProjectModal
          showModal={!!projectToEdit}
          setShowModal={(show) => !show && setProjectToEdit(null)}
          initialData={projectToEdit}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Modal de Eliminación */}
      {projectToDelete && (
        <ConfirmDeletion
          type="project"
          isOpen={!!projectToDelete}
          onClose={() => setProjectToDelete(null)}
          onSubmit={handleDeleteSubmit}
        />
      )}

      {/* Modal de Agregar Miembro */}
      {projectToAddMember && (
        <AddMemberModal
          isOpen={!!projectToAddMember}
          onClose={() => setProjectToAddMember(null)}
          onAddMember={handleAddMemberSubmit}
          currentMembers={projectToAddMember.miembros}
        />
      )}

      {/* Modal de Eliminar Miembro */}
      {projectToRemoveMember && (
        <RemoveMemberModal
          isOpen={!!projectToRemoveMember}
          onClose={() => setProjectToRemoveMember(null)}
          onRemoveMember={handleRemoveMemberSubmit}
          members={projectToRemoveMember.miembros || []}
        />
      )}
    </main>
  );
}
