'use client';

import React, { useState } from 'react';
import { Send, Lock, Loader2, CheckCircle2, MessageSquarePlus, Sparkles } from 'lucide-react';

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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = doubtText.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMsg(null);
      await onAddDoubt(trimmed);
      setDoubtText('');
      setSuccessMsg('Your doubt has been posted live to this class!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit doubt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A]">
          <Lock className="w-3.5 h-3.5 text-[#1769AA]" />
          <span>Ask Anonymously</span>
          {isClassActive ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Class Live Now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-[#1769AA] border border-sky-200">
              <MessageSquarePlus className="w-3 h-3 text-[#1769AA]" />
              Doubts Open 24/7 ({scheduleInfo})
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#667085]">
          Your identity appears as &ldquo;Anonymous Student&rdquo;
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={doubtText}
            disabled={isSubmitting}
            onChange={(e) => {
              setDoubtText(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Type your question or doubt anonymously (e.g. Can an interface extend another interface in Java?)..."
            className="w-full p-3.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1769AA]/30 focus:border-[#1769AA] text-slate-900 placeholder:text-slate-400 resize-none transition-all shadow-2xs"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-slate-500 italic hidden sm:block">
            {isClassActive
              ? 'Class is live: questions stream directly to instructor and classmates in real-time.'
              : `All questions in this class are visible to students and faculty immediately.`}
          </p>

          <button
            type="submit"
            disabled={!doubtText.trim() || isSubmitting}
            className="ml-auto px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#1769AA] to-[#0B1F3A] hover:opacity-95 shadow-md shadow-[#1769AA]/20 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Posting Live...</span>
              </>
            ) : (
              <>
                <span>Post Doubt Anonymously</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
