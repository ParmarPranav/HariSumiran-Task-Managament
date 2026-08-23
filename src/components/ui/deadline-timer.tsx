'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, Timer, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Target Deadline: Sunday, October 25, 2026 23:59:59
const TARGET_DEADLINE = new Date('2026-10-25T23:59:59').getTime();

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(): TimeRemaining {
  const now = new Date().getTime();
  const difference = TARGET_DEADLINE - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function DeadlineTimer({ className }: { className?: string }) {
  const [time, setTime] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    setTime(calculateTimeRemaining());
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="h-9 w-64 rounded-xl bg-zinc-800/40 animate-pulse border border-border/50" />
    );
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/90 border border-amber-500/30 text-zinc-100 shadow-sm backdrop-blur-md select-none',
        className
      )}
      title="Target Deadline: Sunday, October 25, 2026 · 11:59:59 PM"
    >
      {/* Left Icon & Label */}
      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <Timer className="h-3.5 w-3.5 text-amber-400" />
        <span className="hidden sm:inline font-semibold text-[11px] uppercase tracking-wider text-amber-300">
          Deadline:
        </span>
      </div>

      {/* Real-time Ticker Units (Days, Hours, Minutes, Seconds) */}
      <div className="flex items-center gap-1 font-mono text-xs">
        {/* Days */}
        <div className="flex items-baseline gap-0.5 bg-zinc-800/90 px-2 py-0.5 rounded-lg border border-border/60">
          <span className="font-bold text-foreground tracking-tight text-xs sm:text-sm">
            {time.days}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase font-sans">d</span>
        </div>

        <span className="text-zinc-500 font-bold text-xs">:</span>

        {/* Hours */}
        <div className="flex items-baseline gap-0.5 bg-zinc-800/90 px-1.5 py-0.5 rounded-lg border border-border/60">
          <span className="font-bold text-foreground tracking-tight text-xs sm:text-sm">
            {pad(time.hours)}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase font-sans">h</span>
        </div>

        <span className="text-zinc-500 font-bold text-xs">:</span>

        {/* Minutes */}
        <div className="flex items-baseline gap-0.5 bg-zinc-800/90 px-1.5 py-0.5 rounded-lg border border-border/60">
          <span className="font-bold text-foreground tracking-tight text-xs sm:text-sm">
            {pad(time.minutes)}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase font-sans">m</span>
        </div>

        <span className="text-zinc-500 font-bold text-xs">:</span>

        {/* Seconds (live ticking) */}
        <div className="flex items-baseline gap-0.5 bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded-lg border border-amber-500/30">
          <span className="font-bold text-amber-400 dark:text-amber-300 tracking-tight text-xs sm:text-sm tabular-nums">
            {pad(time.seconds)}
          </span>
          <span className="text-[9px] text-amber-400/80 uppercase font-sans">s</span>
        </div>
      </div>

      <div className="hidden lg:block text-[11px] text-muted-foreground pl-1 border-l border-zinc-700/60 font-medium">
        Sunday, Oct 25, 2026
      </div>
    </div>
  );
}
