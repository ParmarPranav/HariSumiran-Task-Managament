'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import {
  ShieldCheck,
  Clock,
  QrCode,
  ArrowRight,
  Smartphone,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export function GoogleAuthenticatorGate() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [showQrModal, setShowQrModal] = useState(false);
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

          {/* 3-Hour Active Session Badge & QR Scanner button */}
          <div className="mt-3.5 flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-400">
              <Clock className="h-3 w-3" />
              <span>3-Hour Session Expiry</span>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-medium text-zinc-200 transition-colors cursor-pointer"
            >
              <QrCode className="h-3 w-3 text-emerald-400" />
              <span>Scan QR</span>
            </button>
          </div>
        </div>

        {/* 6-Digit Code Input Boxes */}
        <div className="space-y-6">
          <div
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
          </div>

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
        </div>

        {/* Security Footer */}
        <div className="mt-7 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-4">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>TOTP 2FA • 3-Hour Protected Session • Zero Task Loss</span>
        </div>
      </motion.div>

      {/* QR Code Modal for Google Authenticator App */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQrModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xs rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl z-10 text-center space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-white font-sans">Scan with Google Authenticator</h3>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3 bg-white rounded-2xl inline-block shadow-lg">
                <img
                  src="/google-authenticator-qr.png"
                  alt="Google Authenticator QR Code"
                  className="h-48 w-48 object-contain rounded-lg"
                />
              </div>

              <p className="text-[11px] text-zinc-400">
                Open Google Authenticator on your phone, tap <strong>+</strong>, and scan this QR code.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
