'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types';
import { useTaskStore } from '@/stores/task-store';
import { KanbanColumn } from './kanban-column';
import { DragOverlayCard } from './drag-overlay-card';

const COLUMNS: TaskStatus[] = ['not_started', 'in_progress', 'done'];

interface KanbanBoardProps {
  tasks: Task[];
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const moveTask = useTaskStore((state) => state.moveTask);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);

  // Require 8px drag distance before starting drag to allow effortless clicks
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const notStartedTasks = tasks.filter((t) => t.status === 'not_started');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  const getColumnTasks = (status: TaskStatus) => {
    switch (status) {
      case 'not_started':
        return notStartedTasks;
      case 'in_progress':
        return inProgressTasks;
      case 'done':
        return doneTasks;
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if dragging over a column directly
    const isOverAColumn = COLUMNS.includes(overId as TaskStatus);
    if (isOverAColumn) {
      const targetStatus = overId as TaskStatus;
      if (activeTask.status !== targetStatus) {
        moveTask(activeId, targetStatus);
      }
      return;
    }

    // Dragging over another task card
    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (activeTask.status !== overTask.status) {
      moveTask(activeId, overTask.status, overTask.position);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // If dropped over a column container
    if (COLUMNS.includes(overId as TaskStatus)) {
      const targetStatus = overId as TaskStatus;
      if (activeTask.status !== targetStatus) {
        moveTask(activeId, targetStatus);
      }
      return;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    // If within same column, reorder
    if (activeTask.status === overTask.status) {
      const columnTasks = getColumnTasks(activeTask.status);
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(columnTasks, oldIndex, newIndex);
        reorderTasks(
          activeTask.status,
          reordered.map((t) => t.id)
        );
      }
    } else {
      // Across columns
      moveTask(activeId, overTask.status, overTask.position);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-14rem)] w-full gap-4 overflow-x-auto pb-4 pt-1 px-1">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getColumnTasks(status)}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeTask ? <DragOverlayCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
