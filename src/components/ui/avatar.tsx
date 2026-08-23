'use client';

import React from 'react';
import { User } from '@/types';
import { cn } from '@/lib/utils';

interface AvatarProps {
  user?: User;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

const sizeClasses = {
  xs: 'h-5 w-5 text-[9px]',
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-7 w-7 text-xs',
  lg: 'h-9 w-9 text-sm font-medium',
};

export function Avatar({ user, size = 'sm', className, showTooltip = true }: AvatarProps) {
  if (!user) {
    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-medium border border-border/50 shrink-0',
          sizeClasses[size],
          className
        )}
        title="Unassigned"
      >
        <span>?</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full text-white font-medium shadow-xs border border-white/10 shrink-0 select-none transition-transform hover:scale-105',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: user.color || '#6366f1' }}
      title={showTooltip ? `${user.name} (${user.role})` : undefined}
    >
      <span>{user.initials}</span>
    </div>
  );
}

export function AvatarGroup({
  users,
  max = 4,
  size = 'sm',
  className,
}: {
  users: User[];
  max?: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={cn('flex items-center -space-x-1.5 overflow-hidden', className)}>
      {visible.map((user) => (
        <Avatar key={user.id} user={user} size={size} className="ring-2 ring-background" />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold ring-2 ring-background text-[10px] shrink-0',
            sizeClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
