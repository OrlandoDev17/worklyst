import { useParams } from "react-router-dom";
import { useProjects } from "../context/ProjectsContext";
import { useEffect } from "react";
import { Plus } from "lucide-react";

export function ProjectDetail() {
  const { id } = useParams();

  const { getProjectById, project } = useProjects();

  useEffect(() => {
    getProjectById(id);
  }, [id]);

  return (
    <main className="flex flex-col gap-4 mt-6 max-w-9/12 w-full mx-auto">
      <header className="flex items-center justify-between gap-2 ">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold max-w-lg">{project?.nombre}</h1>
          <p className="text-lg text-gray-500 max-w-md">
            {project?.descripcion}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 text-white bg-blue-400 rounded-lg hover:bg-blue-500 hover:-translate-y-1
        transition-all duration-300 cursor-pointer"
        >
          Invitar Miembro <Plus />
        </button>
      </header>
    </main>
  );
}
