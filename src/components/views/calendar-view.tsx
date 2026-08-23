'use client';

import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { Task } from '@/types';
import { useUIStore } from '@/stores/ui-store';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { STATUS_CONFIG, cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const setSelectedTaskId = useUIStore((state) => state.setSelectedTaskId);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), day);
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-zinc-50/60 dark:bg-zinc-900/30">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {format(currentDate, 'MMMM yyyy')}
        </h2>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border bg-zinc-50/40 dark:bg-zinc-900/20 text-center text-[11px] font-semibold text-muted-foreground uppercase py-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-border/50 overflow-y-auto">
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isDayToday = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-[110px] p-2 transition-colors flex flex-col',
                !isCurrentMonth && 'bg-zinc-100/30 dark:bg-zinc-900/40 opacity-40',
                isDayToday && 'bg-zinc-100/60 dark:bg-zinc-800/30'
              )}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-mono font-medium',
                    isDayToday
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                      : 'text-foreground'
                  )}
                >
                  {format(day, 'd')}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                )}
              </div>

              {/* Tasks within day */}
              <div className="space-y-1 flex-1 overflow-y-auto pr-0.5">
                {dayTasks.map((task) => {
                  const statusCfg = STATUS_CONFIG[task.status];
                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="group flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] bg-zinc-100/80 dark:bg-zinc-800/80 border border-border/60 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer truncate"
                      title={task.title}
                    >
                      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', statusCfg.dotColor)} />
                      <span className="font-mono text-[9px] text-muted-foreground shrink-0">
                        {task.code}
                      </span>
                      <span className="truncate font-medium text-foreground group-hover:text-primary">
                        {task.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
