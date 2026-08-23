import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { TaskPriority, TaskStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  } catch {
    return dateString;
  }
}

export function formatFullDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy · h:mm a");
  } catch {
    return dateString;
  }
}

export const STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    description: string;
    color: string;
    dotColor: string;
    bgBadge: string;
    borderColor: string;
  }
> = {
  not_started: {
    label: "Not Started",
    description: "Tasks in backlog or waiting to start",
    color: "text-zinc-600 dark:text-zinc-400",
    dotColor: "bg-zinc-400 dark:bg-zinc-500",
    bgBadge: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300",
    borderColor: "border-zinc-200 dark:border-zinc-800",
  },
  in_progress: {
    label: "In Progress",
    description: "Tasks currently being worked on",
    color: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
    bgBadge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    borderColor: "border-amber-500/20 dark:border-amber-500/20",
  },
  done: {
    label: "Done",
    description: "Completed tasks and milestones",
    color: "text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
    bgBadge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    borderColor: "border-emerald-500/20 dark:border-emerald-500/20",
  },
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  {
    label: string;
    color: string;
    bgBadge: string;
    iconColor: string;
    level: number;
  }
> = {
  urgent: {
    label: "Urgent",
    color: "text-rose-600 dark:text-rose-400",
    bgBadge: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20",
    iconColor: "text-rose-500",
    level: 4,
  },
  high: {
    label: "High",
    color: "text-orange-600 dark:text-orange-400",
    bgBadge: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20",
    iconColor: "text-orange-500",
    level: 3,
  },
  medium: {
    label: "Medium",
    color: "text-blue-600 dark:text-blue-400",
    bgBadge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
    iconColor: "text-blue-500",
    level: 2,
  },
  low: {
    label: "Low",
    color: "text-zinc-500 dark:text-zinc-400",
    bgBadge: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border border-zinc-500/20",
    iconColor: "text-zinc-400",
    level: 1,
  },
};
