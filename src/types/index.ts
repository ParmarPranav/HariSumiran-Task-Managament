export type TaskStatus = 'not_started' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ViewMode = 'board' | 'calendar';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  initials: string;
  color?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string; // Tailwind color token or hex
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface ActivityLog {
  id: string;
  taskId: string;
  authorName: string;
  action: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface Task {
  id: string;
  code: string; // e.g. "HS-101"
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  assigneeId?: string;
  assignee?: User;
  labels: Label[];
  dueDate?: string; // ISO date string
  subtasks: Subtask[];
  comments: Comment[];
  attachments: Attachment[];
  projectId: string;
  createdAt: string;
  updatedAt: string;
  timeSpentSeconds?: number;
  inProgressStartedAt?: string;
  isTimerRunning?: boolean;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'completed' | 'archived';
  isFavorite: boolean;
  memberIds: string[];
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string;
  projects: Project[];
  members: User[];
}

export interface FilterState {
  search: string;
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  assigneeIds: string[];
  labelIds: string[];
  sortBy: 'position' | 'priority' | 'dueDate' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}
