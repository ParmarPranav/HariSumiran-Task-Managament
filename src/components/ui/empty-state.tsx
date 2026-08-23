import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border/80 bg-zinc-50/50 dark:bg-zinc-900/20',
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 mb-3 border border-border/50 shadow-2xs">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-medium text-foreground tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-[280px] mt-1 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1.5 text-xs font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
