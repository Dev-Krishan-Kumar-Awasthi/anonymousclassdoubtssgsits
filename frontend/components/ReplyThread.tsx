'use client';

import React, { useState } from 'react';
import { Reply } from '@/data/mockData';
import { Send, User, Loader2 } from 'lucide-react';

interface ReplyThreadProps {
  doubtId: string;
  replies: Reply[];
  onAddReply: (doubtId: string, replyText: string, author?: string) => Promise<boolean | void>;
}

export function ReplyThread({ doubtId, replies, onAddReply }: ReplyThreadProps) {
  const [replyInput, setReplyInput] = useState('');
  const [authorRole, setAuthorRole] = useState<'student' | 'teacher'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = replyInput.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const authorName = authorRole === 'teacher' ? 'Instructor (US)' : 'Anonymous Student';
      await onAddReply(doubtId, trimmed, authorName);
      setReplyInput('');
    } catch (err: any) {
      setError(err?.message || 'Failed to post reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-3">
      {/* Existing replies */}
      {replies.length > 0 && (
        <div className="space-y-2.5 pl-3 border-l-2 border-[#1769AA]/25">
          {replies.map((reply) => {
            const isFaculty = reply.author.includes('Instructor') || reply.author.includes('Teacher') || reply.author.includes('Faculty');
            return (
              <div
                key={reply.id}
                className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  isFaculty
                    ? 'bg-emerald-50/90 border-emerald-300 shadow-sm'
                    : 'bg-slate-50/80 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold">
                    {isFaculty ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">
                        👨‍🏫 {reply.author} (Faculty)
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                          <User className="w-2.5 h-2.5 text-slate-600" />
                        </div>
                        <span>{reply.author}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-slate-400 font-medium">{reply.createdAt}</span>
                </div>
                <p className={`font-normal leading-relaxed ${isFaculty ? 'text-emerald-950 font-medium' : 'text-slate-800'}`}>
                  {reply.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Inline Reply Input with Role Selector */}
      <form onSubmit={handleSubmit} className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[11px] px-0.5">
          <span className="text-slate-500 font-medium">Post answer as:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setAuthorRole('student')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                authorRole === 'student'
                  ? 'bg-white text-[#1769AA] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🧑‍🎓 Anonymous Student
            </button>
            <button
              type="button"
              onClick={() => setAuthorRole('teacher')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                authorRole === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              👨‍🏫 Instructor (US)
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={replyInput}
            disabled={isSubmitting}
            onChange={(e) => {
              setReplyInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder={authorRole === 'teacher' ? 'Answer as Faculty (US) to clarify this concept...' : 'Write an anonymous helpful peer reply...'}
            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1769AA] focus:border-[#1769AA] text-slate-800 placeholder:text-slate-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!replyInput.trim() || isSubmitting}
            className={`px-3.5 py-2 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5 ${
              authorRole === 'teacher' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#1769AA] hover:bg-[#123B6D]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <span>Reply</span>
                <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-[11px] text-rose-600 font-medium">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
