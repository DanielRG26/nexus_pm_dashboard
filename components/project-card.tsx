"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ProjectCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  children?: React.ReactNode;
}

export function ProjectCard({
  title,
  value,
  icon: Icon,
  description,
  children,
}: ProjectCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
