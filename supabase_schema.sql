-- ==========================================
-- HariSumiran Supabase Database Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==========================================

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  code TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not_started',
  priority TEXT NOT NULL DEFAULT 'medium',
  position INTEGER DEFAULT 0,
  "assigneeId" TEXT,
  assignee JSONB,
  labels JSONB DEFAULT '[]'::jsonb,
  "dueDate" TEXT,
  subtasks JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  "projectId" TEXT DEFAULT 'proj-1',
  "createdAt" TEXT,
  "updatedAt" TEXT
);

-- Enable Row Level Security (RLS) and allow public access for your anon key
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON tasks FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON tasks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON tasks FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access"
  ON tasks FOR DELETE
  USING (true);
