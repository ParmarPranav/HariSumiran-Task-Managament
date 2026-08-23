import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "neutral" | "subtle";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border text-foreground",
    destructive: "bg-destructive/10 text-destructive border border-destructive/20",
    neutral: "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60",
    subtle: "bg-muted text-muted-foreground",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[11px] font-medium tracking-tight rounded-md",
    md: "px-2.5 py-0.5 text-xs font-medium rounded-md",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 transition-colors select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
