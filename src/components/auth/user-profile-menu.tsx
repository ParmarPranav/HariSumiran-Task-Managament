'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar } from '@/components/ui/avatar';
import { LogOut, ChevronUp, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfileMenuProps {
  collapsed?: boolean;
}

export function UserProfileMenu({ collapsed = false }: UserProfileMenuProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.info('Signed out of Google session');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 w-full p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors text-left cursor-pointer ${
          collapsed ? 'justify-center' : ''
        }`}
        title={user.name}
      >
        <Avatar user={user} size="sm" showTooltip={false} />

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">{user.name}</div>
            <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
          </div>
        )}

        {!collapsed && <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 w-56 rounded-2xl border border-border bg-popover p-1.5 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 text-xs">
          <div className="px-2.5 py-1.5 border-b border-border/50 mb-1">
            <div className="font-semibold text-foreground truncate">{user.name}</div>
            <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Google Authenticated</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-left transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
