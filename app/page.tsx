"use client";

import { useState, useEffect } from "react";
import { FolderOpen, CheckCircle2, AlertTriangle, LayoutDashboard } from "lucide-react";
import { Project, ProjectStatus } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { ProjectTable } from "@/components/project-table";
import { ProjectFormDialog } from "@/components/project-form-dialog";

const STORAGE_KEY = "nexus-pm-projects";

const initialProjects: Project[] = [
  {
    id: "1",
    title: "Rediseño del sitio web",
    responsible: "Ana García",
    deadline: "2026-05-15",
    status: "Activo",
  },
  {
    id: "2",
    title: "App móvil v2",
    responsible: "Carlos López",
    deadline: "2026-03-01",
    status: "Vencido",
  },
  {
    id: "3",
    title: "Migración a la nube",
    responsible: "María Torres",
    deadline: "2026-06-30",
    status: "Activo",
  },
  {
    id: "4",
    title: "Sistema de facturación",
    responsible: "Pedro Ruiz",
    deadline: "2026-01-20",
    status: "Completado",
  },
];

function loadProjects(): Project[] {
  if (typeof window === "undefined") return initialProjects;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialProjects;
    }
  }
  return initialProjects;
}

export default function Page() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, mounted]);

  const activeCount = projects.filter((p) => p.status === "Activo").length;
  const completedCount = projects.filter((p) => p.status === "Completado").length;
  const overdueCount = projects.filter((p) => p.status === "Vencido").length;

  function handleStatusChange(id: string, newStatus: ProjectStatus) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  }

  function handleAddProject(project: Project) {
    setProjects((prev) => [...prev, project]);
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Panel de Proyectos
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona y supervisa el estado de tus proyectos.
            </p>
          </div>
          <ProjectFormDialog onAdd={handleAddProject} />
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProjectCard
            title="Total Proyectos"
            value={projects.length}
            icon={LayoutDashboard}
            description="Proyectos registrados"
          />
          <ProjectCard
            title="Activos"
            value={activeCount}
            icon={FolderOpen}
            description="En progreso actualmente"
          />
          <ProjectCard
            title="Completados"
            value={completedCount}
            icon={CheckCircle2}
            description="Finalizados con éxito"
          />
          <ProjectCard
            title="Vencidos"
            value={overdueCount}
            icon={AlertTriangle}
            description="Requieren atención"
          />
        </div>

        {/* Projects Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Proyectos</h2>
          <ProjectTable
            projects={projects}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}
