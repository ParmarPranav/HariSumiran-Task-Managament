'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { TaskPriority, TaskStatus } from '@/types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/utils';
import { Filter, Check } from 'lucide-react';

export function FilterPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const filters = useUIStore((state) => state.filters);
  const toggleStatusFilter = useUIStore((state) => state.toggleStatusFilter);
  const togglePriorityFilter = useUIStore((state) => state.togglePriorityFilter);
  const clearFilters = useUIStore((state) => state.clearFilters);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeCount = filters.statuses.length + filters.priorities.length;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
          activeCount > 0
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
            : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <Filter className="h-3.5 w-3.5" />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 dark:bg-black/20 text-[10px] font-mono">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 z-40 w-60 rounded-2xl border border-border bg-popover p-3.5 shadow-xl text-xs space-y-3.5 animate-in fade-in-50 zoom-in-95">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-semibold text-foreground">Filter tasks</span>
            {activeCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Status
            </span>
            <div className="space-y-0.5">
              {(['not_started', 'in_progress', 'done'] as TaskStatus[]).map((status) => {
                const isSelected = filters.statuses.includes(status);
                return (
                  <button
                    key={status}
                    onClick={() => toggleStatusFilter(status)}
                    className="flex w-full items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                  >
                    <span>{STATUS_CONFIG[status].label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Priority
            </span>
            <div className="space-y-0.5">
              {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((priority) => {
                const isSelected = filters.priorities.includes(priority);
                return (
                  <button
                    key={priority}
                    onClick={() => togglePriorityFilter(priority)}
                    className="flex w-full items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                  >
                    <span>{PRIORITY_CONFIG[priority].label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
