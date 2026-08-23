'use client';

import React, { useState } from 'react';
import { Subtask } from '@/types';
import { useTaskStore } from '@/stores/task-store';
import { Check, Plus, Trash2, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskSubtasksProps {
  taskId: string;
  subtasks: Subtask[];
}

export function TaskSubtasks({ taskId, subtasks }: TaskSubtasksProps) {
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addSubtask = useTaskStore((state) => state.addSubtask);
  const toggleSubtask = useTaskStore((state) => state.toggleSubtask);
  const deleteSubtask = useTaskStore((state) => state.deleteSubtask);

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) return;
    addSubtask(taskId, newTitle);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-3">
      {/* Header & Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Subtasks
          </h4>
          {totalCount > 0 && (
            <span className="font-mono text-xs text-muted-foreground">
              ({completedCount}/{totalCount})
            </span>
          )}
        </div>

        {totalCount > 0 && (
          <span className="font-mono text-xs font-medium text-muted-foreground">
            {percentage}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {/* Subtask list */}
      <div className="space-y-1.5">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="group flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <label className="flex flex-1 items-center gap-2.5 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => toggleSubtask(taskId, subtask.id)}
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all cursor-pointer',
                  subtask.completed
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-500'
                )}
              >
                {subtask.completed && <Check className="h-3 w-3 stroke-[3]" />}
              </button>
              <span
                className={cn(
                  'text-xs text-foreground transition-all leading-snug',
                  subtask.completed && 'line-through text-muted-foreground'
                )}
              >
                {subtask.title}
              </span>
            </label>

            <button
              type="button"
              onClick={() => deleteSubtask(taskId, subtask.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all p-1"
              title="Delete subtask"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Subtask input */}
      {isAdding ? (
        <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Subtask name... (Enter to save)"
            autoFocus
            onKeyDown={(e) => e.key === 'Escape' && setIsAdding(false)}
            className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1.5 text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-1 py-1 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add subtask</span>
        </button>
      )}
    </div>
  );
}
