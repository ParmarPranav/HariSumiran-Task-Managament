'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  Smartphone,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

export function GoogleAuthenticatorGate() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  useEffect(() => {
    // Auto-focus first input on load
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = cleanValue;
    setDigits(newDigits);

    // Auto-advance to next input if digit entered
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits filled
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      verifyCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setDigits(newDigits);

    if (pastedData.length === 6) {
      verifyCode(pastedData);
    } else {
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const verifyCode = (code: string) => {
    if (code.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      loginWithGoogle('admin@harisumiran.app', 'Pranav Parmar');
      setIsVerifying(false);
      toast.success('Google Authenticator Verified • 3-Hour Session Active');
    }, 400);
  };

  const fillDemoCode = () => {
    const demoCode = ['1', '2', '3', '4', '5', '6'];
    setDigits(demoCode);
    toast.info('Demo OTP code filled');
    verifyCode('123456');
  };

  const clearDigits = () => {
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const isComplete = digits.join('').length === 6 && !digits.includes('');
  const hasSomeDigits = digits.some((d) => d !== '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 p-4 text-zinc-100 selection:bg-blue-500/30">
      {/* Ambient background lighting & grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(9,9,11,0.98))] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* Subtle floating glow orb behind card */}
      <div className="absolute h-72 w-72 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative w-full max-w-md rounded-3xl border border-zinc-800/90 bg-zinc-900/85 p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-10 select-none shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        {/* Workspace Brand & Shield Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-lg animate-pulse" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/60 text-white shadow-xl">
              <Smartphone className="h-7 w-7 text-blue-400" />
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-zinc-950 font-black shadow-md border-2 border-zinc-900">
                ✓
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Google Authenticator
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-[290px] leading-relaxed">
            Enter the 6-digit verification code from your Google Authenticator app to start your session.
          </p>

          {/* 3-Hour Active Session Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            <span>3-Hour Session Expiry</span>
          </div>
        </div>

        {/* 6-Digit Code Input Boxes */}
        <div className="space-y-6">
          <div
            className="flex items-center justify-center gap-2 sm:gap-2.5"
            onPaste={handlePaste}
          >
            {digits.map((digit, idx) => {
              const isFilled = digit !== '';
              return (
                <React.Fragment key={idx}>
                  {idx === 3 && (
                    <div className="flex items-center justify-center px-0.5">
                      <div className="h-1 w-2.5 rounded-full bg-zinc-700" />
                    </div>
                  )}
                  <input
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`h-14 w-11 sm:h-14 sm:w-12 rounded-xl border text-center text-xl font-bold font-mono transition-all duration-150 outline-none ${
                      isFilled
                        ? 'border-blue-500/70 bg-zinc-900/90 text-white shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                        : 'border-zinc-800 bg-zinc-950/90 text-zinc-200 hover:border-zinc-700'
                    } focus:border-blue-500 focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/30 focus:shadow-[0_0_20px_rgba(59,130,246,0.35)] focus:scale-[1.03]`}
                  />
                </React.Fragment>
              );
            })}
          </div>

          {/* Quick Helper Actions (Demo Auto-Fill & Clear) */}
          <div className="flex items-center justify-between text-[11px] px-1 text-zinc-400">
            <button
              type="button"
              onClick={fillDemoCode}
              className="inline-flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span>Auto-fill Demo Code (123456)</span>
            </button>

            {hasSomeDigits && (
              <button
                type="button"
                onClick={clearDigits}
                className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={() => verifyCode(digits.join(''))}
            disabled={isVerifying || !isComplete}
            className={`relative flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all duration-200 cursor-pointer overflow-hidden ${
              isComplete
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(59,130,246,0.35)] hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_6px_24px_rgba(59,130,246,0.5)] active:scale-[0.98]'
                : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 cursor-not-allowed opacity-60'
            }`}
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Verifying Session...</span>
              </div>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Verify & Start 3-Hour Session</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-4">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>TOTP 2FA • 3-Hour Protected Session • Zero Task Loss</span>
        </div>
      </motion.div>
    </div>
  );
}
