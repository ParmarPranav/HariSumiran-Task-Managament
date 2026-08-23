'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, CornerDownLeft, AlertCircle, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { TaskPriority, TaskStatus } from '@/types';
import { useTaskStore } from '@/stores/task-store';
import { useUIStore } from '@/stores/ui-store';
import { toast } from 'sonner';

interface InlineTaskComposerProps {
  status: TaskStatus;
  onClose: () => void;
}

export function InlineTaskComposer({ status, onClose }: InlineTaskComposerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [showMore, setShowMore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeProjectId = useUIStore((state) => state.activeProjectId);
  const addTask = useTaskStore((state) => state.addTask);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      labels: [],
      projectId: activeProjectId,
    });

    toast.success('Task created');
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card p-3 shadow-md transition-all animate-in fade-in-50 zoom-in-95 duration-150">
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task title... (Enter to save, Esc to cancel)"
          className="w-full bg-transparent text-xs sm:text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-hidden text-foreground"
        />

        {showMore && (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add description..."
            rows={2}
            className="w-full resize-none bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-lg text-xs placeholder:text-muted-foreground/60 border border-border/50 focus:outline-hidden text-foreground"
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
          <div className="flex items-center gap-2">
            {/* Priority Selector */}
            <div className="flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800/80 p-0.5 border border-border/40">
              {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((p) => {
                const isActive = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`h-5 px-1.5 text-[10px] font-medium rounded-md transition-all cursor-pointer ${
                      isActive
                        ? 'bg-background shadow-2xs text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title={`Priority: ${p}`}
                  >
                    {p === 'urgent' && <AlertCircle className="h-2.5 w-2.5 text-rose-500" />}
                    {p === 'high' && <ArrowUp className="h-2.5 w-2.5 text-orange-500" />}
                    {p === 'medium' && <ArrowRight className="h-2.5 w-2.5 text-blue-500" />}
                    {p === 'low' && <ArrowDown className="h-2.5 w-2.5 text-zinc-400" />}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="text-[11px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {showMore ? 'Less' : '+ Notes'}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClose}
              className="h-6 w-6 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="h-6 px-2.5 inline-flex items-center gap-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-2xs"
            >
              <span>Add</span>
              <CornerDownLeft className="h-2.5 w-2.5 opacity-70" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
