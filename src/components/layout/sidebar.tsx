'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
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
  LogOut,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Sidebar() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const viewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);
  const setCommandOpen = useUIStore((state) => state.setCommandOpen);
  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const user = useAuthStore((state) => state.user);
  const sessionExpiresAt = useAuthStore((state) => state.sessionExpiresAt);
  const logout = useAuthStore((state) => state.logout);

  const [remainingTime, setRemainingTime] = useState<string>('3h 00m');

  // Live remaining session ticker
  useEffect(() => {
    const updateTime = () => {
      if (!sessionExpiresAt) return;
      const diff = sessionExpiresAt - Date.now();
      if (diff <= 0) {
        setRemainingTime('Expired');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setRemainingTime(`${hours}h ${mins.toString().padStart(2, '0')}m`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [sessionExpiresAt]);

  const navItems = [
    { mode: 'board' as ViewMode, label: 'Kanban Board', icon: Kanban },
    { mode: 'calendar' as ViewMode, label: 'Calendar Schedule', icon: Calendar },
  ];

  const handleLogout = () => {
    logout();
    toast.info('Signed out of Google session');
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      className="relative flex flex-col h-screen border-r border-border/60 bg-card select-none z-30 shrink-0 overflow-hidden"
    >
      {/* Workspace Logo Header */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-border/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900/90 dark:bg-zinc-800/90 border border-zinc-700/50 p-1 shadow-2xs shrink-0 overflow-hidden">
            <img src="/logo.png" alt="HariSumiran Logo" className="h-full w-full object-contain" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-sm font-bold tracking-tight text-foreground truncate font-sans">
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

      {/* Sidebar Footer: Google Session Profile, Theme & Collapse */}
      <div className="p-2.5 border-t border-border/60 space-y-2">
        {/* Authenticated Google User Card */}
        {user && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-border/50">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: user.color || '#4285F4' }}
              >
                {user.initials}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 truncate">
                  <div className="text-[11px] font-semibold text-foreground truncate">
                    {user.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5 text-blue-400" />
                    <span>{remainingTime}</span>
                  </div>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Sign out (End 3h Google Session)"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

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
            'flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer',
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
