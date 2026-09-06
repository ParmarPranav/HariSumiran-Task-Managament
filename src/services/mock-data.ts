import { Project, Task, User } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'HariSumiran Admin',
    email: 'admin@harisumiran.io',
    role: 'Lead',
    initials: 'HA',
    color: '#6366f1',
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'HariSumiran',
    slug: 'harisumiran',
    description: 'HariSumiran project workspace',
    icon: 'FolderKanban',
    color: '#6366f1',
    status: 'active',
    isFavorite: true,
    memberIds: ['usr-1'],
    createdAt: '2026-08-01T08:00:00.000Z',
  },
];

const nowMs = Date.now();
const t24mAgo = new Date(nowMs - 24 * 60 * 1000).toISOString();
const t1h12mAgo = new Date(nowMs - (72 * 60 + 15) * 1000).toISOString();

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    code: 'HS-101',
    title: 'Add Gujarati language to HariSumiran app',
    description: 'Implement Gujarati localization support across the HariSumiran workspace.',
    status: 'done',
    priority: 'high',
    position: 0,
    labels: [],
    dueDate: '2026-10-25T18:00:00.000Z',
    projectId: 'proj-1',
    subtasks: [
      {
        id: 'sub-1-1',
        title: 'Gujarati translation strings setup',
        completed: true,
        createdAt: '2026-08-23T10:00:00Z',
      },
    ],
    comments: [],
    attachments: [],
    createdAt: '2026-08-23T09:00:00.000Z',
    updatedAt: '2026-08-23T15:40:00.000Z',
    timeSpentSeconds: 4320, // 1h 12m
  },
  {
    id: 'task-2',
    code: 'HS-102',
    title: 'HariSumiran Admin Dashboard !',
    description: 'Core dashboard module for admin management and workspace metrics.',
    status: 'in_progress',
    priority: 'medium',
    position: 0,
    labels: [],
    projectId: 'proj-1',
    subtasks: [],
    comments: [],
    attachments: [],
    createdAt: '2026-09-06T10:00:00.000Z',
    updatedAt: '2026-09-06T12:00:00.000Z',
    timeSpentSeconds: 650,
    inProgressStartedAt: t24mAgo,
    isTimerRunning: true,
  },
  {
    id: 'task-3',
    code: 'HS-103',
    title: 'HariSumiran Mobile Application',
    description: 'Cross-platform mobile app client for HariSumiran task & sprint tracking.',
    status: 'in_progress',
    priority: 'medium',
    position: 1,
    labels: [],
    projectId: 'proj-1',
    subtasks: [],
    comments: [],
    attachments: [],
    createdAt: '2026-09-06T11:00:00.000Z',
    updatedAt: '2026-09-06T13:00:00.000Z',
    timeSpentSeconds: 1200,
    inProgressStartedAt: t1h12mAgo,
    isTimerRunning: true,
  },
];
