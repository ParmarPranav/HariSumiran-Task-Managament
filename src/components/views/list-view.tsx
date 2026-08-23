'use client';

import React from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { useUIStore } from '@/stores/ui-store';
import { useTaskStore } from '@/stores/task-store';
import { CheckSquare, Calendar, Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

interface ListViewProps {
  tasks: Task[];
}

export function ListView({ tasks }: ListViewProps) {
  const setSelectedTaskId = useUIStore((state) => state.setSelectedTaskId);
  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);
  const moveTask = useTaskStore((state) => state.moveTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks match the criteria"
        description="Try adjusting your search queries or clearing active filters."
        actionLabel="Create new task"
        onAction={() => setCreateTaskModalOpen(true)}
        className="my-8"
      />
    );
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="border-b border-border bg-zinc-50/75 dark:bg-zinc-900/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-24">ID</th>
              <th className="py-3 px-4 min-w-[320px]">Title</th>
              <th className="py-3 px-4 w-40">Status</th>
              <th className="py-3 px-4 w-36">Priority</th>
              <th className="py-3 px-4 w-36">Due Date</th>
              <th className="py-3 px-4 w-32">Subtasks</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border/50">
            {tasks.map((task) => {
              const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
              const totalSubtasks = task.subtasks.length;

              return (
                <tr
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
                >
                  {/* Code */}
                  <td className="py-3 px-4 font-mono font-medium text-muted-foreground">
                    {task.code}
                  </td>

                  {/* Title & Description */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {task.description}
                      </div>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={task.status}
                      onChange={(e) => moveTask(task.id, e.target.value as TaskStatus)}
                      aria-label="Update task status"
                      className="bg-transparent border border-border/60 text-[11px] font-medium rounded-lg px-2 py-1 text-foreground cursor-pointer focus:outline-hidden hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>

                  {/* Priority Dropdown */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={task.priority}
                      onChange={(e) =>
                        updateTask(task.id, { priority: e.target.value as TaskPriority })
                      }
                      aria-label="Update task priority"
                      className="bg-transparent border border-border/60 text-[11px] font-medium rounded-lg px-2 py-1 text-foreground cursor-pointer focus:outline-hidden hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-4 text-[11px] text-muted-foreground">
                    {task.dueDate ? (
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3 w-3 opacity-70" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>

                  {/* Subtask count */}
                  <td className="py-3 px-4 text-[11px] text-muted-foreground font-mono">
                    {totalSubtasks > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckSquare className="h-3 w-3 opacity-70" />
                        {completedSubtasks}/{totalSubtasks}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border p-2 bg-zinc-50/40 dark:bg-zinc-900/20">
        <button
          onClick={() => setCreateTaskModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New row</span>
        </button>
      </div>
    </div>
  );
}
