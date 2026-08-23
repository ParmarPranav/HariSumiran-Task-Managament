'use client';

import React from 'react';
import { useUIStore } from '@/stores/ui-store';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/utils';
import { X, RotateCcw } from 'lucide-react';

export function ActiveFilterBar() {
  const filters = useUIStore((state) => state.filters);
  const toggleStatusFilter = useUIStore((state) => state.toggleStatusFilter);
  const togglePriorityFilter = useUIStore((state) => state.togglePriorityFilter);
  const setSearch = useUIStore((state) => state.setSearch);
  const clearFilters = useUIStore((state) => state.clearFilters);

  const hasAnyFilter =
    filters.search.trim().length > 0 ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1.5 text-xs">
      <span className="text-[11px] font-medium text-muted-foreground mr-1">Active filters:</span>

      {/* Search pill */}
      {filters.search.trim() && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-foreground font-medium text-[11px]">
          Search: &ldquo;{filters.search}&rdquo;
          <button
            onClick={() => setSearch('')}
            className="hover:text-rose-500 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Status pills */}
      {filters.statuses.map((status) => (
        <span
          key={status}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-foreground font-medium text-[11px]"
        >
          Status: {STATUS_CONFIG[status].label}
          <button
            onClick={() => toggleStatusFilter(status)}
            className="hover:text-rose-500 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Priority pills */}
      {filters.priorities.map((priority) => (
        <span
          key={priority}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-foreground font-medium text-[11px]"
        >
          Priority: {PRIORITY_CONFIG[priority].label}
          <button
            onClick={() => togglePriorityFilter(priority)}
            className="hover:text-rose-500 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <button
        onClick={clearFilters}
        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground ml-1 underline cursor-pointer"
      >
        <RotateCcw className="h-2.5 w-2.5" />
        <span>Reset</span>
      </button>
    </div>
  );
}
