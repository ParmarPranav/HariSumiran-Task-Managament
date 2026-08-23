'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  CornerDownLeft,
  Calendar,
  AlertCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  AlignLeft,
} from 'lucide-react';
import { TaskPriority, TaskStatus } from '@/types';
import { useTaskStore } from '@/stores/task-store';
import { useUIStore } from '@/stores/ui-store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface InlineTaskComposerProps {
  status: TaskStatus;
  onClose: () => void;
}

export function InlineTaskComposer({ status, onClose }: InlineTaskComposerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      projectId: activeProjectId,
    });

    toast.success('Task added');
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

  const priorities: { id: TaskPriority; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { id: 'urgent', label: 'Urgent', icon: AlertCircle, color: 'text-rose-500 bg-rose-500/10' },
    { id: 'high', label: 'High', icon: ArrowUp, color: 'text-orange-500 bg-orange-500/10' },
    { id: 'medium', label: 'Medium', icon: ArrowRight, color: 'text-blue-500 bg-blue-500/10' },
    { id: 'low', label: 'Low', icon: ArrowDown, color: 'text-zinc-400 bg-zinc-500/10' },
  ];

  return (
    <div className="rounded-xl border border-zinc-300/80 dark:border-zinc-700/80 bg-card p-3.5 shadow-md transition-all animate-in fade-in-50 zoom-in-98 duration-150 select-none">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main Task Title Input */}
        <div>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Task title... (press Enter to save)"
            className="w-full bg-transparent text-xs sm:text-sm font-medium placeholder:text-muted-foreground/60 text-foreground border-0 p-0 focus:outline-none focus:ring-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
        </div>

        {/* Expandable Notes / Description Field */}
        {showNotes && (
          <div className="animate-in fade-in-50 duration-150">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add optional description or notes..."
              rows={2}
              className="w-full resize-none rounded-lg bg-zinc-100/70 dark:bg-zinc-800/50 p-2 text-xs text-foreground placeholder:text-muted-foreground/60 border border-border/50 focus:outline-none focus:ring-0"
              style={{ outline: 'none', boxShadow: 'none' }}
            />
          </div>
        )}

        {/* Due Date Picker Input */}
        {showDatePicker && (
          <div className="flex items-center gap-2 text-xs animate-in fade-in-50 duration-150">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-zinc-100/80 dark:bg-zinc-800/80 border border-border/60 rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-0"
              style={{ outline: 'none', boxShadow: 'none' }}
            />
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate('')}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Bottom Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
          {/* Priority Pill & Quick Helpers */}
          <div className="flex items-center gap-1.5">
            {/* Priority Selector */}
            <div className="flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 p-0.5 border border-border/40">
              {priorities.map((p) => {
                const Icon = p.icon;
                const isActive = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={cn(
                      'flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-md transition-all cursor-pointer select-none',
                      isActive
                        ? 'bg-background text-foreground shadow-2xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    title={`Priority: ${p.label}`}
                  >
                    <Icon className="h-3 w-3 shrink-0" />
                    <span className="hidden sm:inline">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* + Notes Button */}
            {!showNotes && (
              <button
                type="button"
                onClick={() => setShowNotes(true)}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Add description notes"
              >
                <AlignLeft className="h-3 w-3" />
                <span>Notes</span>
              </button>
            )}

            {/* + Due Date Button */}
            {!showDatePicker && (
              <button
                type="button"
                onClick={() => setShowDatePicker(true)}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Set due date"
              >
                <Calendar className="h-3 w-3" />
                <span>Date</span>
              </button>
            )}
          </div>

          {/* Action Buttons: Cancel and Add */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 disabled:opacity-40 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <span>Add</span>
              <CornerDownLeft className="h-3 w-3 opacity-70" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
