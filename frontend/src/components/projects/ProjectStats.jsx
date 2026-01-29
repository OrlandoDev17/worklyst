import { ProjectsStatus } from "../../lib/constants";

export function ProjectStats({ projects }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {ProjectsStatus.map(
        ({ label, estado, bgColor, borderColor, textColor, ringColor }) => {
          const value = {
            total: projects.length,
            completed: projects.filter((p) => p.estado === "completed").length,
            active: projects.filter((p) => p.estado === "active").length,
            overdue: projects.filter((p) => p.estado === "overdue").length,
          }[estado];

          return (
            <li
              key={estado}
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
