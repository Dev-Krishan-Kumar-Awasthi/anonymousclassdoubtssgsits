'use client';

import React, { useState } from 'react';
import {
  X,
  Send,
  Lock,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { authStorage } from '@/lib/auth';

interface AskDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectCode: string;
  subjectName: string;
  roomNumber: string;
  teacherCodes: string[];
  classSessionId?: string;
  onDoubtSubmitted?: (newDoubtRef: string) => void;
}

const CATEGORIES = [
  { id: 'CONCEPT', label: 'Concept' },
  { id: 'PROGRAMMING', label: 'Programming' },
  { id: 'ASSIGNMENT', label: 'Assignment' },
  { id: 'EXAM_MST', label: 'Exam / MST' },
  { id: 'LECTURE_PACE', label: 'Lecture Pace' },
  { id: 'OTHER', label: 'Other' },
];

export const AskDoubtModal: React.FC<AskDoubtModalProps> = ({
  isOpen,
  onClose,
  subjectCode,
  subjectName,
  roomNumber,
  teacherCodes,
  classSessionId,
  onDoubtSubmitted,
}) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('CONCEPT');
  const [isWholeClass, setIsWholeClass] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = authStorage.getToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${apiUrl}/api/doubts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subjectCode: subjectCode || 'OOP',
          text: text.trim(),
          category,
          isWholeClass,
          classSessionId,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to submit doubt');
      }

      setSubmittedRef(json.data.referenceNo);
      if (onDoubtSubmitted) {
        onDoubtSubmitted(json.data.referenceNo);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setText('');
    setSubmittedRef(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-200 shadow-institutional-lg w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0B1F3A]">Ask Anonymous Doubt</h3>
              <p className="text-[11px] text-[#667085]">Anonymous to your teacher</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Active Class Metadata Pill */}
          <div className="p-3 bg-[#EAF3FB]/60 border border-[#1769AA]/20 rounded-md flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="font-semibold text-[#0B1F3A]">
              {subjectName} <span className="text-[#1769AA]">({subjectCode})</span>
            </div>
            <div className="flex items-center gap-3 text-[#667085]">
              <span>Room: <strong className="text-slate-800">{roomNumber}</strong></span>
              <span>•</span>
              <span>Faculty: <strong className="text-slate-800">{teacherCodes.join(', ')}</strong></span>
            </div>
          </div>

          {/* Success State */}
          {submittedRef ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-[#0B1F3A]">Your Question Was Sent Anonymously</h4>
                <p className="text-xs text-[#667085]">
                  Your teacher has received your doubt on their live console without your identity.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-[#0B1F3A]">
                Reference ID: {submittedRef}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-5 py-2 bg-[#1769AA] text-white text-xs font-semibold rounded-md hover:bg-[#123B6D] transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selector Chips */}
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded border transition-all ${
                        category === c.id
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-[#172033]">
                    What is your doubt?
                  </label>
                  <span className="text-[11px] text-[#667085] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#1769AA]" /> English / Hindi / Hinglish supported
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. Sir mujhe method overriding aur method overloading me main difference samajh nahi aa raha..."
                  className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-transparent resize-none bg-white text-[#172033]"
                />
                <div className="flex justify-between items-center mt-1 text-[11px] text-[#667085]">
                  <span>Minimum 4 characters</span>
                  <span>{text.length}/600</span>
                </div>
              </div>

              {/* Whole Class Toggle */}
              <div className="flex items-start gap-2.5 p-3 rounded-md bg-slate-50 border border-slate-200">
                <input
                  id="wholeClassToggle"
                  type="checkbox"
                  checked={isWholeClass}
                  onChange={(e) => setIsWholeClass(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#1769AA] focus:ring-[#1769AA]"
                />
                <label htmlFor="wholeClassToggle" className="text-xs text-slate-700 cursor-pointer">
                  <span className="font-semibold text-[#0B1F3A]">
                    Consider for the whole class
                  </span>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Allows faculty to answer publicly under Common Class Doubts so your classmates can also learn.
                  </p>
                </label>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Privacy Reassurance Banner */}
              <div className="flex items-start gap-2 p-2.5 rounded bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <Info className="w-3.5 h-3.5 flex-shrink-0 text-[#D98C00] mt-0.5" />
                <div>
                  <strong>Privacy Guarantee:</strong> Your name, roll number, and email will NOT be shown to your teacher.
                  Account authentication is used solely for anti-spam moderation.
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || text.trim().length < 4}
                  className="px-5 py-2 bg-[#1769AA] hover:bg-[#123B6D] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Sending Anonymously...' : 'Submit Anonymously'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
