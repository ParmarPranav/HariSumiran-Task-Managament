'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '@/stores/ui-store';
import { ViewMode } from '@/types';
import {
  Layers,
  Kanban,
  Calendar,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Search,
  Moon,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const viewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);
  const setCommandOpen = useUIStore((state) => state.setCommandOpen);
  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const navItems = [
    { mode: 'board' as ViewMode, label: 'Kanban Board', icon: Kanban },
    { mode: 'calendar' as ViewMode, label: 'Calendar Schedule', icon: Calendar },
  ];

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 230 }}
      transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      className="relative flex flex-col h-screen border-r border-border/60 bg-card select-none z-30 shrink-0 overflow-hidden"
    >
      {/* Workspace Logo Header */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-border/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs font-semibold shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-xs font-bold tracking-tight text-foreground truncate">
              HariSumiran
            </span>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer',
            sidebarCollapsed && 'hidden'
          )}
          title="Toggle sidebar (⌘B)"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
        {/* Quick Actions */}
        <div className="space-y-1">
          <button
            onClick={() => setCommandOpen(true)}
            className="flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
            title="Search (⌘K)"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Search</span>}
            </div>
            {!sidebarCollapsed && (
              <kbd className="font-mono text-[10px] text-muted-foreground/80 px-1.5 py-0.5 rounded border border-border bg-background">
                ⌘K
              </kbd>
            )}
          </button>

          <button
            onClick={() => setCreateTaskModalOpen(true)}
            className="flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
            title="New task (C)"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="h-4 w-4 shrink-0 text-emerald-500" />
              {!sidebarCollapsed && <span>New Task</span>}
            </div>
            {!sidebarCollapsed && (
              <kbd className="font-mono text-[10px] text-muted-foreground/80 px-1.5 py-0.5 rounded border border-border bg-background">
                C
              </kbd>
            )}
          </button>
        </div>

        {/* View Navigation (Board & Calendar) */}
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <span className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Views
            </span>
          )}
          <div className="space-y-0.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = viewMode === item.mode;
              return (
                <button
                  key={item.mode}
                  onClick={() => setViewMode(item.mode)}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer truncate',
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40',
                    sidebarCollapsed && 'justify-center px-0'
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer: Theme & Expand button */}
      <div className="p-2 border-t border-border/60 space-y-1">
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-full items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer mb-1"
            title="Expand sidebar (⌘B)"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={toggleTheme}
          className={cn(
            'flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer',
            sidebarCollapsed ? 'w-full justify-center px-0' : 'w-full'
          )}
          title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400 shrink-0" />
          ) : (
            <Moon className="h-4 w-4 text-zinc-600 shrink-0" />
          )}
          {!sidebarCollapsed && (
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
