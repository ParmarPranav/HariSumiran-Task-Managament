import { useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useTaskStore } from '@/stores/task-store';
import { toast } from 'sonner';

export function useKeyboardShortcuts() {
  const isCommandOpen = useUIStore((state) => state.isCommandOpen);
  const setCommandOpen = useUIStore((state) => state.setCommandOpen);
  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);
  const isCreateTaskModalOpen = useUIStore((state) => state.isCreateTaskModalOpen);
  const selectedTaskId = useUIStore((state) => state.selectedTaskId);
  const setSelectedTaskId = useUIStore((state) => state.setSelectedTaskId);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const moveTask = useTaskStore((state) => state.moveTask);
  const undoLastAction = useTaskStore((state) => state.undoLastAction);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut triggers when actively typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // ⌘K / Ctrl+K - Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(!isCommandOpen);
        return;
      }

      // ⌘B - Toggle Sidebar
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // ⌘Z - Undo
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (!isInput) {
          e.preventDefault();
          undoLastAction();
          toast.success('Action undone');
          return;
        }
      }

      if (isInput) return;

      // Escape - Close sheet or command modal
      if (e.key === 'Escape') {
        if (isCommandOpen) {
          setCommandOpen(false);
        } else if (isCreateTaskModalOpen) {
          setCreateTaskModalOpen(false);
        } else if (selectedTaskId) {
          setSelectedTaskId(null);
        }
        return;
      }

      // C - Quick Create Task
      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setCreateTaskModalOpen(true);
        return;
      }

      // / - Quick search focus
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
        } else {
          setCommandOpen(true);
        }
        return;
      }

      // 1, 2, 3 - Quick Status Switch when a task is open/selected
      if (selectedTaskId) {
        if (e.key === '1') {
          e.preventDefault();
          moveTask(selectedTaskId, 'not_started');
          toast.info('Task moved to Not Started');
        } else if (e.key === '2') {
          e.preventDefault();
          moveTask(selectedTaskId, 'in_progress');
          toast.info('Task moved to In Progress');
        } else if (e.key === '3') {
          e.preventDefault();
          moveTask(selectedTaskId, 'done');
          toast.success('Task marked as Done!');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCommandOpen,
    setCommandOpen,
    isCreateTaskModalOpen,
    setCreateTaskModalOpen,
    selectedTaskId,
    setSelectedTaskId,
    toggleSidebar,
    moveTask,
    undoLastAction,
  ]);
}
