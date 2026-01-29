import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus, Search, X, Check, Options } from "../common/Icons";
import { useUsers } from "../../context/UsersContext";
import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectsContext";
import { ProjectModal } from "./ProjectModal";
import { AddMemberModal } from "./AddMemberModal";

export function ProjectCard({
  id,
  nombre,
  descripcion,
  estado,
  miembros = [],
  creadorId,
  creadoEn,
  actualizadoEn,
}) {
  const { getUserById, searchUsers, loading: isSearching } = useUsers();
  const { user: authUser } = useAuth();
  const { deleteProject, updateProject, addMemberToProject } = useProjects();

  const [creatorUser, setCreatorUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Detectar si el creador es el bot y usar el usuario autenticado en su lugar
  const isBotCreator =
    creadorId === "IA System Bot" ||
    creadorId === "ia-system-bot" ||
    creadorId === "IA_SYSTEM_BOT";

  const effectiveCreatorId = isBotCreator ? authUser?.id : creadorId;

  useEffect(() => {
    // Solo buscar el creador si no es el bot
    if (!isBotCreator && effectiveCreatorId) {
      getUserById(effectiveCreatorId).then((data) => {
        if (data) setCreatorUser(data);
      });
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
  const remainingCount = allMembers.length - 4;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const status = {
    active: {
      text: "En Progreso",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    inactive: {
      text: "Inactivo",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    completed: {
      text: "Completado",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
  };

  const handleAddMember = async (e, member) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Primero buscamos por ID para asegurar que tenemos la información más reciente
      const fullMember = await getUserById(member.id);

      if (fullMember) {
        // Luego lo añadimos al proyecto
        await addMemberToProject(id, fullMember.id);
      }
    } catch (error) {
      console.error("Error al añadir miembro:", error);
    }

    setShowAddMember(false);
    setSearch("");
    setSuggestions([]);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteProject(id);
    setShowDeleteConfirm(false);
  };

  const handleUpdate = async (e, projectData) => {
    e.preventDefault();
    e.stopPropagation();
    await updateProject(id, projectData);
    setShowEditModal(false);
  };

  // Búsqueda de miembros para el mini-input
  useEffect(() => {
    const performSearch = async () => {
      if (search.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const results = await searchUsers(search);
        const filtered = results.filter(
          (u) => u.id !== authUser?.id && !miembros.find((m) => m.id === u.id),
        );
        setSuggestions(filtered);
      } catch (error) {
        console.error("Error en búsqueda:", error);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [search, miembros, authUser, searchUsers]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <Link to={`/projects/${id}`}>
      <article
        className="flex flex-col gap-4 bg-gray-20 rounded-2xl p-6 border border-gray-200 shadow-lg shadow-gray-300 h-full group hover:-translate-y-2
      hover:shadow-gray-400 transition-all duration-300"
      >
        <header className="flex justify-between items-center border-b border-gray-200 pb-2">
          <h3 className="text-2xl font-semibold first-letter:uppercase group-hover:text-blue-500 transition-all duration-300">
            {nombre}
          </h3>
          <div className="relative dropdown-container">
            <button
              className="p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-all duration-300 cursor-pointer"
              onClick={toggleDropdown}
            >
              <Options />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowEditModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  Editar proyecto
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAddMember(true);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  <Plus className="size-4" />
                  Añadir miembro
                </button>
                <div className="h-px bg-gray-100 my-1 mx-2" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  Eliminar proyecto
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
          <span className="text-sm text-gray-500">
            Creado: {formatDate(creadoEn)}
          </span>
          <p className="text-gray-700 text-lg">{descripcion}</p>
          <div className="flex items-center">
            <span
              className={`px-6 py-0.5 rounded-full font-medium ${status[estado].color}`}
            >
              {status[estado].text}
            </span>
          </div>
        </div>
        <footer className="flex items-center justify-between">
          <ul className="flex items-center gap-2">
            {displayMembers.map((member, idx) => (
              <li
                className="flex items-center justify-center size-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-md relative hover:scale-110 transition-transform duration-300 cursor-pointer"
                key={member.id}
                title={member.nombre || member.usuario}
              >
                <span className="text-white font-semibold text-sm">
                  {getInitials(member?.nombre)}
                </span>
                {idx === 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-3.5 bg-green-500 border-2 border-white"></span>
                  </span>
                )}
              </li>
            ))}
            {remainingCount > 0 && (
              <li className="flex items-center justify-center size-10 bg-linear-to-br from-gray-300 to-gray-400 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer">
                <span className="text-white font-semibold text-sm">
                  +{remainingCount}
                </span>
              </li>
            )}
          </ul>
          <span className="text-gray-500 text-sm">
            Actualizado: {formatDate(actualizadoEn)}
          </span>
        </footer>
      </article>

      {/* MODAL EDICIÓN */}
      {showEditModal && (
        <ProjectModal
          onClose={() => setShowEditModal(false)}
          onAddProject={handleUpdate}
          project={{ id, nombre, descripcion, miembros, estado }}
        />
      )}

      {/* CONFIRMACIÓN ELIMINACIÓN */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <article className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl ">
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              ¿Eliminar proyecto?
            </h4>
            <p className="text-gray-500 mb-6 italic">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Eliminar
              </button>
            </div>
          </article>
        </div>
      )}

      {/* AÑADIR MIEMBRO (MINI UI) */}
      {showAddMember && (
        <AddMemberModal
          setShowAddMember={setShowAddMember}
          search={search}
          setSearch={setSearch}
          isSearching={isSearching}
          suggestions={suggestions}
          handleAddMember={handleAddMember}
        />
      )}
    </Link>
  );
}
