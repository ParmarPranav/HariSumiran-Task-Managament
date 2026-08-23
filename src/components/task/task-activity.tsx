import React from 'react';
import { Task } from '@/types';
import { Activity, Clock, UserCheck, Tag, CheckCircle2 } from 'lucide-react';
import { formatFullDate } from '@/lib/utils';

interface TaskActivityProps {
  task: Task;
}

export function TaskActivity({ task }: TaskActivityProps) {
  // Synthesize dynamic activity log based on task created, updated, comments, subtasks
  const events = [
    {
      id: 'evt-1',
      title: `Task created with status "${task.status.replace('_', ' ')}"`,
      date: task.createdAt,
      icon: Clock,
    },
    ...(task.assignee
      ? [
          {
            id: 'evt-2',
            title: `Assigned to ${task.assignee.name}`,
            date: task.createdAt,
            icon: UserCheck,
          },
        ]
      : []),
    ...task.labels.map((l, i) => ({
      id: `evt-lbl-${i}`,
      title: `Added label "${l.name}"`,
      date: task.createdAt,
      icon: Tag,
    })),
    ...(task.updatedAt !== task.createdAt
      ? [
          {
            id: 'evt-upd',
            title: 'Task details updated',
            date: task.updatedAt,
            icon: CheckCircle2,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Activity History
        </h4>
      </div>

      <div className="space-y-2 border-l border-border/60 ml-2 pl-3.5 pt-1">
        {events.map((evt) => {
          const Icon = evt.icon;
          return (
            <div key={evt.id} className="relative pb-2">
              <div className="absolute -left-[19px] top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background border border-border text-muted-foreground">
                <Icon className="h-2 w-2" />
              </div>
              <div className="text-xs text-foreground/90 font-medium">
                {evt.title}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {formatFullDate(evt.date)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
