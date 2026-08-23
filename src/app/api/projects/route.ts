import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { Project } from '@/types';

export async function GET() {
  try {
    const db = getDatabase();
    return NextResponse.json({ success: true, projects: db.projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDatabase();

    const newProject: Project = {
      id: body.id || `proj-${Date.now()}`,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description || '',
      icon: body.icon || 'FolderKanban',
      color: body.color || '#6366f1',
      status: 'active',
      isFavorite: false,
      memberIds: body.memberIds || ['usr-1'],
      createdAt: new Date().toISOString(),
    };

    const updatedProjects = [...db.projects, newProject];
    saveDatabase({ projects: updatedProjects });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
