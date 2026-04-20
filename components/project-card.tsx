"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  accent: "blue" | "emerald" | "amber" | "violet";
  children?: React.ReactNode;
}

const accentStyles = {
  blue: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  emerald:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  amber:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  violet:
    "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
};

export function ProjectCard({
  title,
  value,
  icon: Icon,
  description,
  accent,
  children,
}: ProjectCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className={cn("rounded-lg p-2.5", accentStyles[accent])}>
          <Icon className="size-5" />
        </div>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-[4.25rem]">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
