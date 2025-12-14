/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import ProjectCard from "@/components/projects/ProjectCard";

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedProjects = localStorage.getItem("worklyst_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("worklyst_projects", JSON.stringify(projects));
    }
  }, [projects, isLoaded]);

  const handleCreateProject = (newProject) => {
    setProjects([...projects, { ...newProject, id: crypto.randomUUID() }]);
    setIsModalOpen(false);
  };

  return (
    <main className="flex flex-col max-w-11/12 mx-auto mt-4 px-4 sm:px-6 lg:px-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Mis Proyectos
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700
        hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
        >
          Nuevo Proyecto
        </button>
      </header>

      {!isLoaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 bg-gray-100 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No hay proyectos aún
          </h3>
          <p className="text-gray-500 mb-6">
            Comienza creando tu primer proyecto
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 font-medium hover:text-blue-700 hover:underline cursor-pointer"
          >
            Crear proyecto ahora
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </section>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </main>
  );
}
