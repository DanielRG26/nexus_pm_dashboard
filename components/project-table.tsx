"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Circle,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  CalendarDays,
  User,
  Search,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { Project, ProjectStatus, ProjectPriority } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectTableProps {
  projects: Project[];
  onStatusChange: (id: string, status: ProjectStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (project: Project) => void;
}

const statusConfig: Record<
  ProjectStatus,
  { icon: typeof Circle; className: string }
> = {
  Activo: {
    icon: Circle,
    className:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  Completado: {
    icon: CheckCircle2,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  Vencido: {
    icon: AlertTriangle,
    className:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  },
};

const priorityConfig: Record<
  ProjectPriority,
  { icon: typeof ArrowUpCircle; className: string }
> = {
  Alta: {
    icon: ArrowUpCircle,
    className: "text-red-600 dark:text-red-400",
  },
  Media: {
    icon: ArrowRightCircle,
    className: "text-amber-600 dark:text-amber-400",
  },
  Baja: {
    icon: ArrowDownCircle,
    className: "text-blue-600 dark:text-blue-400",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTaskProgress(project: Project) {
  if (project.tasks.length === 0) return 0;
  const done = project.tasks.filter((t) => t.completed).length;
  return Math.round((done / project.tasks.length) * 100);
}

export function ProjectTable({
  projects,
  onStatusChange,
  onDelete,
  onEdit,
}: ProjectTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.responsible.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || p.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <div className="rounded-full bg-muted p-4">
          <FolderOpen className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No hay proyectos</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Crea tu primer proyecto para comenzar a gestionar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o responsable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
              <SelectItem value="Vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
              <SelectItem value="Baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Proyecto</TableHead>
              <TableHead className="font-semibold">Responsable</TableHead>
              <TableHead className="font-semibold">Fecha límite</TableHead>
              <TableHead className="font-semibold">Prioridad</TableHead>
              <TableHead className="font-semibold">Progreso</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No se encontraron proyectos con esos filtros.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((project) => {
                const sConfig = statusConfig[project.status];
                const pConfig = priorityConfig[project.priority];
                const StatusIcon = sConfig.icon;
                const PriorityIcon = pConfig.icon;
                const progress = getTaskProgress(project);
                return (
                  <TableRow
                    key={project.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                          {getInitials(project.title)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {project.title}
                          </div>
                          {project.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {project.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="size-3.5 shrink-0" />
                        <span className="truncate">{project.responsible}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="size-3.5 shrink-0" />
                        {formatDate(project.deadline)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-sm font-medium",
                          pConfig.className
                        )}
                      >
                        <PriorityIcon className="size-4" />
                        {project.priority}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 border font-medium",
                          sConfig.className
                        )}
                      >
                        <StatusIcon className="size-3" />
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(project)}>
                            <Pencil className="mr-2 size-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                          {(
                            ["Activo", "Completado", "Vencido"] as ProjectStatus[]
                          ).map((s) => (
                            <DropdownMenuItem
                              key={s}
                              disabled={project.status === s}
                              onClick={() => onStatusChange(project.id, s)}
                            >
                              {s}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteId(project.id)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proyecto y todas sus tareas
              serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleteId) onDelete(deleteId);
                setDeleteId(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
