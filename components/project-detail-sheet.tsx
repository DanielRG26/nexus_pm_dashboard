"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  CalendarDays,
  User,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
} from "lucide-react";
import { Project, Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectDetailSheetProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTasks: (projectId: string, tasks: Task[]) => void;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const priorityIcons = {
  Alta: ArrowUpCircle,
  Media: ArrowRightCircle,
  Baja: ArrowDownCircle,
};

const priorityColors = {
  Alta: "text-red-600 dark:text-red-400",
  Media: "text-amber-600 dark:text-amber-400",
  Baja: "text-blue-600 dark:text-blue-400",
};

export function ProjectDetailSheet({
  project,
  open,
  onOpenChange,
  onUpdateTasks,
}: ProjectDetailSheetProps) {
  const [newTask, setNewTask] = useState("");

  if (!project) return null;

  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const progress =
    project.tasks.length > 0
      ? Math.round((completedTasks / project.tasks.length) * 100)
      : 0;

  const PriorityIcon = priorityIcons[project.priority];

  function addTask() {
    if (!newTask.trim() || !project) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.trim(),
      completed: false,
    };
    onUpdateTasks(project.id, [...project.tasks, task]);
    setNewTask("");
  }

  function toggleTask(taskId: string) {
    if (!project) return;
    const updated = project.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateTasks(project.id, updated);
  }

  function deleteTask(taskId: string) {
    if (!project) return;
    onUpdateTasks(
      project.id,
      project.tasks.filter((t) => t.id !== taskId)
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{project.title}</SheetTitle>
          {project.description && (
            <SheetDescription>{project.description}</SheetDescription>
          )}
        </SheetHeader>

        <div className="space-y-6 px-4 pb-4">
          {/* Project info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Responsable
              </p>
              <div className="flex items-center gap-1.5 text-sm">
                <User className="size-3.5 text-muted-foreground" />
                {project.responsible}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Fecha límite
              </p>
              <div className="flex items-center gap-1.5 text-sm">
                <CalendarDays className="size-3.5 text-muted-foreground" />
                {formatDate(project.deadline)}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Prioridad
              </p>
              <div
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium",
                  priorityColors[project.priority]
                )}
              >
                <PriorityIcon className="size-4" />
                {project.priority}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Estado
              </p>
              <Badge variant="outline" className="text-xs">
                {project.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Progreso de tareas</p>
              <span className="text-sm text-muted-foreground">
                {completedTasks}/{project.tasks.length}
              </span>
            </div>
            <Progress value={progress} className="h-2.5" />
            <p className="text-xs text-muted-foreground text-right">
              {progress}% completado
            </p>
          </div>

          <Separator />

          {/* Add task */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Tareas</p>
            <div className="flex gap-2">
              <Input
                placeholder="Nueva tarea..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTask())}
                className="flex-1"
              />
              <Button size="default" onClick={addTask} disabled={!newTask.trim()}>
                <Plus className="size-4" />
              </Button>
            </div>

            {/* Task list */}
            <div className="space-y-1">
              {project.tasks.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No hay tareas aún. Añade una arriba.
                </p>
              ) : (
                project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="shrink-0 text-muted-foreground hover:text-primary"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="size-5" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        task.completed &&
                          "text-muted-foreground line-through"
                      )}
                    >
                      {task.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
