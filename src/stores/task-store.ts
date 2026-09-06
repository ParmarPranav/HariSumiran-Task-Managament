import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, TaskStatus, TaskPriority, Label, Subtask, Comment } from '@/types';
import { MOCK_TASKS, MOCK_USERS } from '@/services/mock-data';

interface HistoryEntry {
  type: 'delete' | 'status_change' | 'reorder';
  task: Task;
  previousStatus?: TaskStatus;
  previousPosition?: number;
}

interface TaskStore {
  tasks: Task[];
  history: HistoryEntry[];
  isLoading: boolean;

  // Sync
  fetchTasksFromBackend: () => Promise<void>;

  // Queries
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (projectId: string, status: TaskStatus) => Task[];
  getTaskById: (taskId: string) => Task | undefined;

  // Actions
  addTask: (task: Omit<Task, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'position' | 'subtasks' | 'comments' | 'attachments'>) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => Task | undefined;
  duplicateTask: (taskId: string) => Task | undefined;
  toggleTaskTimer: (taskId: string) => void;

  // Drag & drop moves
  moveTask: (taskId: string, targetStatus: TaskStatus, newPosition?: number) => void;
  reorderTasks: (status: TaskStatus, orderedTaskIds: string[]) => void;

  // Subtasks
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Comments
  addComment: (taskId: string, content: string, authorId?: string) => void;

  // Labels
  toggleLabel: (taskId: string, label: Label) => void;

  // Undo
  undoLastAction: () => void;

  // Reset to mock data
  resetTasks: () => void;
}

// Background sync helper to save tasks to backend API
async function syncTaskToBackend(method: 'POST' | 'PATCH' | 'DELETE', payload?: any, queryParam?: string) {
  try {
    const url = queryParam ? `/api/tasks?${queryParam}` : '/api/tasks';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
    });
  } catch (error) {
    console.warn('Backend sync failed, state preserved locally:', error);
  }
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: MOCK_TASKS,
      history: [],
      isLoading: false,

      fetchTasksFromBackend: async () => {
        try {
          set({ isLoading: true });
          const res = await fetch('/api/tasks');
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.tasks)) {
              const localTasks = get().tasks || [];
              const mergedMap = new Map<string, Task>();

              // Populate from server first
              data.tasks.forEach((st: Task) => {
                mergedMap.set(st.id, st);
              });

              // Merge with local tasks: keep local task if local is newer or updated in browser
              localTasks.forEach((lt: Task) => {
                const server = mergedMap.get(lt.id);
                if (!server) {
                  mergedMap.set(lt.id, lt);
                } else {
                  const localTime = new Date(lt.updatedAt || 0).getTime();
                  const serverTime = new Date(server.updatedAt || 0).getTime();

                  if (localTime >= serverTime) {
                    const serverAtts = server.attachments || [];
                    const localAtts = lt.attachments || [];
                    const finalAtts = localAtts.length >= serverAtts.length ? localAtts : serverAtts;

                    mergedMap.set(lt.id, {
                      ...server,
                      ...lt,
                      attachments: finalAtts,
                    });
                  } else {
                    const serverAtts = server.attachments || [];
                    const localAtts = lt.attachments || [];
                    const finalAtts = localAtts.length >= serverAtts.length ? localAtts : serverAtts;

                    mergedMap.set(lt.id, {
                      ...lt,
                      ...server,
                      attachments: finalAtts,
                      timeSpentSeconds: lt.timeSpentSeconds ?? server.timeSpentSeconds,
                      inProgressStartedAt: lt.inProgressStartedAt ?? server.inProgressStartedAt,
                      isTimerRunning: lt.isTimerRunning ?? server.isTimerRunning,
                    });
                  }
                }
              });

              set({ tasks: Array.from(mergedMap.values()) });
            }
          }
        } catch (err) {
          console.warn('Could not fetch from backend, using local store:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      getTasksByProject: (projectId: string) => {
        return get().tasks.filter((t) => t.projectId === projectId);
      },

      getTasksByStatus: (projectId: string, status: TaskStatus) => {
        return get()
          .tasks.filter((t) => t.projectId === projectId && t.status === status)
          .sort((a, b) => a.position - b.position);
      },

      getTaskById: (taskId: string) => {
        return get().tasks.find((t) => t.id === taskId);
      },

      addTask: (taskData) => {
        const tasks = get().tasks;
        const projectTasks = tasks.filter(
          (t) => t.projectId === taskData.projectId && t.status === taskData.status
        );
        const nextPosition = projectTasks.length;
        const taskNumber = tasks.length + 101;
        const now = new Date().toISOString();

        const assignee = taskData.assigneeId
          ? MOCK_USERS.find((u) => u.id === taskData.assigneeId)
          : undefined;

        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          code: `HS-${taskNumber}`,
          position: nextPosition,
          assignee,
          subtasks: [],
          comments: [],
          attachments: [],
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        // Persist to server API
        syncTaskToBackend('POST', newTask);

        return newTask;
      },

      updateTask: (taskId, updates) => {
        const now = new Date().toISOString();
        let updatedItem: Task | undefined;

        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;

            let updatedAssignee = task.assignee;
            if (updates.assigneeId !== undefined) {
              updatedAssignee = updates.assigneeId
                ? MOCK_USERS.find((u) => u.id === updates.assigneeId)
                : undefined;
            }

            let timerFields: Partial<Task> = {};
            if (updates.status && updates.status !== task.status) {
              if (updates.status === 'in_progress') {
                timerFields = {
                  inProgressStartedAt: task.inProgressStartedAt || now,
                  isTimerRunning: true,
                };
              } else if (task.status === 'in_progress') {
                let elapsed = task.timeSpentSeconds || 0;
                if (task.inProgressStartedAt) {
                  const started = new Date(task.inProgressStartedAt).getTime();
                  if (!isNaN(started)) {
                    elapsed += Math.max(0, Math.floor((Date.now() - started) / 1000));
                  }
                }
                timerFields = {
                  timeSpentSeconds: elapsed,
                  isTimerRunning: false,
                };
              }
            }

            updatedItem = {
              ...task,
              ...updates,
              ...timerFields,
              assignee: updatedAssignee,
              updatedAt: now,
            };

            return updatedItem;
          }),
        }));

        if (updatedItem) {
          syncTaskToBackend('PATCH', { id: taskId, ...updates });
        }
      },

      deleteTask: (taskId) => {
        const target = get().tasks.find((t) => t.id === taskId);
        if (!target) return undefined;

        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
          history: [...state.history, { type: 'delete', task: target }],
        }));

        syncTaskToBackend('DELETE', undefined, `id=${taskId}`);
        return target;
      },

      duplicateTask: (taskId) => {
        const target = get().tasks.find((t) => t.id === taskId);
        if (!target) return undefined;

        const now = new Date().toISOString();
        const nextCode = `HS-${get().tasks.length + 101}`;
        const duplicated: Task = {
          ...target,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          code: nextCode,
          title: `${target.title} (Copy)`,
          position: target.position + 1,
          createdAt: now,
          updatedAt: now,
          subtasks: target.subtasks.map((s) => ({
            ...s,
            id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            completed: false,
          })),
          comments: [],
        };

        set((state) => ({
          tasks: [...state.tasks, duplicated],
        }));

        syncTaskToBackend('POST', duplicated);
        return duplicated;
      },

      moveTask: (taskId, targetStatus, newPosition) => {
        const tasks = [...get().tasks];
        const taskIndex = tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return;

        const currentTask = tasks[taskIndex];
        const previousStatus = currentTask.status;
        const previousPosition = currentTask.position;

        const targetColumnTasks = tasks
          .filter((t) => t.projectId === currentTask.projectId && t.status === targetStatus && t.id !== taskId)
          .sort((a, b) => a.position - b.position);

        const targetPos =
          typeof newPosition === 'number'
            ? Math.max(0, Math.min(newPosition, targetColumnTasks.length))
            : targetColumnTasks.length;

        let timerFields: Partial<Task> = {};
        if (previousStatus !== targetStatus) {
          if (targetStatus === 'in_progress') {
            timerFields = {
              inProgressStartedAt: currentTask.inProgressStartedAt || new Date().toISOString(),
              isTimerRunning: true,
            };
          } else if (previousStatus === 'in_progress') {
            let elapsed = currentTask.timeSpentSeconds || 0;
            if (currentTask.inProgressStartedAt) {
              const started = new Date(currentTask.inProgressStartedAt).getTime();
              if (!isNaN(started)) {
                elapsed += Math.max(0, Math.floor((Date.now() - started) / 1000));
              }
            }
            timerFields = {
              timeSpentSeconds: elapsed,
              isTimerRunning: false,
            };
          }
        }

        targetColumnTasks.splice(targetPos, 0, {
          ...currentTask,
          ...timerFields,
          status: targetStatus,
          updatedAt: new Date().toISOString(),
        });

        targetColumnTasks.forEach((task, idx) => {
          task.position = idx;
        });

        let sourceColumnTasks: Task[] = [];
        if (previousStatus !== targetStatus) {
          sourceColumnTasks = tasks
            .filter((t) => t.projectId === currentTask.projectId && t.status === previousStatus && t.id !== taskId)
            .sort((a, b) => a.position - b.position);

          sourceColumnTasks.forEach((task, idx) => {
            task.position = idx;
          });
        }

        const updatedMap = new Map<string, Task>();
        targetColumnTasks.forEach((t) => updatedMap.set(t.id, t));
        sourceColumnTasks.forEach((t) => updatedMap.set(t.id, t));

        const updatedAll = get().tasks.map((t) => updatedMap.get(t.id) || t);

        set((state) => ({
          tasks: updatedAll,
          history: [
            ...state.history,
            {
              type: 'status_change',
              task: currentTask,
              previousStatus,
              previousPosition,
            },
          ],
        }));

        // Batch sync updated positions to backend API
        syncTaskToBackend('PATCH', { tasks: updatedAll });
      },

      reorderTasks: (status, orderedTaskIds) => {
        const now = new Date().toISOString();
        const positionMap = new Map<string, number>();
        orderedTaskIds.forEach((id, idx) => positionMap.set(id, idx));

        const updatedAll = get().tasks.map((task) => {
          if (task.status === status && positionMap.has(task.id)) {
            return {
              ...task,
              position: positionMap.get(task.id)!,
              updatedAt: now,
            };
          }
          return task;
        });

        set({ tasks: updatedAll });
        syncTaskToBackend('PATCH', { tasks: updatedAll });
      },

      toggleTaskTimer: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;

        const now = new Date().toISOString();
        const currentlyRunning = (task.isTimerRunning !== false) && task.status === 'in_progress';

        if (currentlyRunning) {
          let elapsed = task.timeSpentSeconds || 0;
          if (task.inProgressStartedAt) {
            const started = new Date(task.inProgressStartedAt).getTime();
            if (!isNaN(started)) {
              elapsed += Math.max(0, Math.floor((Date.now() - started) / 1000));
            }
          }
          get().updateTask(taskId, {
            timeSpentSeconds: elapsed,
            isTimerRunning: false,
          });
        } else {
          get().updateTask(taskId, {
            inProgressStartedAt: now,
            isTimerRunning: true,
          });
        }
      },

      addSubtask: (taskId, title) => {
        if (!title.trim()) return;
        const newSubtask: Subtask = {
          id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: title.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        };

        const updatedAll = get().tasks.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: [...t.subtasks, newSubtask],
            updatedAt: new Date().toISOString(),
          };
        });

        set({ tasks: updatedAll });
        syncTaskToBackend('PATCH', {
          id: taskId,
          subtasks: updatedAll.find((t) => t.id === taskId)?.subtasks,
        });
      },

      toggleSubtask: (taskId, subtaskId) => {
        const updatedAll = get().tasks.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
            updatedAt: new Date().toISOString(),
          };
        });

        set({ tasks: updatedAll });
        syncTaskToBackend('PATCH', {
          id: taskId,
          subtasks: updatedAll.find((t) => t.id === taskId)?.subtasks,
        });
      },

      deleteSubtask: (taskId, subtaskId) => {
        const updatedAll = get().tasks.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
            updatedAt: new Date().toISOString(),
          };
        });

        set({ tasks: updatedAll });
        syncTaskToBackend('PATCH', {
          id: taskId,
          subtasks: updatedAll.find((t) => t.id === taskId)?.subtasks,
        });
      },

      addComment: (taskId, content, authorId = 'usr-4') => {
        if (!content.trim()) return;
        const author = MOCK_USERS.find((u) => u.id === authorId) || MOCK_USERS[3];
        const newComment: Comment = {
          id: `com-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          authorId: author.id,
          authorName: author.name,
          authorAvatar: author.avatarUrl,
          content: content.trim(),
          createdAt: new Date().toISOString(),
        };

        const updatedAll = get().tasks.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            comments: [...t.comments, newComment],
            updatedAt: new Date().toISOString(),
          };
        });

        set({ tasks: updatedAll });
        syncTaskToBackend('PATCH', {
          id: taskId,
          comments: updatedAll.find((t) => t.id === taskId)?.comments,
        });
      },

      toggleLabel: (taskId, label) => {
        const updatedAll = get().tasks.map((t) => {
          if (t.id !== taskId) return t;
          const exists = t.labels.some((l) => l.id === label.id);
          const updatedLabels = exists
            ? t.labels.filter((l) => l.id !== label.id)
            : [...t.labels, label];
          return {
            ...t,
            labels: updatedLabels,
            updatedAt: new Date().toISOString(),
          };
        });

        set({ tasks: updatedAll });
        syncTaskToBackend('PATCH', {
          id: taskId,
          labels: updatedAll.find((t) => t.id === taskId)?.labels,
        });
      },

      undoLastAction: () => {
        const history = [...get().history];
        const last = history.pop();
        if (!last) return;

        if (last.type === 'delete') {
          const updatedAll = [...get().tasks, last.task];
          set({ tasks: updatedAll, history });
          syncTaskToBackend('POST', last.task);
        } else if (last.type === 'status_change' && last.previousStatus) {
          get().moveTask(last.task.id, last.previousStatus, last.previousPosition);
          set((state) => ({
            history: state.history.slice(0, -1),
          }));
        }
      },

      resetTasks: () => {
        set({ tasks: MOCK_TASKS, history: [] });
        syncTaskToBackend('PATCH', { tasks: MOCK_TASKS });
      },
    }),
    {
      name: 'harisumiran-tasks-store-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
