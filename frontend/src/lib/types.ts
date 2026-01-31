import { ComponentType } from "react";

export interface NavbarItem {
  label: string;
  href: string;
}

export interface Feature {
  id?: string;
  title: string;
  description: string;
  icon: ComponentType<{ className: string }>;
  iconColor: string;
  iconBgColor: string;
}

export interface AuthForm {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}

export interface User {
  id?: string;
  usuario?: string;
  email: string;
  password?: string;
  nombre?: string;
}

export interface ProjectState {
  id?: string;
  titulo: string;
  value?: number;
  color?: string;
  borderColor?: string;
  hoverBgColor?: string;
  aditionalInfo?: string;
}

export interface Project {
  id?: string;
  nombre: string;
  descripcion?: string;
  estado?: "active" | "completed" | "overdue";
  creadoEn?: string;
  actualizadoEn?: string;
  miembros?: string[] | undefined;
  creadorId?: string;
}

export interface Task {
  id?: string;
  titulo: string;
  descripcion: string;
  estado: "pending" | "in-progress" | "completed";
  asignadoA?: string;
  fechaLimite?: string;
  creadoEn?: string;
}
