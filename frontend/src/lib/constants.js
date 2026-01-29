import {
  Bot,
  ChartNoAxesColumn,
  FileChartColumn,
  Handshake,
  Timer,
} from "lucide-react";

export const LoginForm = [
  {
    label: "Correo Electronico",
    name: "email",
    type: "email",
    placeholder: "tucorreo@gmail.com",
  },
  {
    label: "Contraseña",
    name: "password",
    type: "password",
    placeholder: "********",
  },
];

export const RegisterForm = [
  {
    label: "Nombre Completo",
    name: "usuario",
    type: "text",
    placeholder: "John Doe",
  },
  {
    label: "Correo Electronico",
    name: "email",
    type: "email",
    placeholder: "tucorreo@gmail.com",
  },
  {
    label: "Contraseña",
    name: "password",
    type: "password",
    placeholder: "********",
  },
];

export const NavbarItems = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Proyectos",
    href: "/projects",
  },
  {
    label: "Comunidad",
    href: "/community",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
];

export const ProjectsStatus = [
  {
    label: "Proyectos Totales",
    value: 0,
    estado: "total",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
    textColor: "text-blue-500",
    ringColor: "ring-blue-500/20",
  },
  {
    label: "Completados",
    value: 0,
    estado: "completed",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500",
    textColor: "text-green-500",
    ringColor: "ring-green-500/20",
  },
  {
    label: "En Progreso",
    value: 0,
    estado: "active",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-500",
    ringColor: "ring-yellow-500/20",
  },
  {
    label: "Atrasados",
    value: 0,
    estado: "overdue",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500",
    textColor: "text-red-500",
    ringColor: "ring-red-500/20",
  },
];

export const Features = [
  {
    id: "bot",
    icon: Bot,
    title: "Agente IA Especializado",
    description:
      "Obtén sugerencias inteligentes para organizar tareas y asignar trabajo según las habilidades del equipo.",
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
  },
  {
    id: "handshake",
    icon: Handshake,
    title: "Colaboración en tiempo real",
    description:
      "Trabaja con tu equipo en tiempo real con chat integrado y actualizaciones instantáneas.",
    iconColor: "text-green-600",
    iconBgColor: "bg-green-100",
  },
  {
    id: "file-chart-column",
    icon: FileChartColumn,
    title: "Tableros Kanban",
    description:
      "Visualiza el progreso de tus proyectos con tableros Kanban intuitivos y personalizables.",
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-100",
  },
  {
    id: "timer",
    icon: Timer,
    title: "Gestión de Tiempo",
    description:
      "Seguimiento automático del tiempo y estimaciones inteligentes para una planificación precisa.",
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-100",
  },
  {
    id: "chart-no-axes-column",
    icon: ChartNoAxesColumn,
    title: "Análisis de Proyectos",
    description:
      "Obtén análisis detallados de tus proyectos para identificar oportunidades de mejora y optimización.",
    iconColor: "text-red-600",
    iconBgColor: "bg-red-100",
  },
];
