import { useMemo } from 'react';
import { useTaskStore } from '@/stores/task-store';
import { useUIStore } from '@/stores/ui-store';
import { Task, TaskPriority } from '@/types';

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function useFilteredTasks() {
  const tasks = useTaskStore((state) => state.tasks);
  const activeProjectId = useUIStore((state) => state.activeProjectId);
  const filters = useUIStore((state) => state.filters);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Must belong to current project
      if (task.projectId !== activeProjectId) return false;

      // Search filter (title, code, description)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchCode = task.code.toLowerCase().includes(query);
        const matchDesc = task.description.toLowerCase().includes(query);
        const matchAssignee = task.assignee?.name.toLowerCase().includes(query);
        if (!matchTitle && !matchCode && !matchDesc && !matchAssignee) return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
        return false;
      }

      // Priority filter
      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }

      // Assignee filter
      if (filters.assigneeIds.length > 0) {
        if (!task.assigneeId || !filters.assigneeIds.includes(task.assigneeId)) {
          return false;
        }
      }

      // Label filter
      if (filters.labelIds.length > 0) {
        const taskLabelIds = task.labels.map((l) => l.id);
        const hasLabel = filters.labelIds.some((lid) => taskLabelIds.includes(lid));
        if (!hasLabel) return false;
      }

      return true;
    });
  }, [tasks, activeProjectId, filters]);

  const sortedTasks = useMemo(() => {
    const list = [...filteredTasks];
    const { sortBy, sortOrder } = filters;

    list.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'priority':
          comparison = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
          break;
        case 'dueDate': {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          comparison = dateA - dateB;
          break;
        }
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt': {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          comparison = dateB - dateA;
          break;
        }
        case 'position':
        default:
          comparison = a.position - b.position;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [filteredTasks, filters.sortBy, filters.sortOrder]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.trim().length > 0 ||
      filters.statuses.length > 0 ||
      filters.priorities.length > 0 ||
      filters.assigneeIds.length > 0 ||
      filters.labelIds.length > 0 ||
      filters.sortBy !== 'position'
    );
  }, [filters]);

  return {
    tasks: sortedTasks,
    allProjectTasks: tasks.filter((t) => t.projectId === activeProjectId),
    hasActiveFilters,
  };
}
