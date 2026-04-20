"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Project, ProjectStatus } from "@/lib/types";

interface ProjectFormDialogProps {
  onAdd: (project: Project) => void;
}

export function ProjectFormDialog({ onAdd }: ProjectFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [responsible, setResponsible] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Activo");

  function resetForm() {
    setTitle("");
    setResponsible("");
    setDeadline("");
    setStatus("Activo");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !responsible.trim() || !deadline) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      title: title.trim(),
      responsible: responsible.trim(),
      deadline,
      status,
    };

    onAdd(newProject);
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus data-icon="inline-start" />
          Añadir Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Proyecto</DialogTitle>
          <DialogDescription>
            Completa los campos para añadir un proyecto al dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Nombre del proyecto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="responsible">Responsable</Label>
            <Input
              id="responsible"
              placeholder="Nombre del responsable"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deadline">Fecha límite</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Estado inicial</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ProjectStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
                <SelectItem value="Vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Crear Proyecto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
