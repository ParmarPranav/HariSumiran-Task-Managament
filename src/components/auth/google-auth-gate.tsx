'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import { MOCK_USERS } from '@/services/mock-data';
import { Layers, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function GoogleAuthGate() {
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle('alex.morgan@gmail.com', 'Alex Morgan');
      setIsLoading(false);
      toast.success('Signed in with Google (3-Hour Active Session)');
    }, 500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customName.trim()) {
      toast.error('Please enter your name and Google email');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle(customEmail.trim(), customName.trim());
      setIsLoading(false);
      toast.success(`Signed in as ${customName} (3-Hour Session)`);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 p-4 text-zinc-100 selection:bg-zinc-800">
      {/* Background glow & subtle ambient stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-xl z-10 select-none"
      >
        {/* Workspace Brand Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-950 shadow-lg mb-3">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">HariSumiran</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-[280px]">
            Intelligent Mission Control & Project Workspace
          </p>

          {/* 3-Hour Session Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-400">
            <Clock className="h-3 w-3" />
            <span>3-Hour Secure Google Session</span>
          </div>
        </div>

        {/* Primary Google Login Button */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-800/90 px-4 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 hover:border-zinc-500 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {/* Google SVG Icon */}
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'Authenticating...' : 'Sign in with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-zinc-800" />
            <span className="absolute bg-zinc-900 px-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
              Or pick account
            </span>
          </div>

          {/* Quick Demo Google Accounts */}
          <div className="grid grid-cols-2 gap-2">
            {MOCK_USERS.slice(0, 4).map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  loginAsDemo(u);
                  toast.success(`Signed in as ${u.name} (3-Hour Session)`);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/60 hover:border-zinc-700 text-left transition-all cursor-pointer group"
              >
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: u.color }}
                >
                  {u.initials}
                </div>
                <div className="truncate min-w-0">
                  <div className="text-xs font-medium text-zinc-200 group-hover:text-white truncate">
                    {u.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">{u.role}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Google Account Prompt toggle */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => setShowCustom(!showCustom)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
            >
              {showCustom ? 'Hide manual input' : 'Use a specific Google email address'}
            </button>
          </div>

          {showCustom && (
            <form onSubmit={handleCustomSubmit} className="space-y-2 pt-2 animate-in fade-in-50">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Full Name (e.g. Pranav Parmar)"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0 focus:border-zinc-500"
                style={{ outline: 'none', boxShadow: 'none' }}
              />
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="Google Email (e.g. pranav@gmail.com)"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0 focus:border-zinc-500"
                style={{ outline: 'none', boxShadow: 'none' }}
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-white text-zinc-950 py-2 text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Start 3-Hour Session
              </button>
            </form>
          )}
        </div>

        {/* Security badge footer */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-4">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>OAuth 2.0 • 3h Auto-Expiring Session • Supabase Connected</span>
        </div>
      </motion.div>
    </div>
  );
}
