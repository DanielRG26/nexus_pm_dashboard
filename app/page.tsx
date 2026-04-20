"use client";

import { useState, useEffect } from "react";
import {
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
} from "lucide-react";
import { Project, ProjectStatus } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { ProjectTable } from "@/components/project-table";
import { ProjectFormDialog } from "@/components/project-form-dialog";

const STORAGE_KEY = "nexus-pm-projects";

function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
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
  const completedCount = projects.filter(
    (p) => p.status === "Completado"
  ).length;
  const overdueCount = projects.filter((p) => p.status === "Vencido").length;

  function handleStatusChange(id: string, newStatus: ProjectStatus) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  }

  function handleDelete(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  function handleAddProject(project: Project) {
    setProjects((prev) => [...prev, project]);
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />

      <div className="mx-auto max-w-6xl space-y-8 p-6 md:px-10 md:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <LayoutDashboard className="size-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Nexus PM
                </h1>
                <p className="text-sm text-muted-foreground">
                  Panel de gestión de proyectos
                </p>
              </div>
            </div>
          </div>
          <ProjectFormDialog onAdd={handleAddProject} />
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProjectCard
            title="Total"
            value={projects.length}
            icon={LayoutDashboard}
            accent="violet"
            description="Proyectos registrados"
          />
          <ProjectCard
            title="Activos"
            value={activeCount}
            icon={FolderOpen}
            accent="blue"
            description="En progreso"
          />
          <ProjectCard
            title="Completados"
            value={completedCount}
            icon={CheckCircle2}
            accent="emerald"
            description="Finalizados"
          />
          <ProjectCard
            title="Vencidos"
            value={overdueCount}
            icon={AlertTriangle}
            accent="amber"
            description="Requieren atención"
          />
        </div>

        {/* Projects Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Proyectos</h2>
            {projects.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {projects.length} proyecto{projects.length !== 1 && "s"}
              </span>
            )}
          </div>
          <ProjectTable
            projects={projects}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
