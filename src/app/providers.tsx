'use client';

import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useUIStore } from '@/stores/ui-store';

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      {children}
      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{
          className:
            'bg-card text-card-foreground border-border shadow-lg rounded-xl text-sm font-sans',
        }}
      />
    </>
  );
}
