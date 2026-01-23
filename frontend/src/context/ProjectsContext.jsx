/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";
import { useToast } from "./ToastContext";
import axios from "axios";

const ProjectsContext = createContext();

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}

export function ProjectsProvider({ children }) {
  // Carga proyectos desde la BD o inicia con un array vacío
  const [state, setState] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const [projects, setProjects] = useState([]);

  const { addToast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL;

  // Función auxiliar para obtener headers actualizados
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("tokenAcceso")}`,
  });

  const addProject = async (projectData) => {
    // Añadir un Proyecto
    setState({ loading: true, error: null, success: false });
    try {
      // La API espera: { nombre, descripcion, miembros: [] }
      // Aseguramos que los miembros sean un array (por ahora vacío si no hay UUIDs válidos)
      const payload = {
        nombre: projectData.nombre,
        descripcion: projectData.descripcion,
        miembros: [], // TODO: Implementar búsqueda de usuarios para enviar UUIDs reales
      };

      const res = await axios.post(`${API_URL}/api/projects`, payload, {
        headers: getHeaders(),
      });

      setState({ loading: false, error: null, success: true });
      // La API retorna { mensaje, proyecto: {...} }
      setProjects((prev) => [...prev, res.data.proyecto]);
      addToast("Proyecto añadido correctamente", "success");
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      const msg =
        error.response?.data?.mensaje ||
        error.message ||
        "Error al crear proyecto";
      setState({ loading: false, error: msg, success: false });
      addToast(msg, "error");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const getProjects = async () => {
    setState({ loading: true, error: null, success: false });
    try {
      const res = await axios.get(`${API_URL}/api/projects`, {
        headers: getHeaders(),
      });
      setState({ loading: false, error: null, success: true });
      // La API retorna un array de proyectos directamente
      setProjects(res.data);
      // No mostramos toast cada vez que se cargan, es invasivo
      // addToast("Proyectos cargados correctamente", "success");
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
      const msg =
        error.response?.data?.mensaje ||
        error.message ||
        "Error al cargar proyectos";
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
        state,
        addProject,
        getProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}
