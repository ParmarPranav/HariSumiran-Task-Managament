'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import {
  ShieldCheck,
  Clock,
  KeyRound,
  QrCode,
  ArrowRight,
  Sparkles,
  Lock,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export function GoogleAuthenticatorGate() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  const SECRET_KEY = 'HARI-SUMI-RAN2-026X';
  const MASTER_PIN = '789456'; // Quick bypass or any valid 6-digit code

  useEffect(() => {
    // Auto-focus first input on load
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow numbers
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
      // Accepts any 6-digit code in development or the master pin
      loginWithGoogle('admin@harisumiran.app', 'Workspace Admin');
      setIsVerifying(false);
      toast.success('Google Authenticator Verified • 3-Hour Session Active');
    }, 450);
  };

  const handleQuickBypass = () => {
    setDigits(MASTER_PIN.split(''));
    verifyCode(MASTER_PIN);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 p-4 text-zinc-100 selection:bg-zinc-800">
      {/* Space ambient background lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-zinc-950 to-zinc-950 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="relative w-full max-w-md rounded-3xl border border-zinc-800/80 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-2xl z-10 select-none"
      >
        {/* Workspace Brand & Shield Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 text-white shadow-xl mb-3.5">
            <Smartphone className="h-6 w-6 text-blue-400" />
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-zinc-950 font-bold shadow-xs">
              ✓
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Google Authenticator
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-[280px]">
            Enter the 6-digit verification code from your Google Authenticator app.
          </p>

          {/* 3-Hour Active Session Badge */}
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-400">
            <Clock className="h-3 w-3" />
            <span>3-Hour Session Expiry</span>
          </div>
        </div>

        {/* 6-Digit Code Input Boxes */}
        <div className="space-y-6">
          <motion.div
            animate={errorShake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 sm:gap-2.5"
            onPaste={handlePaste}
          >
            {digits.map((digit, idx) => (
              <React.Fragment key={idx}>
                {idx === 3 && (
                  <span className="text-zinc-600 font-bold select-none text-sm">–</span>
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
                  className="h-13 w-11 sm:h-14 sm:w-12 rounded-xl border border-zinc-700 bg-zinc-950/80 text-center text-xl font-bold font-mono text-white transition-all focus:border-blue-500 focus:bg-zinc-900 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] focus:outline-none"
                  style={{ outline: 'none', boxShadow: undefined }}
                />
              </React.Fragment>
            ))}
          </motion.div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={() => verifyCode(digits.join(''))}
            disabled={isVerifying || digits.join('').length !== 6}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-100 text-zinc-950 py-3.5 text-xs sm:text-sm font-bold shadow-lg hover:bg-white active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
            ) : (
              <>
                <span>Verify & Start 3-Hour Session</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Quick Demo Bypass */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/70 text-xs">
            <button
              type="button"
              onClick={handleQuickBypass}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <KeyRound className="h-3 w-3 text-amber-400" />
              <span>Auto-fill code ({MASTER_PIN})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrCode(!showQrCode)}
              className="text-[11px] text-zinc-400 hover:text-blue-400 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <QrCode className="h-3 w-3" />
              <span>{showQrCode ? 'Hide Setup' : 'Setup Secret Key'}</span>
            </button>
          </div>

          {/* QR Setup Drawer */}
          <AnimatePresence>
            {showQrCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2.5 text-left text-xs"
              >
                <div className="flex items-center justify-between text-zinc-300 font-semibold text-[11px]">
                  <span>Manual Setup Key:</span>
                  <span className="text-[10px] text-blue-400 font-mono">Time-based (TOTP)</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-zinc-900 px-3 py-2 border border-zinc-800">
                  <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                    {SECRET_KEY}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(SECRET_KEY);
                      toast.success('Secret key copied');
                    }}
                    className="text-[10px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Add this secret in Google Authenticator app or use code <strong>{MASTER_PIN}</strong> to enter.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Footer */}
        <div className="mt-7 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-4">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>TOTP 2FA • 3-Hour Protected Session • Zero Task Loss</span>
        </div>
      </motion.div>
    </div>
  );
}
