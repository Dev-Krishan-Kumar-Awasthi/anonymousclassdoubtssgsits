'use client';

import React, { useState } from 'react';
import { X, Send, Lock, Sparkles, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authStorage } from '@/lib/auth';

interface TeacherAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  doubt: {
    id: string;
    referenceNo: string;
    text: string;
    normalizedText?: string;
    category: string;
    subjectCode: string;
  } | null;
  onAnswerSubmitted: () => void;
}

export const TeacherAnswerModal: React.FC<TeacherAnswerModalProps> = ({
  isOpen,
  onClose,
  doubt,
  onAnswerSubmitted,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [isPublishedToClass, setIsPublishedToClass] = useState(true);
  const [isSavedAsFaq, setIsSavedAsFaq] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !doubt) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = authStorage.getToken();

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${apiUrl}/api/teacher/doubts/${doubt.id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answerText: answerText.trim(),
          isPublishedToClass,
          isSavedAsFaq,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to submit answer');
      }

      setAnswerText('');
      onAnswerSubmitted();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error submitting answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-200 shadow-institutional-lg w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
              {doubt.referenceNo}
            </span>
            <div>
              <h3 className="font-bold text-sm text-[#0B1F3A]">Answer Anonymous Student Question</h3>
              <p className="text-[11px] text-[#667085]">Subject: {doubt.subjectCode} • Category: {doubt.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleAnswerSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Question Box */}
          <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#1769AA]" /> Asked by Anonymous Student
              </span>
              <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                Identity Masked
              </span>
            </div>
            <p className="text-sm font-semibold text-[#0B1F3A] leading-relaxed">
              &ldquo;{doubt.text}&rdquo;
            </p>

            {/* AI / Semantic Clarification for Hinglish */}
            {doubt.normalizedText && (
              <div className="p-2.5 bg-[#EAF3FB]/70 border border-[#1769AA]/20 rounded text-xs space-y-1">
                <div className="font-bold text-[#1769AA] flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3 h-3" /> Topic Clarification:
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {doubt.normalizedText}
                </p>
              </div>
            )}
          </div>

          {/* Answer Textarea */}
          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              Faculty Answer
            </label>
            <textarea
              rows={5}
              required
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Provide a clear academic explanation or code snippet..."
              className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-transparent bg-white text-[#172033] resize-none"
            />
          </div>

          {/* Publishing Options */}
          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2.5 p-3 rounded-md bg-blue-50/50 border border-blue-100 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublishedToClass}
                onChange={(e) => setIsPublishedToClass(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#1769AA] focus:ring-[#1769AA]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#1769AA]" /> Publish as Common Class Doubt
                </span>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  Adds this explanation to the class-wide Common Doubts feed so all students benefit.
                  (Student author remains 100% anonymous).
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-md bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isSavedAsFaq}
                onChange={(e) => setIsSavedAsFaq(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#1769AA] focus:ring-[#1769AA]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#0B1F3A]">Save into Subject FAQ Knowledgebase</span>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  Retains this Q&A for exam preparation and mid-semester reviews.
                </p>
              </div>
            </label>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-[#667085] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Dispatches instantly via Socket.IO
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !answerText.trim()}
                className="px-5 py-2 bg-[#1769AA] hover:bg-[#123B6D] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Sending...' : 'Send Response'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
