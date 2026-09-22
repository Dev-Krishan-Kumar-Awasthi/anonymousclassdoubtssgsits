'use client';

import React, { useState } from 'react';
import { Doubt } from '@/data/mockData';
import { ReplyThread } from './ReplyThread';
import { MessageSquare, User, ChevronDown, ChevronUp } from 'lucide-react';

interface DoubtCardProps {
  doubt: Doubt;
  onAddReply: (doubtId: string, replyText: string, author?: string) => Promise<boolean | void>;
}

export function DoubtCard({ doubt, onAddReply }: DoubtCardProps) {
  const [expanded, setExpanded] = useState(false);

  const replyCount = doubt.replies ? doubt.replies.length : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5 hover:border-[#1769AA]/40 transition-all">
      {/* Header: Anonymous Student + Timestamp */}
      <div className="flex items-center justify-between text-xs text-[#667085] mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EAF3FB] border border-[#1769AA]/20 flex items-center justify-center text-[#1769AA]">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-[#0B1F3A]">{doubt.author}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">{doubt.createdAt}</span>
      </div>

      {/* Question Content */}
      <p className="text-sm font-semibold text-[#0B1F3A] leading-relaxed mb-3">
        {doubt.content}
      </p>

      {/* Actions: Reply Count & Reply Button */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-[#1769AA] hover:text-[#0B1F3A] flex items-center gap-1.5 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-[#1769AA] hover:bg-[#EAF3FB] rounded-md transition-colors"
        >
          Reply
        </button>
      </div>

      {/* Expandable Reply Thread */}
      {expanded && (
        <ReplyThread
          doubtId={doubt.id}
          replies={doubt.replies || []}
          onAddReply={onAddReply}
        />
      )}
    </div>
  );
}
