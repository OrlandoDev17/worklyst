import { useParams } from "react-router-dom";
import { useProjects } from "../context/ProjectsContext";
import { useEffect } from "react";

export function ProjectDetail() {
  const { id } = useParams();

  const { project, getProjectById } = useProjects();

  useEffect(() => {
    getProjectById(id);
  }, [id]);

  return <main></main>;
}
