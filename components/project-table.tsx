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
import { MoreHorizontal } from "lucide-react";
import { Project, ProjectStatus } from "@/lib/types";

interface ProjectTableProps {
  projects: Project[];
  onStatusChange: (id: string, status: ProjectStatus) => void;
}

function statusVariant(status: ProjectStatus) {
  switch (status) {
    case "Activo":
      return "default" as const;
    case "Completado":
      return "secondary" as const;
    case "Vencido":
      return "destructive" as const;
  }
}

export function ProjectTable({ projects, onStatusChange }: ProjectTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Fecha límite</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No hay proyectos aún.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.responsible}</TableCell>
                <TableCell>{project.deadline}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(project.status)}>
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
                      <DropdownMenuItem
                        onClick={() => onStatusChange(project.id, "Activo")}
                      >
                        Activo
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(project.id, "Completado")}
                      >
                        Completado
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(project.id, "Vencido")}
                      >
                        Vencido
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
