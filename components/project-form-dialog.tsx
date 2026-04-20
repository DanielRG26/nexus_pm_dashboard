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
import { Plus, Sparkles } from "lucide-react";
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  function resetForm() {
    setTitle("");
    setResponsible("");
    setDeadline("");
    setStatus("Activo");
    setErrors({});
  }

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "El título es obligatorio";
    if (!responsible.trim())
      newErrors.responsible = "El responsable es obligatorio";
    if (!deadline) newErrors.deadline = "La fecha es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      responsible: responsible.trim(),
      deadline,
      status,
    });
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus data-icon="inline-start" />
          Añadir Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Nuevo Proyecto</DialogTitle>
          <DialogDescription className="text-center">
            Completa los campos para añadir un proyecto al dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Título del proyecto</Label>
            <Input
              id="title"
              placeholder="Ej: Rediseño del sitio web"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="responsible">Responsable</Label>
            <Input
              id="responsible"
              placeholder="Ej: Ana García"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              aria-invalid={!!errors.responsible}
            />
            {errors.responsible && (
              <p className="text-xs text-destructive">{errors.responsible}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="deadline">Fecha límite</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                aria-invalid={!!errors.deadline}
              />
              {errors.deadline && (
                <p className="text-xs text-destructive">{errors.deadline}</p>
              )}
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
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Proyecto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
