'use client';

import React from 'react';
import {
  format,
  addDays,
  subDays,
  differenceInDays,
  isSameDay,
  parseISO,
} from 'date-fns';
import { Task } from '@/types';
import { useUIStore } from '@/stores/ui-store';
import { Avatar } from '@/components/ui/avatar';
import { TaskPriorityBadge } from '@/components/task/task-priority-badge';
import { STATUS_CONFIG, cn } from '@/lib/utils';
import { Layers } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

interface TimelineViewProps {
  tasks: Task[];
}

export function TimelineView({ tasks }: TimelineViewProps) {
  const setSelectedTaskId = useUIStore((state) => state.setSelectedTaskId);
  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);

  const baseDate = new Date();
  const startDate = subDays(baseDate, 5);
  const totalDays = 24;
  const timelineDays = Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="No tasks in timeline"
        description="Create tasks with due dates to visualize project progress across time."
        actionLabel="Create new task"
        onAction={() => setCreateTaskModalOpen(true)}
        className="my-8"
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-zinc-50/60 dark:bg-zinc-900/30">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Project Timeline & Roadmapping
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Visualize task dependencies, milestones, and delivery estimates.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex">
        {/* Left Column: Task list fixed pane */}
        <div className="w-72 shrink-0 border-r border-border bg-zinc-50/30 dark:bg-zinc-900/20 divide-y divide-border/50">
          <div className="h-10 px-4 flex items-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-zinc-50/70 dark:bg-zinc-900/40">
            Task
          </div>
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTaskId(task.id)}
              className="h-12 px-4 flex items-center justify-between gap-2 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
            >
              <div className="truncate">
                <div className="text-xs font-medium text-foreground truncate">
                  {task.title}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {task.code}
                  </span>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {STATUS_CONFIG[task.status].label}
                  </span>
                </div>
              </div>
              <Avatar user={task.assignee} size="xs" />
            </div>
          ))}
        </div>

        {/* Right Gantt Area */}
        <div className="flex-1 overflow-x-auto">
          {/* Days Header */}
          <div className="h-10 flex border-b border-border bg-zinc-50/70 dark:bg-zinc-900/40 text-[11px] font-semibold text-muted-foreground">
            {timelineDays.map((day) => {
              const isTodayDate = isSameDay(day, baseDate);
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'w-16 shrink-0 flex flex-col items-center justify-center border-r border-border/40 font-mono text-[10px]',
                    isTodayDate && 'bg-zinc-200/50 dark:bg-zinc-800/70 text-foreground font-bold'
                  )}
                >
                  <span>{format(day, 'EEE')}</span>
                  <span>{format(day, 'd')}</span>
                </div>
              );
            })}
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/50 relative">
            {tasks.map((task) => {
              const statusCfg = STATUS_CONFIG[task.status];
              const taskCreatedAt = parseISO(task.createdAt);
              const taskDueDate = task.dueDate ? parseISO(task.dueDate) : addDays(taskCreatedAt, 3);

              const dayOffset = Math.max(0, differenceInDays(taskCreatedAt, startDate));
              const durationDays = Math.max(2, differenceInDays(taskDueDate, taskCreatedAt) || 2);

              const leftPos = dayOffset * 64; // 64px per day column
              const widthPx = durationDays * 64;

              return (
                <div
                  key={task.id}
                  className="h-12 relative flex items-center hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20"
                >
                  {/* Grid background markers */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {timelineDays.map((day) => (
                      <div
                        key={day.toISOString()}
                        className={cn(
                          'w-16 shrink-0 border-r border-border/20 h-full',
                          isSameDay(day, baseDate) && 'bg-zinc-100/40 dark:bg-zinc-800/20'
                        )}
                      />
                    ))}
                  </div>

                  {/* Task Timeline Bar */}
                  <div
                    onClick={() => setSelectedTaskId(task.id)}
                    style={{
                      left: `${leftPos}px`,
                      width: `${widthPx}px`,
                    }}
                    className={cn(
                      'absolute h-7 rounded-lg px-2.5 flex items-center justify-between text-[11px] font-medium border shadow-2xs hover:shadow-md transition-all cursor-pointer select-none group',
                      task.status === 'done'
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                        : task.status === 'in_progress'
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-300'
                        : 'bg-zinc-500/15 border-zinc-500/30 text-zinc-800 dark:text-zinc-300'
                    )}
                  >
                    <span className="truncate font-semibold">{task.title}</span>
                    <span className="font-mono text-[9px] opacity-75 shrink-0 ml-1">
                      {durationDays}d
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
