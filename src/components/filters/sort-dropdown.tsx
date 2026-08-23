'use client';

import React from 'react';
import { useUIStore } from '@/stores/ui-store';
import { FilterState } from '@/types';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export function SortDropdown() {
  const sortBy = useUIStore((state) => state.filters.sortBy);
  const sortOrder = useUIStore((state) => state.filters.sortOrder);
  const setSortBy = useUIStore((state) => state.setSortBy);
  const toggleSortOrder = useUIStore((state) => state.toggleSortOrder);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center rounded-lg border border-border bg-card px-2 py-1 text-xs">
        <span className="text-muted-foreground mr-1.5 hidden sm:inline">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as FilterState['sortBy'])}
          aria-label="Sort tasks by"
          className="bg-transparent text-xs font-medium text-foreground cursor-pointer focus:outline-hidden"
        >
          <option value="position">Manual / Board</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
          <option value="createdAt">Created Date</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>

      <button
        onClick={toggleSortOrder}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        title={`Sort direction: ${sortOrder.toUpperCase()}`}
      >
        {sortOrder === 'asc' ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
