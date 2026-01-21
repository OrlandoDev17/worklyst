import { ProjectsStatus } from "../../lib/constants";

export function ProjectStats({ projects }) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {ProjectsStatus.map(
        ({ label, status, bgColor, borderColor, textColor, ringColor }) => {
          const value = {
            total: projects.length,
            completed: projects.filter((p) => p.status === "Completado").length,
            inprogress: projects.filter((p) => p.status === "En Progreso")
              .length,
            overdue: projects.filter((p) => p.status === "Pendiente").length,
          }[status];

          return (
            <li
              key={status}
              className={`flex flex-col gap-2 p-4 ${bgColor} rounded-xl border-r-4 border-b-4 ${borderColor} ring-1 ${ringColor}`}
            >
              <h3 className="text-lg text-gray-700 font-medium">{label}</h3>
              <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
            </li>
          );
        },
      )}
    </ul>
  );
}
