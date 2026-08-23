'use client';

import React from 'react';
import { useUIStore } from '@/stores/ui-store';
import { ViewMode } from '@/types';
import { FilterPopover } from '@/components/filters/filter-popover';
import { ActiveFilterBar } from '@/components/filters/active-filter-bar';
import { DeadlineTimer } from '@/components/ui/deadline-timer';
import {
  Kanban,
  Calendar,
  Search,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const viewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);
  const filters = useUIStore((state) => state.filters);
  const setSearch = useUIStore((state) => state.setSearch);
  const setCreateTaskModalOpen = useUIStore((state) => state.setCreateTaskModalOpen);

  const viewTabs = [
    { id: 'board' as ViewMode, label: 'Board', icon: Kanban },
    { id: 'calendar' as ViewMode, label: 'Calendar', icon: Calendar },
  ];

  return (
    <header className="border-b border-border/60 bg-background/85 backdrop-blur-xl sticky top-0 z-20 shrink-0 select-none">
      {/* Top Header Row: Left (Title) & Right (Deadline Timer) */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-3.5 pb-2">
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            HariSumiran
          </h1>
          <p className="text-xs text-muted-foreground">
            Production workspace & sprint tracker
          </p>
        </div>

        {/* Live Deadline Countdown Timer on the Right Side */}
        <div className="flex items-center">
          <DeadlineTimer />
        </div>
      </div>

      {/* Control Bar: View Switcher (Board & Calendar), Search, Filter & New Task Button */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-6 pb-3 pt-1">
        {/* View Switcher Tabs (Board & Calendar only) */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-border/50 shadow-2xs">
          {viewTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none',
                  isActive
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search, Filter & New Task Button */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative w-44 sm:w-56 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks... (/)"
              className="h-8.5 w-full rounded-xl border border-border bg-card pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 shadow-2xs"
            />
          </div>

          <FilterPopover />

          {/* "+ New Task" Button */}
          <button
            onClick={() => setCreateTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      <div className="px-6">
        <ActiveFilterBar />
      </div>
    </header>
  );
}
