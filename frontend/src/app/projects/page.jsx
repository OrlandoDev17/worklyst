"use client";

import { useState } from "react";
import CreateProjectModal from "@/components/CreateProjectModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Projects() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Overhaul of the corporate website with new branding.",
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      status: "In Progress",
    },
    {
      id: 2,
      name: "Mobile App Launch",
      description: "Launch of the new iOS and Android applications.",
      startDate: "2024-01-15",
      enabled: true,
      status: "Planning",
    },
  ]);

  const handleCreateProject = (projectData) => {
    const newProject = {
      ...projectData,
      id: projects.length + 1,
      status: "New",
    };
    setProjects([...projects, newProject]);
    // Navigate to the new project page (simulated)
    router.push(`/projects/${newProject.id}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
            <p className="mt-2 text-gray-600">
              Gestiona y monitorea todos tus proyectos en un solo lugar.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            + Nuevo Proyecto
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No hay proyectos aún
            </h3>
            <p className="mt-1 text-gray-500">
              Comienza creando tu primer proyecto.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 rounded-lg text-blue-600 hover:text-blue-500 hover:underline"
            >
              Crear proyecto
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="group relative flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-gray-100 hover:border-blue-100"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      {project.name}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        project.status === "In Progress"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status || "Active"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {project.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4 text-xs text-gray-400">
                  <span>
                    Inicio: {new Date(project.startDate).toLocaleDateString()}
                  </span>
                  {project.endDate && (
                    <span>
                      Fin: {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <CreateProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProject}
        />
      </div>
    </main>
  );
}
