import React, { useState, useEffect, useCallback } from 'react';
import { Shield, ShieldAlert, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AntiScreenshotGuardProps {
  children: React.ReactNode;
  title?: string;
  categoryLabel?: string;
  revealedByDefault?: boolean;
  blurOnWindowUnfocus?: boolean;
  autoHideDurationSeconds?: number;
}

export const AntiScreenshotGuard: React.FC<AntiScreenshotGuardProps> = ({
  children,
  title = 'Protected Contact & GPS Landmark',
  categoryLabel = 'Section 72 KDPA Protected',
  revealedByDefault = false,
  blurOnWindowUnfocus = true,
  autoHideDurationSeconds = 25,
}) => {
  const { currentUser } = useApp();
  const [isRevealed, setIsRevealed] = useState(revealedByDefault);
  const [secondsRemaining, setSecondsRemaining] = useState(autoHideDurationSeconds);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [screenshotDetected, setScreenshotDetected] = useState(false);
  const [screenshotAttemptCount, setScreenshotAttemptCount] = useState(0);

  // Forensic Watermark text uniquely bound to this user
  const viewerPhone = currentUser?.phone || '+254 700 000 000';
  const viewerName = currentUser?.name || 'Verified Seeker';
  const viewerIdMasked = currentUser?.national_id_masked || 'ID 3312****';
  const sessionStamp = new Date().toISOString().substring(0, 10);
  const watermarkText = `${viewerPhone} • ${viewerName} • ${viewerIdMasked} • KDPA ACT 2019 SEC. 72 • ${sessionStamp}`;

  // Keyboard screenshot interception
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // PrintScreen key or common screen capture shortcuts
    const isPrintScreen = e.key === 'PrintScreen' || e.code === 'PrintScreen';
    const isMacScreenshot = (e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5' || e.code === 'Digit3' || e.code === 'Digit4');
    const isWindowsSnipping = (e.key === 's' || e.key === 'S') && (e.metaKey || e.altKey);
    const isCtrlP = (e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P');

    if (isPrintScreen || isMacScreenshot || isWindowsSnipping || isCtrlP) {
      if (isCtrlP) e.preventDefault();
      setScreenshotDetected(true);
      setScreenshotAttemptCount((c) => c + 1);
      setIsRevealed(false); // Instantly mask data upon capture attempt
    }
  }, []);

  // Listen for window blur / focus
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => {
      if (blurOnWindowUnfocus) {
        setIsWindowFocused(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && blurOnWindowUnfocus) {
        setIsWindowFocused(false);
      } else {
        setIsWindowFocused(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyDown);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyDown);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleKeyDown, blurOnWindowUnfocus]);

  // Timed auto-hide countdown when revealed
  useEffect(() => {
    if (!isRevealed) {
      setSecondsRemaining(autoHideDurationSeconds);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsRevealed(false);
          return autoHideDurationSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRevealed, autoHideDurationSeconds]);

  const handleRevealClick = () => {
    setIsRevealed(true);
    setSecondsRemaining(autoHideDurationSeconds);
  };

  const handleHideClick = () => {
    setIsRevealed(false);
  };

  return (
    <div
      className="relative rounded-2xl border border-[#1B4332]/25 overflow-hidden select-none bg-white transition-all shadow-xs"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {/* Top Security Banner */}
      <div className="bg-[#1B4332] text-white px-3.5 py-2 flex items-center justify-between text-xs border-b border-[#1B4332]/20">
        <div className="flex items-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-[#E8A33D]" />
          <span className="font-bold tracking-tight text-[11px] text-[#FBF3E7]">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#E8A33D] bg-black/30 px-2 py-0.5 rounded-md">
            {categoryLabel}
          </span>
          {isRevealed && (
            <div className="flex items-center space-x-1 text-[10px] font-mono text-[#E8A33D]">
              <span>{secondsRemaining}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Screenshot Intercept Alert Modal/Shield */}
      {screenshotDetected && (
        <div className="absolute inset-0 z-50 bg-[#2B2118]/95 backdrop-blur-md p-5 flex flex-col items-center justify-center text-center text-white animate-in fade-in zoom-in-95 duration-150">
          <div className="w-12 h-12 rounded-2xl bg-[#C1440E] text-white flex items-center justify-center mb-3 shadow-lg ring-4 ring-[#C1440E]/30 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h4 className="serif font-extrabold text-base text-[#FBF3E7]">
            Screenshot Attempt Intercepted
          </h4>
          <p className="text-[11px] text-white/80 max-w-sm mt-1.5 leading-relaxed">
            Under <b>Section 72 of the Kenya Data Protection Act (2019)</b>, unauthorized capture or syndication of private landlord contact information is strictly prohibited.
          </p>
          <div className="mt-3 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 font-mono text-[10px] text-[#E8A33D]">
            Watermarked to: {viewerPhone} ({viewerName})
          </div>
          <button
            onClick={() => setScreenshotDetected(false)}
            className="mt-4 px-5 py-2 bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            I Understand & Comply
          </button>
        </div>
      )}

      {/* Inactive Window / Snipping Tool Blur Shield */}
      {!isWindowFocused && blurOnWindowUnfocus && !screenshotDetected && (
        <div className="absolute inset-0 z-40 bg-[#FBF3E7]/90 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center text-[#2B2118]">
          <Lock className="w-6 h-6 text-[#C1440E] mb-1.5 animate-pulse" />
          <p className="font-bold text-xs text-[#2B2118]">
            Content Protected While Window Unfocused
          </p>
          <span className="text-[10px] text-[#2B2118]/70 mt-0.5">
            Click back onto this window to reveal verified landlord info
          </span>
        </div>
      )}

      {/* Main Container with Forensic Watermark Background */}
      <div className="relative p-4">
        {/* Repeating diagonal forensic watermark overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] overflow-hidden select-none z-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -35deg,
              transparent,
              transparent 45px,
              rgba(27, 67, 50, 0.4) 45px,
              rgba(27, 67, 50, 0.4) 90px
            )`,
          }}
        >
          <div className="w-[150%] h-[150%] -translate-x-12 -translate-y-12 flex flex-wrap gap-8 text-[9px] font-mono text-[#1B4332] rotate-[-25deg] uppercase font-black">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="whitespace-nowrap">
                {watermarkText}
              </span>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {isRevealed ? (
          <div className="relative z-20 space-y-3">
            {children}

            {/* Countdown progress bar */}
            <div className="pt-2 border-t border-[#2B2118]/8 flex items-center justify-between text-[10px] text-[#2B2118]/70">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Forensically Watermarked ({secondsRemaining}s window)</span>
              </div>
              <button
                onClick={handleHideClick}
                className="flex items-center space-x-1 font-bold text-[#C1440E] hover:underline"
              >
                <EyeOff className="w-3 h-3" />
                <span>Conceal Now</span>
              </button>
            </div>

            {/* Visual timer line */}
            <div className="w-full bg-[#2B2118]/10 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#1B4332] h-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${(secondsRemaining / autoHideDurationSeconds) * 100}%`,
                }}
              />
            </div>
          </div>
        ) : (
          /* Masked Placeholder View with Reveal Button */
          <div className="relative z-20 py-3 text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-xs font-mono font-bold text-[#2B2118]/75 bg-[#FBF3E7] py-2 px-3 rounded-xl border border-[#2B2118]/10 max-w-sm mx-auto">
              <Lock className="w-3.5 h-3.5 text-[#C1440E]" />
              <span>Contact & Exact Pin: +254 7•• ••• ••• (Protected)</span>
            </div>

            <p className="text-[11px] text-[#2B2118]/70 max-w-xs mx-auto leading-relaxed">
              Protected against automated scraping and middleman broker syndication.
            </p>

            <button
              type="button"
              onClick={handleRevealClick}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-extrabold rounded-xl shadow-sm transition-all active:scale-95"
            >
              <Eye className="w-3.5 h-3.5 text-[#E8A33D]" />
              <span>Tap to Unveil Details ({autoHideDurationSeconds}s)</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Compliance & Watermark Footer */}
      <div className="bg-[#FBF3E7] px-3.5 py-1.5 border-t border-[#2B2118]/10 flex items-center justify-between text-[9px] text-[#2B2118]/65 font-mono">
        <span>ODPC Reg: ODPC/PR/2026/0891</span>
        <span className="truncate max-w-[190px]">Viewer: {viewerPhone}</span>
      </div>
    </div>
  );
};
