'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/ui-store';
import { useTaskStore } from '@/stores/task-store';
import { MOCK_PROJECTS } from '@/services/mock-data';
import { ViewMode } from '@/types';
import {
  Search,
  CheckCircle2,
  Kanban,
  List,
  Calendar,
  Layers,
  Plus,
  Moon,
  Sun,
  PanelLeft,
  FilterX,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export function CommandDialog() {
  const isOpen = useUIStore((state) => state.isCommandOpen);
  const setOpen = useUIStore((state) => state.setCommandOpen);
  const tasks = useTaskStore((state) => state.tasks);
  const setSelectedTaskId = useUIStore((state) => state.setSelectedTaskId);
  const setViewMode = useUIStore((state) => state.setViewMode);
  const setActiveProject = useUIStore((state) => state.setActiveProject);
  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const clearFilters = useUIStore((state) => state.clearFilters);
  const resetTasks = useTaskStore((state) => state.resetTasks);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Flattened items list for navigation
  const items = useMemo(() => {
    const q = query.toLowerCase().trim();

    const taskMatches = tasks
      .filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((t) => ({
        id: `task-${t.id}`,
        category: 'Tasks',
        title: t.title,
        subtitle: `${t.code} · ${t.status.replace('_', ' ')}`,
        icon: CheckCircle2,
        action: () => {
          setSelectedTaskId(t.id);
          setOpen(false);
        },
      }));

    const projectMatches = MOCK_PROJECTS.filter(
      (p) => !q || p.name.toLowerCase().includes(q) || p.slug.includes(q)
    ).map((p) => ({
      id: `proj-${p.id}`,
      category: 'Projects',
      title: p.name,
      subtitle: p.description,
      icon: Sparkles,
      action: () => {
        setActiveProject(p.id);
        setOpen(false);
        toast.info(`Switched to ${p.name}`);
      },
    }));

    const viewActions = [
      { mode: 'board' as ViewMode, label: 'Switch to Board View', icon: Kanban },
      { mode: 'calendar' as ViewMode, label: 'Switch to Calendar View', icon: Calendar },
    ]
      .filter((v) => !q || v.label.toLowerCase().includes(q))
      .map((v) => ({
        id: `view-${v.mode}`,
        category: 'Views',
        title: v.label,
        subtitle: `Change current layout to ${v.mode}`,
        icon: v.icon,
        action: () => {
          setViewMode(v.mode);
          setOpen(false);
        },
      }));

    const generalActions = [
      {
        id: 'act-create',
        category: 'Actions',
        title: 'Create New Task',
        subtitle: 'Add a new task to current project (C)',
        icon: Plus,
        action: () => {
          setOpen(false);
          setCreateTaskModalOpen(true);
        },
      },
      {
        id: 'act-theme',
        category: 'Actions',
        title: 'Toggle Dark / Light Theme',
        subtitle: 'Switch application color appearance',
        icon: Moon,
        action: () => {
          toggleTheme();
          setOpen(false);
        },
      },
      {
        id: 'act-sidebar',
        category: 'Actions',
        title: 'Toggle Sidebar',
        subtitle: 'Collapse or expand navigation rail (⌘B)',
        icon: PanelLeft,
        action: () => {
          toggleSidebar();
          setOpen(false);
        },
      },
      {
        id: 'act-filter-clear',
        category: 'Actions',
        title: 'Clear All Active Filters',
        subtitle: 'Reset search and category constraints',
        icon: FilterX,
        action: () => {
          clearFilters();
          setOpen(false);
          toast.success('Filters cleared');
        },
      },
      {
        id: 'act-reset-data',
        category: 'Actions',
        title: 'Reset Demo Workspace Data',
        subtitle: 'Restore initial tasks and states',
        icon: RotateCcw,
        action: () => {
          resetTasks();
          setOpen(false);
          toast.success('Reset to default workspace dataset');
        },
      },
    ].filter((a) => !q || a.title.toLowerCase().includes(q));

    return [...taskMatches, ...projectMatches, ...viewActions, ...generalActions];
  }, [
    query,
    tasks,
    setSelectedTaskId,
    setOpen,
    setActiveProject,
    setViewMode,
    setCreateTaskModalOpen,
    toggleTheme,
    toggleSidebar,
    clearFilters,
    resetTasks,
  ]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, items.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Command Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl z-10 overflow-hidden"
        >
          {/* Input Header */}
          <div className="flex items-center gap-3 px-4 border-b border-border bg-zinc-50/50 dark:bg-zinc-900/30">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search tasks, projects..."
              autoFocus
              className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden"
            />
            <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No matching results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              items.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground font-medium shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border shrink-0 ${
                          isSelected
                            ? 'border-zinc-300 dark:border-zinc-700 bg-background text-foreground'
                            : 'border-border/60 bg-zinc-50 dark:bg-zinc-900 text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-foreground truncate">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-[10px] text-muted-foreground truncate">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 shrink-0">
                      {item.category}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-zinc-50/70 dark:bg-zinc-900/50 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Navigate</span>
              <kbd className="rounded border border-border px-1">↑</kbd>
              <kbd className="rounded border border-border px-1">↓</kbd>
              <span className="ml-1">Select</span>
              <kbd className="rounded border border-border px-1">↵</kbd>
            </div>
            <span>HariSumiran Command v1.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
