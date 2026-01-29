/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";
import { useToast } from "./ToastContext";
import api from "../lib/api";

const ProjectsContext = createContext();

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}

export function ProjectsProvider({ children }) {
  const [state, setState] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);

  const { addToast } = useToast();

  const addProject = async (projectData) => {
    setState({ loading: true, error: null, success: false });
    try {
      const res = await api.post("/api/projects", projectData);
      setState({ loading: false, error: null, success: true });
      setProjects((prev) => [...prev, res.data]);
      addToast("Proyecto añadido correctamente", "success");
    } catch (error) {
      const msg = error.response?.data?.mensaje || "Error al crear proyecto";
      setState({ loading: false, error: msg, success: false });
      addToast(msg, "error");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const getProjects = async () => {
    setState({ loading: true, error: null, success: false });
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data);
    } catch (error) {
      const msg = error.response?.data?.mensaje || "Error al cargar proyectos";
      setState({ loading: false, error: msg, success: false });
      addToast(msg, "error");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const getProjectById = async (id) => {
    setState({ loading: true, error: null, success: false });
    try {
      const res = await api.get(`/api/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      const msg =
        error.response?.data?.mensaje ||
        error.message ||
        "Error al cargar proyecto";
      setState({ loading: false, error: msg, success: false });
      addToast(msg, "error");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setState({ loading: false, error: null, success: true });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      addToast("Proyecto eliminado correctamente", "success");
    } catch (error) {
      const msg = error.response?.data?.mensaje || "Error al eliminar proyecto";
      setState({ loading: false, error: msg, success: false });
      addToast(msg, "error");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      await api.put(`/api/projects/${id}`, projectData);
      setState({ loading: false, error: null, success: true });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...projectData } : p)),
      );
      addToast("Proyecto actualizado correctamente", "success");
    } catch (error) {
      const msg =
        error.response?.data?.mensaje || "Error al actualizar proyecto";
      setState({ loading: false, error: msg, success: false });
      addToast(msg, "error");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const addMemberToProject = async (id, memberId) => {
    try {
      await api.post(`/api/projects/${id}/members`, { memberId });
      setState({ loading: false, error: null, success: true });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, miembros: [...p.miembros, memberId] } : p,
        ),
      );
      addToast("Miembro añadido correctamente", "success");
    } catch (error) {
      const msg = error.response?.data?.mensaje || "Error al añadir miembro";
      setState({ loading: false, error: msg, success: false });
      addToast(msg, "error");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        project,
        state,
        addProject,
        getProjects,
        getProjectById,
        deleteProject,
        updateProject,
        addMemberToProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}
