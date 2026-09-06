'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useTaskStore } from '@/stores/task-store';
import { getTaskElapsedSeconds, formatSecondsToHMS, parseHMSToSeconds, cn } from '@/lib/utils';
import { Timer, Play, Pause, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface TaskTimerBadgeProps {
  task: Task;
  size?: 'sm' | 'md' | 'lg';
  showControls?: boolean;
  allowEdit?: boolean;
  className?: string;
}

export function TaskTimerBadge({
  task,
  size = 'sm',
  showControls = true,
  allowEdit = true,
  className,
}: TaskTimerBadgeProps) {
  const toggleTaskTimer = useTaskStore((state) => state.toggleTaskTimer);
  const updateTask = useTaskStore((state) => state.updateTask);

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() =>
    getTaskElapsedSeconds(task)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState('');

  const isRunning =
    task.isTimerRunning !== false && task.status === 'in_progress';

  useEffect(() => {
    setElapsedSeconds(getTaskElapsedSeconds(task));

    if (!isRunning || isEditing) return;

    const interval = setInterval(() => {
      setElapsedSeconds(getTaskElapsedSeconds(task));
    }, 1000);

    return () => clearInterval(interval);
  }, [task.status, task.inProgressStartedAt, task.timeSpentSeconds, task.isTimerRunning, isRunning, isEditing]);

  const handleToggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskTimer(task.id);
  };

  const handleStartEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allowEdit) return;
    setEditInput(formatSecondsToHMS(elapsedSeconds));
    setIsEditing(true);
  };

  const handleSaveEdit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSeconds = parseHMSToSeconds(editInput);
    updateTask(task.id, {
      timeSpentSeconds: newSeconds,
      inProgressStartedAt: new Date().toISOString(),
    });
    setElapsedSeconds(newSeconds);
    setIsEditing(false);
    toast.success(`Tracked time updated to ${formatSecondsToHMS(newSeconds)}`);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  const formattedTime = formatSecondsToHMS(elapsedSeconds);

  if (isEditing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveEdit();
        }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'inline-flex items-center gap-1 rounded-full bg-zinc-900 border border-blue-500/80 px-2 py-0.5 font-mono text-white select-none z-10 shadow-lg',
          size === 'lg' ? 'text-xs py-1 px-3' : 'text-[11px]',
          className
        )}
      >
        <input
          type="text"
          value={editInput}
          onChange={(e) => setEditInput(e.target.value)}
          placeholder="HH:MM:SS"
          autoFocus
          className="w-16 bg-transparent text-center font-mono font-bold text-white outline-none border-b border-blue-400"
          style={{ outline: 'none' }}
        />
        <button
          type="submit"
          title="Save Time"
          className="p-0.5 hover:text-emerald-400 text-zinc-300 transition-colors cursor-pointer"
        >
          <Check className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={handleCancelEdit}
          title="Cancel"
          className="p-0.5 hover:text-rose-400 text-zinc-400 transition-colors cursor-pointer"
        >
          <X className="h-3 w-3" />
        </button>
      </form>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-mono transition-all select-none',
        isRunning
          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 shadow-xs'
          : 'bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400',
        size === 'sm' && 'px-2 py-0.5 text-[11px]',
        size === 'md' && 'px-2.5 py-1 text-xs',
        size === 'lg' && 'px-3 py-1.5 text-sm font-semibold',
        className
      )}
    >
      {/* Live status dot */}
      <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
        {isRunning && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full h-1.5 w-1.5',
            isRunning ? 'bg-amber-500' : 'bg-zinc-400'
          )}
        />
      </span>

      {/* Timer icon */}
      <Timer className={cn('shrink-0', size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />

      {/* Time Display (Click to edit) */}
      <span
        onClick={allowEdit ? handleStartEditing : undefined}
        title={allowEdit ? 'Click to edit time' : undefined}
        className={cn(
          'font-mono tracking-tight font-semibold',
          allowEdit && 'hover:underline cursor-pointer hover:text-blue-400'
        )}
      >
        {formattedTime}
      </span>

      {/* Edit pencil icon */}
      {allowEdit && (
        <button
          type="button"
          onClick={handleStartEditing}
          title="Edit Time"
          className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity cursor-pointer p-0.5"
        >
          <Edit2 className="h-2.5 w-2.5" />
        </button>
      )}

      {/* Interactive Play/Pause Control */}
      {showControls && (
        <button
          type="button"
          onClick={handleToggleTimer}
          title={isRunning ? 'Pause Timer' : 'Start Timer'}
          className={cn(
            'ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer text-current',
            size === 'sm' && 'h-4 w-4 flex items-center justify-center'
          )}
        >
          {isRunning ? (
            <Pause className="h-2.5 w-2.5 fill-current" />
          ) : (
            <Play className="h-2.5 w-2.5 fill-current" />
          )}
        </button>
      )}
    </div>
  );
}
