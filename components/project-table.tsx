"use client";

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
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Circle,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  CalendarDays,
  User,
} from "lucide-react";
import { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectTableProps {
  projects: Project[];
  onStatusChange: (id: string, status: ProjectStatus) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<
  ProjectStatus,
  { variant: "default" | "secondary" | "destructive"; icon: typeof Circle; className: string }
> = {
  Activo: {
    variant: "default",
    icon: Circle,
    className:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  Completado: {
    variant: "secondary",
    icon: CheckCircle2,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  Vencido: {
    variant: "destructive",
    icon: AlertTriangle,
    className:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
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

export function ProjectTable({
  projects,
  onStatusChange,
  onDelete,
}: ProjectTableProps) {
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
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Proyecto</TableHead>
            <TableHead className="font-semibold">Responsable</TableHead>
            <TableHead className="font-semibold">Fecha límite</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const config = statusConfig[project.status];
            const StatusIcon = config.icon;
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
                    <span className="font-medium">{project.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="size-3.5" />
                    {project.responsible}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {formatDate(project.deadline)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("gap-1 border font-medium", config.className)}
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
                      <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(["Activo", "Completado", "Vencido"] as ProjectStatus[]).map(
                        (s) => (
                          <DropdownMenuItem
                            key={s}
                            disabled={project.status === s}
                            onClick={() => onStatusChange(project.id, s)}
                          >
                            {s}
                          </DropdownMenuItem>
                        )
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(project.id)}
                      >
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
