'use client';

import React, { useState } from 'react';
import { Send, Lock, Loader2, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface DoubtComposerProps {
  onAddDoubt: (doubtText: string) => Promise<boolean | void>;
  isClassActive?: boolean;
  scheduleInfo?: string;
  onEnableTestMode?: () => void;
  isSimulating?: boolean;
}

export function DoubtComposer({
  onAddDoubt,
  isClassActive = true,
  scheduleInfo = 'Scheduled Class Hours',
  onEnableTestMode,
  isSimulating = false,
}: DoubtComposerProps) {
  const [doubtText, setDoubtText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent, forceSubmit: boolean = false) => {
    e.preventDefault();
    const trimmed = doubtText.trim();
    if (!trimmed || isSubmitting) return;

    // Strict validation: Class must be active unless test mode or forced pre-lecture
    if (!isClassActive && !forceSubmit && !isSimulating) {
      setError(
        `Class is not active right now (${scheduleInfo}). Click "Send Anyway" or "Simulate Class Live" to test realtime doubts immediately.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAddDoubt(trimmed);
      setDoubtText('');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit doubt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 ${
        isClassActive
          ? 'border-slate-200/90 shadow-sm'
          : 'border-amber-200/90 bg-amber-50/20 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A]">
          <Lock className="w-3.5 h-3.5 text-[#1769AA]" />
          <span>Ask Anonymously</span>
          {isClassActive ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Class Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <AlertTriangle className="w-3 h-3 text-amber-700" />
              Class is Not Active
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#667085]">
          Your identity appears as &ldquo;Anonymous Student&rdquo;
        </span>
      </div>

      {/* Inactive Class Warning Notice */}
      {!isClassActive && (
        <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Class is Not Active ({scheduleInfo})</span>
              <p className="text-[11px] text-amber-800">
                Live doubts are active during lecture hours. You can ask a <strong>Pre-Lecture Question</strong> now, or simulate live mode to test real-time instant sync.
              </p>
            </div>
          </div>
          {onEnableTestMode && (
            <button
              type="button"
              onClick={onEnableTestMode}
              className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Simulate Class Live</span>
            </button>
          )}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-3">
        <textarea
          rows={3}
          value={doubtText}
          disabled={isSubmitting}
          onChange={(e) => {
            setDoubtText(e.target.value);
            if (error) setError(null);
          }}
          placeholder={
            isClassActive
              ? "Type your doubt here (e.g. What is method overriding in Java?)..."
              : `Class is offline (${scheduleInfo}). Type your doubt here to test realtime sync or ask pre-lecture...`
          }
          className={`w-full p-3.5 text-xs sm:text-sm rounded-xl border focus:outline-none transition-all resize-none ${
            isClassActive
              ? 'bg-slate-50/70 border-slate-300 focus:ring-2 focus:ring-[#1769AA]/40 focus:border-[#1769AA] text-slate-800 placeholder:text-slate-400'
              : 'bg-white border-amber-200/90 text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30'
          }`}
        />

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex flex-wrap items-center justify-between gap-2 animate-shake">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, true)}
              className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-bold rounded-lg transition-all"
            >
              Send Question Anyway
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 italic hidden sm:block">
            {isClassActive
              ? 'Questions are visible to classmates and teacher in real-time.'
              : `Lecture Slot: ${scheduleInfo}`}
          </p>

          <div className="ml-auto flex items-center gap-2">
            {!isClassActive && (
              <button
                type="button"
                disabled={!doubtText.trim() || isSubmitting}
                onClick={(e) => handleSubmit(e, true)}
                className="px-4 py-2.5 text-xs font-bold rounded-xl border border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Ask Pre-Lecture</span>
              </button>
            )}

            <button
              type="submit"
              disabled={!doubtText.trim() || isSubmitting}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 ${
                isClassActive
                  ? 'bg-[#1769AA] hover:bg-[#123B6D] text-white hover:shadow'
                  : 'bg-amber-600 hover:bg-amber-700 text-white hover:shadow'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>{isClassActive ? 'Send Question' : 'Send (Live Sync)'}</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
