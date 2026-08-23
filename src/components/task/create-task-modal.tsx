'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/ui-store';
import { useTaskStore } from '@/stores/task-store';
import { TaskPriority, TaskStatus } from '@/types';
import { X, CornerDownLeft } from 'lucide-react';
import { toast } from 'sonner';

export function CreateTaskModal() {
  const isOpen = useUIStore((state) => state.isCreateTaskModalOpen);
  const setOpen = useUIStore((state) => state.setCreateTaskModalOpen);
  const defaultStatus = useUIStore((state) => state.createTaskDefaultStatus);
  const activeProjectId = useUIStore((state) => state.activeProjectId);
  const addTask = useTaskStore((state) => state.addTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

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

    toast.success('Task created successfully');
    setTitle('');
    setDescription('');
    setOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl z-10 space-y-3.5 select-none"
        >
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Create New Task
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                className="w-full text-sm font-medium bg-transparent text-foreground placeholder:text-muted-foreground/60 border-b border-border/80 pb-2 focus:outline-none focus:ring-0 focus:border-zinc-400"
                style={{ outline: 'none', boxShadow: 'none' }}
              />
            </div>

            {/* Description */}
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes or context..."
                rows={2}
                className="w-full resize-none rounded-xl border border-border bg-zinc-50/50 dark:bg-zinc-900/30 p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 focus:border-zinc-400"
                style={{ outline: 'none', boxShadow: 'none' }}
              />
            </div>

            {/* Properties (Status, Priority, Due Date) */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full bg-background border border-border rounded-lg p-1.5 text-foreground font-medium cursor-pointer focus:outline-none focus:ring-0"
                  style={{ outline: 'none', boxShadow: 'none' }}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full bg-background border border-border rounded-lg p-1.5 text-foreground font-medium cursor-pointer focus:outline-none focus:ring-0"
                  style={{ outline: 'none', boxShadow: 'none' }}
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-1 text-foreground text-xs cursor-pointer focus:outline-none focus:ring-0"
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
              >
                <span>Create Task</span>
                <CornerDownLeft className="h-3 w-3 opacity-70" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
