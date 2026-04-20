export type ProjectStatus = "Activo" | "Completado" | "Vencido";
export type ProjectPriority = "Alta" | "Media" | "Baja";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  responsible: string;
  deadline: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  tasks: Task[];
}
