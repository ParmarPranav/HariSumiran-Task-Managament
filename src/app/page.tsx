'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { KanbanBoard } from '@/components/board/kanban-board';
import { CalendarView } from '@/components/views/calendar-view';
import { TaskDetailSheet } from '@/components/task/task-detail-sheet';
import { CreateTaskModal } from '@/components/task/create-task-modal';
import { CommandDialog } from '@/components/command/command-dialog';
import { GoogleAuthenticatorGate } from '@/components/auth/google-authenticator-gate';
import { useUIStore } from '@/stores/ui-store';
import { useTaskStore } from '@/stores/task-store';
import { useAuthStore } from '@/stores/auth-store';
import { useFilteredTasks } from '@/hooks/use-filtered-tasks';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

export default function WorkspacePage() {
  const viewMode = useUIStore((state) => state.viewMode);
  const fetchTasksFromBackend = useTaskStore((state) => state.fetchTasksFromBackend);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkSession = useAuthStore((state) => state.checkSession);
  const { tasks } = useFilteredTasks();

  const [mounted, setMounted] = useState(false);

  // Initialize global productivity shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    setMounted(true);
    checkSession();
    fetchTasksFromBackend();

    // Check session validity every 15 seconds
    const interval = setInterval(() => {
      checkSession();
    }, 15000);

    return () => clearInterval(interval);
  }, [checkSession, fetchTasksFromBackend]);

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground font-sans">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
      </div>
    );
  }

  // Google Authenticator 2FA Gate with 3-Hour Session Protection
  if (!isAuthenticated) {
    return <GoogleAuthenticatorGate />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Workspace Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        {/* Dynamic Viewport (Board & Calendar) */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {viewMode === 'board' && <KanbanBoard tasks={tasks} />}
          {viewMode === 'calendar' && <CalendarView tasks={tasks} />}
        </div>
      </main>

      {/* Slide-over Task Inspector */}
      <TaskDetailSheet />

      {/* Quick Task Creation Modal */}
      <CreateTaskModal />

      {/* Global Command Palette (⌘K) */}
      <CommandDialog />
    </div>
  );
}
