import React from 'react';
import { Task } from '@/types';
import { TaskPriorityBadge } from '@/components/task/task-priority-badge';
import { formatDate } from '@/lib/utils';
import { CheckSquare, Calendar } from 'lucide-react';

interface DragOverlayCardProps {
  task: Task;
}

export function DragOverlayCard({ task }: DragOverlayCardProps) {
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div className="w-[320px] rounded-xl border border-zinc-300 dark:border-zinc-700 bg-card p-3.5 shadow-2xl ring-2 ring-zinc-500/20 dark:ring-zinc-400/20 rotate-1 scale-102 cursor-grabbing pointer-events-none select-none">
      {/* Top row: Priority & Code */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <TaskPriorityBadge priority={task.priority} />
          <span className="font-mono text-[11px] font-medium text-muted-foreground/80">
            {task.code}
          </span>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-xs sm:text-sm font-semibold tracking-tight text-foreground line-clamp-2">
        {task.title}
      </h4>

      {/* Card Footer */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border/50 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[10px]">
              <Calendar className="h-3 w-3 opacity-70" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}

          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1 text-[10px]">
              <CheckSquare className="h-3 w-3 opacity-70" />
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
