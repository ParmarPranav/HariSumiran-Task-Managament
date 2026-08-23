'use client';

import React from 'react';
import { Task } from '@/types';
import { TaskPriorityBadge } from '@/components/task/task-priority-badge';
import { formatDate } from '@/lib/utils';
import { Calendar, CheckSquare, Paperclip } from 'lucide-react';

interface DragOverlayCardProps {
  task: Task;
}

export function DragOverlayCard({ task }: DragOverlayCardProps) {
  const completedSubtasks = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const attachments = task.attachments || [];
  const firstImage = attachments.find((a) =>
    a.type?.startsWith('image/') || a.url?.startsWith('data:image') || a.url?.match(/\.(jpeg|jpg|gif|png|webp)/i)
  );

  return (
    <div className="w-[300px] rounded-xl border border-zinc-500 bg-card p-3 shadow-2xl rotate-2 scale-105 cursor-grabbing select-none dragging-card-shadow overflow-hidden">
      {/* Cover Image Thumbnail if media attached */}
      {firstImage && (
        <div className="-mx-3 -mt-3 mb-2.5 aspect-video w-[calc(100%+1.5rem)] bg-zinc-950 overflow-hidden border-b border-border/60">
          <img
            src={firstImage.url}
            alt={firstImage.name || 'Cover'}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Top Header */}
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

      {/* Card Footer: Due Date, Subtasks, Media */}
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
