import { Link } from "react-router-dom";
import { Calendar, Options, Users } from "../common/Icons";

export function ProjectCard({
  id,
  nombre,
  descripcion,
  status,
  miembros,
  fecha,
  onClick,
}) {
  return (
    <Link to={`/projects/${id}`}>
      <article className="flex flex-col gap-4 p-6 rounded-xl border border-gray-200 hover:border-yellow-500 hover:bg-amber-50 transition cursor-pointer min-h-full">
        <header className="flex justify-between items-center">
          <h3 className="text-xl font-medium">{nombre}</h3>
          <button
            onClick={onClick}
            className="p-2 hover:bg-gray-200 transition rounded-full cursor-pointer"
          >
            <Options />
          </button>
        </header>
        <div className="flex flex-col items-start gap-2">
          <p className="text-gray-600 max-w-md">{descripcion}</p>
          <span className="border border-gray-200 rounded-full px-4 py-0.5 text-gray-700">
            {status}
          </span>
        </div>
        <footer className="flex justify-between items-center">
          <h4 className="flex items-center gap-3 text-lg text-gray-800">
            <Users className="size-6 text-gray-800" />
            {miembros}
          </h4>
          <h4 className="flex items-center gap-3 text-lg text-gray-800">
            <Calendar className="size-6 text-gray-800" />
            {fecha}
          </h4>
        </footer>
      </article>
    </Link>
  );
}
