'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/ui-store';
import { useTaskStore } from '@/stores/task-store';
import { TaskPriority, TaskStatus } from '@/types';
import { TaskSubtasks } from './task-subtasks';
import { TaskComments } from './task-comments';
import { TaskActivity } from './task-activity';
import {
  X,
  Copy,
  Trash2,
  Share2,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

export function TaskDetailSheet() {
  const selectedTaskId = useUIStore((state) => state.selectedTaskId);
  const setSelectedTaskId = useUIStore((state) => state.setSelectedTaskId);
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const duplicateTask = useTaskStore((state) => state.duplicateTask);
  const undoLastAction = useTaskStore((state) => state.undoLastAction);

  const [activeTab, setActiveTab] = useState<'subtasks' | 'comments' | 'activity'>('subtasks');

  const task = tasks.find((t) => t.id === selectedTaskId);

  const handleClose = () => {
    setSelectedTaskId(null);
  };

  const handleDelete = () => {
    if (!task) return;
    deleteTask(task.id);
    setSelectedTaskId(null);
    toast('Task deleted', {
      action: {
        label: 'Undo',
        onClick: () => undoLastAction(),
      },
    });
  };

  const handleDuplicate = () => {
    if (!task) return;
    const dup = duplicateTask(task.id);
    if (dup) {
      setSelectedTaskId(dup.id);
      toast.success('Task duplicated');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Task link copied to clipboard');
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Slide-over Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Header Action Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-zinc-50/70 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-foreground">
                {task.code}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {task.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Copy link"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleDuplicate}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Duplicate task"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="h-4 w-[1px] bg-border mx-1" />
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title (Inline Editable) */}
            <div>
              <textarea
                value={task.title}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                rows={1}
                className="w-full text-lg sm:text-xl font-bold tracking-tight bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden resize-none border-b border-transparent focus:border-border pb-1"
                placeholder="Task title..."
              />
            </div>

            {/* Properties Matrix (Status, Priority, Due Date) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-zinc-50/75 dark:bg-zinc-900/40 border border-border/60 text-xs">
              {/* Status */}
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Status
                </label>
                <select
                  value={task.status}
                  onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                  className="w-full bg-background border border-border rounded-lg px-2 py-1 font-medium text-foreground cursor-pointer focus:outline-hidden"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Priority
                </label>
                <select
                  value={task.priority}
                  onChange={(e) => updateTask(task.id, { priority: e.target.value as TaskPriority })}
                  className="w-full bg-background border border-border rounded-lg px-2 py-1 font-medium text-foreground cursor-pointer focus:outline-hidden"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                  onChange={(e) =>
                    updateTask(task.id, {
                      dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                  className="w-full bg-background border border-border rounded-lg px-2 py-1 font-medium text-foreground text-xs cursor-pointer focus:outline-hidden"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Description</span>
              </div>
              <textarea
                value={task.description}
                onChange={(e) => updateTask(task.id, { description: e.target.value })}
                placeholder="Add a detailed description or specification..."
                rows={3}
                className="w-full rounded-xl border border-border bg-zinc-50/50 dark:bg-zinc-900/30 p-3 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            {/* Tabbed Subsections: Subtasks | Comments | Activity */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-1 mb-4 border-b border-border/60 pb-1">
                {[
                  { id: 'subtasks', label: `Subtasks (${task.subtasks.length})` },
                  { id: 'comments', label: `Comments (${task.comments.length})` },
                  { id: 'activity', label: 'Activity' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-2xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'subtasks' && (
                <TaskSubtasks taskId={task.id} subtasks={task.subtasks} />
              )}
              {activeTab === 'comments' && (
                <TaskComments taskId={task.id} comments={task.comments} />
              )}
              {activeTab === 'activity' && <TaskActivity task={task} />}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
