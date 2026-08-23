'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { TaskPriorityBadge } from '@/components/task/task-priority-badge';
import { formatDate, cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import { Calendar, CheckSquare } from 'lucide-react';

interface KanbanCardProps {
  task: Task;
}

export function KanbanCard({ task }: KanbanCardProps) {
  const setSelectedTaskId = useUIStore((state) => state.setSelectedTaskId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setSelectedTaskId(task.id)}
      className={cn(
        'group relative rounded-xl border border-border/70 bg-card p-3 shadow-2xs transition-all duration-150 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xs cursor-pointer select-none',
        isDragging && 'opacity-30 border-dashed border-zinc-500 scale-[0.98]'
      )}
    >
      {/* Top Header: Priority Badge & Code */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <TaskPriorityBadge priority={task.priority} size="sm" />
        <span className="font-mono text-[10px] text-muted-foreground">
          {task.code}
        </span>
      </div>

      {/* Task Title */}
      <h4 className="text-xs sm:text-sm font-medium tracking-tight text-foreground line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Card Footer: Due Date & Subtask Count (Assignee & Labels removed) */}
      <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[10px]">
              <Calendar className="h-3 w-3 opacity-60" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}

          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1 text-[10px]">
              <CheckSquare className="h-3 w-3 opacity-60" />
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
