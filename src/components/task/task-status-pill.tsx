import React from 'react';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';
import { TaskStatus } from '@/types';
import { STATUS_CONFIG, cn } from '@/lib/utils';

interface TaskStatusPillProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}

export function TaskStatusPill({
  status,
  size = 'sm',
  className,
  onClick,
}: TaskStatusPillProps) {
  const config = STATUS_CONFIG[status];

  const renderIcon = () => {
    switch (status) {
      case 'not_started':
        return <Circle className="h-3 w-3 text-zinc-400 stroke-[2.5]" />;
      case 'in_progress':
        return <Clock className="h-3 w-3 text-amber-500 stroke-[2.5]" />;
      case 'done':
        return <CheckCircle2 className="h-3 w-3 text-emerald-500 stroke-[2.5]" />;
    }
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium tracking-tight rounded-md border transition-colors select-none',
        config.bgBadge,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        onClick && 'cursor-pointer hover:opacity-80 active:scale-[0.98]',
        className
      )}
    >
      {renderIcon()}
      <span>{config.label}</span>
    </Component>
  );
}
