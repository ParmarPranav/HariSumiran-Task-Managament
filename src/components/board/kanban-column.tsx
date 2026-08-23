'use client';

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types';
import { STATUS_CONFIG, cn } from '@/lib/utils';
import { KanbanCard } from './kanban-card';
import { InlineTaskComposer } from './inline-task-composer';
import { Plus, Circle, Clock, CheckCircle2 } from 'lucide-react';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const [isComposing, setIsComposing] = useState(false);
  const config = STATUS_CONFIG[status];

  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  });

  const taskIds = tasks.map((t) => t.id);

  const renderStatusIcon = () => {
    switch (status) {
      case 'not_started':
        return <Circle className="h-3.5 w-3.5 text-zinc-400 stroke-[2.5]" />;
      case 'in_progress':
        return <Clock className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />;
      case 'done':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col h-full min-w-[320px] max-w-[380px] flex-1 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-border/60 p-3.5 transition-all duration-200 shadow-xs',
        isOver && 'bg-zinc-100/90 dark:bg-zinc-800/50 border-zinc-400/60 ring-2 ring-zinc-400/10'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between gap-2 px-1 py-1 mb-2.5">
        <div className="flex items-center gap-2">
          {renderStatusIcon()}
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {config.label}
          </h3>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-zinc-200/80 dark:bg-zinc-800 px-1.5 font-mono text-[11px] font-bold text-muted-foreground">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => setIsComposing(true)}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title={`Add task to ${config.label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Task List / Drop Zone */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 min-h-[160px]">
        {isComposing && (
          <InlineTaskComposer status={status} onClose={() => setIsComposing(false)} />
        )}

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isComposing && (
          <div
            onClick={() => setIsComposing(true)}
            className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed border-border/60 bg-background/30 hover:bg-background/70 hover:border-zinc-400/50 transition-all cursor-pointer group"
          >
            <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
              No tasks in {config.label}
            </p>
            <span className="text-[11px] text-muted-foreground/60 mt-0.5 inline-flex items-center gap-1">
              <Plus className="h-3 w-3" /> Click to add
            </span>
          </div>
        )}
      </div>

      {/* Quick Add Footer button */}
      {!isComposing && (
        <button
          onClick={() => setIsComposing(true)}
          className="mt-2.5 flex w-full items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New task</span>
        </button>
      )}
    </div>
  );
}
