import React from 'react';
import { AlertCircle, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { TaskPriority } from '@/types';
import { PRIORITY_CONFIG, cn } from '@/lib/utils';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function TaskPriorityBadge({
  priority,
  showLabel = true,
  className,
  size = 'sm',
}: TaskPriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  const renderIcon = () => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-3 w-3 text-rose-500 shrink-0 stroke-[2.5]" />;
      case 'high':
        return <ArrowUp className="h-3 w-3 text-orange-500 shrink-0 stroke-[2.5]" />;
      case 'medium':
        return <ArrowRight className="h-3 w-3 text-blue-500 shrink-0 stroke-[2]" />;
      case 'low':
        return <ArrowDown className="h-3 w-3 text-zinc-400 shrink-0 stroke-[2]" />;
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 font-medium tracking-tight rounded-md select-none',
        config.bgBadge,
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs',
        className
      )}
      title={`Priority: ${config.label}`}
    >
      {renderIcon()}
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
