export type ProjectStatus = "Activo" | "Completado" | "Vencido";

export interface Project {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  status: ProjectStatus;
}
