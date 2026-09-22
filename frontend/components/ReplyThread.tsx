'use client';

import React, { useState } from 'react';
import { Reply } from '@/data/mockData';
import { Send, User, Loader2 } from 'lucide-react';

interface ReplyThreadProps {
  doubtId: string;
  replies: Reply[];
  onAddReply: (doubtId: string, replyText: string) => Promise<boolean | void>;
}

export function ReplyThread({ doubtId, replies, onAddReply }: ReplyThreadProps) {
  const [replyInput, setReplyInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = replyInput.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await onAddReply(doubtId, trimmed);
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
          {replies.map((reply) => (
            <div key={reply.id} className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-[#667085]">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                    <User className="w-2.5 h-2.5 text-slate-600" />
                  </div>
                  <span>{reply.author}</span>
                </div>
                <span>{reply.createdAt}</span>
              </div>
              <p className="text-slate-800 font-normal leading-relaxed pl-5">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Inline Reply Input */}
      <form onSubmit={handleSubmit} className="space-y-1.5 pt-1">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={replyInput}
            disabled={isSubmitting}
            onChange={(e) => {
              setReplyInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Write a helpful reply..."
            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1769AA] focus:border-[#1769AA] text-slate-800 placeholder:text-slate-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!replyInput.trim() || isSubmitting}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#1769AA] hover:bg-[#123B6D] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
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
