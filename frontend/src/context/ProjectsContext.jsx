/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const ProjectsContext = createContext();

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}

export function ProjectsProvider({ children }) {
  // Load from localStorage or start empty
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("worklyst_projects");
    return saved ? JSON.parse(saved) : [];
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem("worklyst_projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = (project) => {
    // Add columns/tasks structure to new projects
    const newProject = {
      ...project,
      tasks: {
        todo: [],
        inprogress: [],
        done: [],
      },
    };
    setProjects((prev) => [...prev, newProject]);
    addToast("Proyecto creado con éxito", "success");
  };

  const getProject = (id) => {
    return projects.find((p) => p.id.toString() === id.toString());
  };

  const deleteProject = (id) => {
    setProjects((prev) =>
      prev.filter((p) => p.id.toString() !== id.toString()),
    );
    addToast("Proyecto eliminado correctamente", "success");
  };

  const addTask = (projectId, columnId, task) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id.toString() === projectId.toString()) {
          return {
            ...project,
            tasks: {
              ...project.tasks,
              [columnId]: [
                ...project.tasks[columnId],
                { ...task, id: Date.now().toString() },
              ],
            },
          };
        }
        return project;
      }),
    );
    addToast("Tarea añadida correctamente", "success");
  };

  const moveTask = (projectId, sourceCol, destCol, sourceIndex, destIndex) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id.toString() === projectId.toString()) {
          const sourceList = [...project.tasks[sourceCol]];
          const destList =
            sourceCol === destCol ? sourceList : [...project.tasks[destCol]];

          const [movedTask] = sourceList.splice(sourceIndex, 1);

          if (sourceCol === destCol) {
            sourceList.splice(destIndex, 0, movedTask);
            return {
              ...project,
              tasks: {
                ...project.tasks,
                [sourceCol]: sourceList,
              },
            };
          } else {
            destList.splice(destIndex, 0, movedTask);
            return {
              ...project,
              tasks: {
                ...project.tasks,
                [sourceCol]: sourceList,
                [destCol]: destList,
              },
            };
          }
        }
        return project;
      }),
    );
    addToast("Tarea movida", "info");
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        getProject,
        addTask,
        moveTask,
        deleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}
