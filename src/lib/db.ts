import fs from 'fs';
import path from 'path';
import { Task, Project, User } from '@/types';
import { MOCK_TASKS, MOCK_PROJECTS, MOCK_USERS } from '@/services/mock-data';

interface DatabaseSchema {
  tasks: Task[];
  projects: Project[];
  users: User[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory and database file exist
function initializeDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseSchema = {
        tasks: MOCK_TASKS,
        projects: MOCK_PROJECTS,
        users: MOCK_USERS,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(fileContent) as DatabaseSchema;
  } catch (error) {
    console.error('Error initializing database file, falling back to mock data:', error);
    return {
      tasks: MOCK_TASKS,
      projects: MOCK_PROJECTS,
      users: MOCK_USERS,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export function getDatabase(): DatabaseSchema {
  return initializeDatabase();
}

export function saveDatabase(data: Partial<DatabaseSchema>): DatabaseSchema {
  try {
    const current = getDatabase();
    const updated: DatabaseSchema = {
      ...current,
      ...data,
      lastUpdated: new Date().toISOString(),
    };

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (error) {
    console.error('Error saving database:', error);
    return getDatabase();
  }
}
