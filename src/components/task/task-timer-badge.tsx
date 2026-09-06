'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useTaskStore } from '@/stores/task-store';
import { getTaskElapsedSeconds, formatSecondsToHMS, cn } from '@/lib/utils';
import { Timer, Play, Pause } from 'lucide-react';

interface TaskTimerBadgeProps {
  task: Task;
  size?: 'sm' | 'md' | 'lg';
  showControls?: boolean;
  className?: string;
}

export function TaskTimerBadge({
  task,
  size = 'sm',
  showControls = true,
  className,
}: TaskTimerBadgeProps) {
  const toggleTaskTimer = useTaskStore((state) => state.toggleTaskTimer);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() =>
    getTaskElapsedSeconds(task)
  );

  const isRunning =
    task.isTimerRunning !== false && task.status === 'in_progress';

  useEffect(() => {
    // Immediate calculation update
    setElapsedSeconds(getTaskElapsedSeconds(task));

    if (!isRunning) return;

    // Tick every 1000ms
    const interval = setInterval(() => {
      setElapsedSeconds(getTaskElapsedSeconds(task));
    }, 1000);

    return () => clearInterval(interval);
  }, [task.status, task.inProgressStartedAt, task.timeSpentSeconds, task.isTimerRunning, isRunning]);

  const handleToggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskTimer(task.id);
  };

  const formattedTime = formatSecondsToHMS(elapsedSeconds);

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

      {/* Time Display */}
      <span className="font-mono tracking-tight font-semibold">{formattedTime}</span>

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
