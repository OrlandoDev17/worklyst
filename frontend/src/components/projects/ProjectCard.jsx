import { Link } from "react-router-dom";
import { Options } from "../common/Icons";
import { useUsers } from "../../context/UsersContext";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export function ProjectCard({
  id,
  nombre,
  descripcion,
  status,
  miembros = [],
  creadorId,
  creadoEn,
  actualizadoEn,
  onClick,
}) {
  const { getUserById, user: creatorUser } = useUsers();
  const { user: authUser } = useAuth();

  // Detectar si el creador es el bot y usar el usuario autenticado en su lugar
  const isBotCreator =
    creadorId === "IA System Bot" ||
    creadorId === "ia-system-bot" ||
    creadorId === "IA_SYSTEM_BOT";

  const effectiveCreatorId = isBotCreator ? authUser?.id : creadorId;

  useEffect(() => {
    // Solo buscar el creador si no es el bot
    if (!isBotCreator && effectiveCreatorId) {
      getUserById(effectiveCreatorId);
    }
  }, [getUserById, effectiveCreatorId, isBotCreator]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Asegurar que el creador esté en la lista y sea el primero
  // Si el creador es el bot, usar el usuario autenticado
  const displayCreator = isBotCreator ? authUser : creatorUser;

  const allMembers = [
    displayCreator ? { ...displayCreator, id: effectiveCreatorId } : null,
    ...(Array.isArray(miembros) ? miembros : []).filter(
      (m) => m?.id !== effectiveCreatorId,
    ),
  ].filter(Boolean);

  const displayMembers = allMembers.slice(0, 4);
  const remainingCount = Math.max(0, allMembers.length - 4);

  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-amber-100 text-amber-600",
    "bg-emerald-100 text-emerald-600",
    "bg-purple-100 text-purple-600",
    "bg-rose-100 text-rose-600",
  ];

  const getStatusColor = (s) => {
    switch (s) {
      case "Completado":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "En Progreso":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        // Default color for other statuses, if any
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Link to={`/projects/${id}`} className="block h-full">
      <article className="group relative flex flex-col h-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">
        <header className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
                {nombre}
              </h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onClick && onClick(e);
                }}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors -mr-2"
                aria-label="Opciones del proyecto"
              >
                <Options className="size-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {status && (
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${getStatusColor(
                    status,
                  )}`}
                >
                  {status}
                </span>
              )}
              {creadoEn && (
                <time
                  dateTime={creadoEn}
                  className="text-xs text-gray-400 font-medium"
                >
                  Creado: {formatDate(creadoEn)}
                </time>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 mb-6">
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {descripcion || "Sin descripción disponible para este proyecto."}
          </p>
        </div>

        <footer className="mt-auto border-t border-gray-50 pt-4 flex items-center justify-between">
          <div className="flex -space-x-3 items-center pl-1">
            {displayMembers.length > 0 ? (
              displayMembers.map((member, idx) => (
                <div
                  key={member.id || idx}
                  className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2 border-white ring-1 ring-gray-100 ${
                    colors[idx % colors.length]
                  } text-xs font-bold shadow-sm select-none transition-transform hover:z-10 hover:scale-105`}
                  title={member.nombre || member.usuario}
                >
                  {getInitials(member.nombre || member.usuario)}
                  {member.id && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400 border-2 border-white"></span>
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 text-gray-400 border-2 border-dashed border-gray-200 text-xs"
                title="Sin miembros asignados"
              >
                ?
              </div>
            )}

            {remainingCount > 0 && (
              <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-white bg-gray-50 text-gray-600 text-xs font-bold shadow-sm z-10 ring-1 ring-gray-200">
                +{remainingCount}
              </div>
            )}
          </div>

          {actualizadoEn && (
            <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">
              Act: {formatDate(actualizadoEn)}
            </span>
          )}
        </footer>
      </article>
    </Link>
  );
}
