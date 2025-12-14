import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <article className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3 h-full">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-400 border border-gray-100 px-2 py-1 rounded-full">
            {project.durationValue}{" "}
            {project.durationUnit === "weeks"
              ? "Semanas"
              : project.durationUnit}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">
            {project.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {project.description}
          </p>
        </div>

        <div className="mt-auto pt-3 flex items-center gap-2 border-t border-gray-50">
          <div className="flex -space-x-2">
            {project.participants.slice(0, 3).map((participant, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700"
                title={participant}
              >
                {participant.charAt(0).toUpperCase()}
              </div>
            ))}
            {project.participants.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                +{project.participants.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400 ml-auto">
            {project.participants.length} Participantes
          </span>
        </div>
      </article>
    </Link>
  );
}
