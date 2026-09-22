'use client';

import React, { useState } from 'react';
import { Send, Lock, Loader2 } from 'lucide-react';

interface DoubtComposerProps {
  onAddDoubt: (doubtText: string) => Promise<boolean | void>;
}

export function DoubtComposer({ onAddDoubt }: DoubtComposerProps) {
  const [doubtText, setDoubtText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = doubtText.trim();
    if (!trimmed || isSubmitting) return;

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
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A]">
          <Lock className="w-3.5 h-3.5 text-[#1769AA]" />
          <span>Ask Anonymously</span>
        </div>
        <span className="text-[11px] text-[#667085]">
          Your identity appears as &ldquo;Anonymous Student&rdquo;
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          rows={3}
          value={doubtText}
          disabled={isSubmitting}
          onChange={(e) => {
            setDoubtText(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Type your doubt here (e.g. What is method overriding in Java?)..."
          className="w-full p-3 text-xs sm:text-sm bg-slate-50/60 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769AA]/40 focus:border-[#1769AA] text-slate-800 placeholder:text-slate-400 resize-none transition-all disabled:opacity-60"
        />

        {error && (
          <p className="text-xs text-rose-600 font-medium">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 italic hidden sm:block">
            Questions are saved permanently and visible to class members.
          </p>

          <button
            type="submit"
            disabled={!doubtText.trim() || isSubmitting}
            className="ml-auto px-5 py-2.5 text-xs font-bold text-white bg-[#1769AA] hover:bg-[#123B6D] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send Question</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
