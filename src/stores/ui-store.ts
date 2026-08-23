import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ViewMode, FilterState, TaskStatus, TaskPriority } from '@/types';

interface UIStore {
  activeProjectId: string;
  selectedTaskId: string | null;
  viewMode: ViewMode;
  sidebarCollapsed: boolean;
  isCommandOpen: boolean;
  isCreateTaskModalOpen: boolean;
  createTaskDefaultStatus: TaskStatus;
  theme: 'dark' | 'light';
  
  // Filters
  filters: FilterState;

  // Actions
  setActiveProject: (projectId: string) => void;
  setSelectedTaskId: (taskId: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  setCreateTaskModalOpen: (open: boolean, defaultStatus?: TaskStatus) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  
  // Filter controls
  setSearch: (search: string) => void;
  toggleStatusFilter: (status: TaskStatus) => void;
  togglePriorityFilter: (priority: TaskPriority) => void;
  toggleAssigneeFilter: (assigneeId: string) => void;
  toggleLabelFilter: (labelId: string) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  toggleSortOrder: () => void;
  clearFilters: () => void;
}

const initialFilters: FilterState = {
  search: '',
  statuses: [],
  priorities: [],
  assigneeIds: [],
  labelIds: [],
  sortBy: 'position',
  sortOrder: 'asc',
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      activeProjectId: 'proj-1',
      selectedTaskId: null,
      viewMode: 'board',
      sidebarCollapsed: false,
      isCommandOpen: false,
      isCreateTaskModalOpen: false,
      createTaskDefaultStatus: 'not_started',
      theme: 'dark',
      filters: initialFilters,

      setActiveProject: (projectId) => set({ activeProjectId: projectId }),
      setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
      setViewMode: (viewMode) => set({ viewMode }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setCommandOpen: (isCommandOpen) => set({ isCommandOpen }),
      setCreateTaskModalOpen: (isCreateTaskModalOpen, defaultStatus = 'not_started') =>
        set({ isCreateTaskModalOpen, createTaskDefaultStatus: defaultStatus }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),

      setSearch: (search) =>
        set((state) => ({ filters: { ...state.filters, search } })),

      toggleStatusFilter: (status) =>
        set((state) => {
          const current = state.filters.statuses;
          const next = current.includes(status)
            ? current.filter((s) => s !== status)
            : [...current, status];
          return { filters: { ...state.filters, statuses: next } };
        }),

      togglePriorityFilter: (priority) =>
        set((state) => {
          const current = state.filters.priorities;
          const next = current.includes(priority)
            ? current.filter((p) => p !== priority)
            : [...current, priority];
          return { filters: { ...state.filters, priorities: next } };
        }),

      toggleAssigneeFilter: (assigneeId) =>
        set((state) => {
          const current = state.filters.assigneeIds;
          const next = current.includes(assigneeId)
            ? current.filter((a) => a !== assigneeId)
            : [...current, assigneeId];
          return { filters: { ...state.filters, assigneeIds: next } };
        }),

      toggleLabelFilter: (labelId) =>
        set((state) => {
          const current = state.filters.labelIds;
          const next = current.includes(labelId)
            ? current.filter((l) => l !== labelId)
            : [...current, labelId];
          return { filters: { ...state.filters, labelIds: next } };
        }),

      setSortBy: (sortBy) =>
        set((state) => ({ filters: { ...state.filters, sortBy } })),

      toggleSortOrder: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            sortOrder: state.filters.sortOrder === 'asc' ? 'desc' : 'asc',
          },
        })),

      clearFilters: () => set({ filters: initialFilters }),
    }),
    {
      name: 'harisumiran-ui-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeProjectId: state.activeProjectId,
        viewMode: state.viewMode,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
