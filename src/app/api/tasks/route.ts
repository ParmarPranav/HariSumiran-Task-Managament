import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Task } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // 1. Attempt fetching from Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('tasks').select('*');
        if (projectId) {
          query = query.eq('projectId', projectId);
        }
        const { data: cloudTasks, error } = await query;
        if (!error && cloudTasks && cloudTasks.length > 0) {
          saveDatabase({ tasks: cloudTasks as Task[] });
          return NextResponse.json({ success: true, tasks: cloudTasks, source: 'supabase' });
        }
      } catch (supabaseError) {
        console.warn('Supabase fetch failed, using local disk database:', supabaseError);
      }
    }

    // 2. Fallback to Local Disk Database (data/db.json)
    const db = getDatabase();
    let tasks = db.tasks;

    if (projectId) {
      tasks = tasks.filter((t) => t.projectId === projectId);
    }

    return NextResponse.json({ success: true, tasks, source: 'local_disk' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDatabase();

    const taskNumber = db.tasks.length + 101;
    const now = new Date().toISOString();

    const newTask: Task = {
      id: body.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      code: body.code || `HS-${taskNumber}`,
      title: body.title,
      description: body.description || '',
      status: body.status || 'not_started',
      priority: body.priority || 'medium',
      position: body.position ?? db.tasks.length,
      assigneeId: body.assigneeId,
      assignee: body.assignee,
      labels: body.labels || [],
      dueDate: body.dueDate,
      subtasks: body.subtasks || [],
      comments: body.comments || [],
      attachments: body.attachments || [],
      projectId: body.projectId || 'proj-1',
      createdAt: now,
      updatedAt: now,
    };

    // Save to local disk
    const updatedTasks = [...db.tasks, newTask];
    saveDatabase({ tasks: updatedTasks });

    // Sync to Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tasks').upsert([newTask]);
      } catch (e) {
        console.warn('Supabase POST sync fallback:', e);
      }
    }

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const db = getDatabase();

    // Case 1: Bulk tasks sync (e.g. after drag and drop reordering)
    if (Array.isArray(body.tasks)) {
      saveDatabase({ tasks: body.tasks });

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('tasks').upsert(body.tasks);
        } catch (e) {
          console.warn('Supabase bulk PATCH sync fallback:', e);
        }
      }

      return NextResponse.json({ success: true, count: body.tasks.length });
    }

    // Case 2: Single task update
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const updatedTasks = db.tasks.map((task) => {
      if (task.id !== id) return task;
      return {
        ...task,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    });

    saveDatabase({ tasks: updatedTasks });
    const updatedTask = updatedTasks.find((t) => t.id === id);

    if (isSupabaseConfigured && supabase && updatedTask) {
      try {
        await supabase.from('tasks').upsert([updatedTask]);
      } catch (e) {
        console.warn('Supabase PATCH sync fallback:', e);
      }
    }

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const updatedTasks = db.tasks.filter((t) => t.id !== id);
    saveDatabase({ tasks: updatedTasks });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tasks').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase DELETE sync fallback:', e);
      }
    }

    return NextResponse.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
