"use client";

import { useState, useEffect } from "react";
import {
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
  Plus,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";
import { Project, ProjectStatus, Task } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { ProjectTable } from "@/components/project-table";
import { ProjectFormDialog } from "@/components/project-form-dialog";
import { ProjectDetailSheet } from "@/components/project-detail-sheet";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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

function getTaskProgress(project: Project) {
  if (project.tasks.length === 0) return 0;
  return Math.round(
    (project.tasks.filter((t) => t.completed).length / project.tasks.length) *
      100
  );
}

const statusColors: Record<ProjectStatus, string> = {
  Activo:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  Completado:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  Vencido:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
};

const priorityColors: Record<string, string> = {
  Alta: "text-red-600 dark:text-red-400",
  Media: "text-amber-600 dark:text-amber-400",
  Baja: "text-blue-600 dark:text-blue-400",
};

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, mounted]);

  // Keep detail sheet in sync
  useEffect(() => {
    if (detailProject) {
      const updated = projects.find((p) => p.id === detailProject.id);
      if (updated) setDetailProject(updated);
    }
  }, [projects]);

  const activeCount = projects.filter((p) => p.status === "Activo").length;
  const completedCount = projects.filter(
    (p) => p.status === "Completado"
  ).length;
  const overdueCount = projects.filter((p) => p.status === "Vencido").length;
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce(
    (acc, p) => acc + p.tasks.filter((t) => t.completed).length,
    0
  );

  function handleStatusChange(id: string, newStatus: ProjectStatus) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    toast.success(`Estado cambiado a "${newStatus}"`);
  }

  function handleDelete(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success("Proyecto eliminado");
  }

  function handleFormSubmit(project: Project) {
    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? project : p))
      );
      toast.success("Proyecto actualizado");
    } else {
      setProjects((prev) => [...prev, project]);
      toast.success("Proyecto creado");
    }
    setEditingProject(null);
  }

  function handleEdit(project: Project) {
    setEditingProject(project);
    setFormOpen(true);
  }

  function handleUpdateTasks(projectId: string, tasks: Task[]) {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, tasks } : p))
    );
  }

  function openDetail(project: Project) {
    setDetailProject(project);
    setDetailOpen(true);
  }

  return (
    <div className="min-h-svh bg-background">
      <AppSidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="md:pl-16">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />

        <div className="mx-auto max-w-6xl space-y-6 p-6 md:px-10 md:py-8">
          {/* Header */}
          <div className="flex flex-col gap-4 pl-12 sm:flex-row sm:items-end sm:justify-between md:pl-0">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {activeView === "dashboard" ? "Dashboard" : "Proyectos"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeView === "dashboard"
                  ? "Resumen general de tus proyectos y tareas."
                  : "Gestiona y supervisa todos tus proyectos."}
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => {
                setEditingProject(null);
                setFormOpen(true);
              }}
            >
              <Plus data-icon="inline-start" />
              Añadir Proyecto
            </Button>
          </div>

          {activeView === "dashboard" ? (
            <>
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

              {/* Dashboard content */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent projects */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Proyectos recientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {projects.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        No hay proyectos aún.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {projects.slice(-5).reverse().map((p) => {
                          const progress = getTaskProgress(p);
                          return (
                            <button
                              key={p.id}
                              onClick={() => openDetail(p)}
                              className="flex w-full items-center gap-4 rounded-lg p-3 text-left transition-colors hover:bg-muted/50"
                            >
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                {p.title
                                  .split(" ")
                                  .map((w) => w[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="truncate text-sm font-medium">
                                    {p.title}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "shrink-0 text-xs border",
                                      statusColors[p.status]
                                    )}
                                  >
                                    {p.status}
                                  </Badge>
                                </div>
                                <div className="mt-1.5 flex items-center gap-2">
                                  <Progress
                                    value={progress}
                                    className="h-1.5 flex-1"
                                  />
                                  <span className="text-xs text-muted-foreground w-8 text-right">
                                    {progress}%
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Task summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ListChecks className="size-4" />
                      Resumen de Tareas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {totalTasks > 0
                          ? Math.round((completedTasks / totalTasks) * 100)
                          : 0}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Progreso global
                      </p>
                      <Progress
                        value={
                          totalTasks > 0
                            ? Math.round(
                                (completedTasks / totalTasks) * 100
                              )
                            : 0
                        }
                        className="mt-3 h-2.5"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        {completedTasks} de {totalTasks} tareas completadas
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-950">
                        <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                          {activeCount}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Activos
                        </div>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-950">
                        <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                          {completedCount}
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">
                          Listos
                        </div>
                      </div>
                      <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-950">
                        <div className="text-lg font-bold text-red-700 dark:text-red-300">
                          {overdueCount}
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-400">
                          Vencidos
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            /* Projects view with tabs */
            <Tabs defaultValue="table">
              <TabsList>
                <TabsTrigger value="table">Tabla</TabsTrigger>
                <TabsTrigger value="cards">Tarjetas</TabsTrigger>
              </TabsList>
              <TabsContent value="table">
                <ProjectTable
                  projects={projects}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </TabsContent>
              <TabsContent value="cards">
                {projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <div className="rounded-full bg-muted p-4">
                      <FolderOpen className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      No hay proyectos
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Crea tu primer proyecto para comenzar.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((p) => {
                      const progress = getTaskProgress(p);
                      return (
                        <Card
                          key={p.id}
                          className="cursor-pointer transition-shadow hover:shadow-md"
                          onClick={() => openDetail(p)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-base leading-tight">
                                {p.title}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "shrink-0 text-xs border",
                                  statusColors[p.status]
                                )}
                              >
                                {p.status}
                              </Badge>
                            </div>
                            {p.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {p.description}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{p.responsible}</span>
                              <span
                                className={cn(
                                  "font-medium",
                                  priorityColors[p.priority]
                                )}
                              >
                                {p.priority}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={progress}
                                className="h-1.5 flex-1"
                              />
                              <span className="text-xs text-muted-foreground">
                                {progress}%
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {p.tasks.filter((t) => t.completed).length}/
                              {p.tasks.length} tareas · Vence{" "}
                              {new Date(
                                p.deadline + "T00:00:00"
                              ).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "short",
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Dialogs & Sheets */}
      <ProjectFormDialog
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditingProject(null);
        }}
        onSubmit={handleFormSubmit}
        editingProject={editingProject}
      />
      <ProjectDetailSheet
        project={detailProject}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdateTasks={handleUpdateTasks}
      />
    </div>
  );
}
