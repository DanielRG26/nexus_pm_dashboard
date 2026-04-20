"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Sparkles, Pencil } from "lucide-react";
import { Project, ProjectStatus, ProjectPriority } from "@/lib/types";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (project: Project) => void;
  editingProject?: Project | null;
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editingProject,
}: ProjectFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Activo");
  const [priority, setPriority] = useState<ProjectPriority>("Media");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingProject;

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setDescription(editingProject.description);
      setResponsible(editingProject.responsible);
      setDeadline(editingProject.deadline);
      setStatus(editingProject.status);
      setPriority(editingProject.priority);
    } else {
      resetForm();
    }
  }, [editingProject, open]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setResponsible("");
    setDeadline("");
    setStatus("Activo");
    setPriority("Media");
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

    onSubmit({
      id: editingProject?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      responsible: responsible.trim(),
      deadline,
      status,
      priority,
      tasks: editingProject?.tasks ?? [],
    });
    resetForm();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            {isEditing ? (
              <Pencil className="size-6 text-primary" />
            ) : (
              <Sparkles className="size-6 text-primary" />
            )}
          </div>
          <DialogTitle className="text-center">
            {isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEditing
              ? "Modifica los campos del proyecto."
              : "Completa los campos para añadir un proyecto."}
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
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              id="description"
              placeholder="Breve descripción del proyecto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as ProjectPriority)}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
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
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
