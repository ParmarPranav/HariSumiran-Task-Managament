'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { TaskPriorityBadge } from '@/components/task/task-priority-badge';
import { TaskTimerBadge } from '@/components/task/task-timer-badge';
import { formatDate, cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import { Calendar, CheckSquare, Image as ImageIcon, Paperclip } from 'lucide-react';

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

  const completedSubtasks = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const attachments = task.attachments || [];
  const firstImage = attachments.find((a) =>
    a.type?.startsWith('image/') || a.url?.startsWith('data:image') || a.url?.match(/\.(jpeg|jpg|gif|png|webp)/i)
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setSelectedTaskId(task.id)}
      className={cn(
        'group relative rounded-xl border border-border/70 bg-card p-3 shadow-2xs transition-all duration-150 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xs cursor-pointer select-none overflow-hidden',
        isDragging && 'opacity-30 border-dashed border-zinc-500 scale-[0.98]'
      )}
    >
      {/* Cover Image Thumbnail if media attached */}
      {firstImage && (
        <div className="-mx-3 -mt-3 mb-2.5 aspect-video w-[calc(100%+1.5rem)] bg-zinc-950 overflow-hidden border-b border-border/60">
          <img
            src={firstImage.url}
            alt={firstImage.name || 'Cover'}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}

      {/* Top Header: Priority Badge & Code */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <TaskPriorityBadge priority={task.priority} size="sm" />
        <span className="font-mono text-[10px] text-muted-foreground">
          {task.code}
        </span>
      </div>

      {/* Task Title */}
      <h4 className="text-xs sm:text-sm font-medium tracking-tight text-foreground line-clamp-3 leading-snug whitespace-pre-line break-words">
        {task.title}
      </h4>

      {/* Live Timer for IN PROGRESS tickets */}
      {task.status === 'in_progress' ? (
        <div className="mt-2.5 flex items-center justify-between bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 rounded-lg px-2.5 py-1 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Timer Active
          </span>
          <TaskTimerBadge task={task} size="sm" showControls={true} />
        </div>
      ) : task.timeSpentSeconds && task.timeSpentSeconds > 0 ? (
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span className="text-[10px] font-medium text-zinc-500">Time Spent</span>
          <TaskTimerBadge task={task} size="sm" showControls={false} />
        </div>
      ) : null}

      {/* Card Footer: Due Date, Subtask Count & Media Count */}
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

          {attachments.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-blue-400 font-medium">
              <Paperclip className="h-3 w-3 opacity-80" />
              <span>{attachments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
