'use client';

import React from 'react';
import { Doubt } from '@/data/mockData';
import { DoubtCard } from './DoubtCard';
import { MessageSquareDashed } from 'lucide-react';

interface DiscussionFeedProps {
  doubts: Doubt[];
  loading?: boolean;
  onAddReply: (doubtId: string, replyText: string, author?: string) => Promise<boolean | void>;
}

export function DiscussionFeed({ doubts, loading, onAddReply }: DiscussionFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200" />
                <div className="w-28 h-3.5 bg-slate-200 rounded" />
              </div>
              <div className="w-16 h-3 bg-slate-200 rounded" />
            </div>
            <div className="w-3/4 h-4 bg-slate-200 rounded" />
            <div className="w-1/2 h-4 bg-slate-200 rounded" />
            <div className="pt-2 border-t border-slate-100 flex justify-between">
              <div className="w-20 h-3 bg-slate-200 rounded" />
              <div className="w-12 h-3 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (doubts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center mx-auto">
          <MessageSquareDashed className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-[#0B1F3A]">No doubts yet in this class.</h4>
        <p className="text-xs text-[#667085] max-w-sm mx-auto">
          Be the first student to ask a question. Questions and replies are saved permanently and update in real time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {doubts.map((doubt) => (
        <DoubtCard
          key={doubt.id}
          doubt={doubt}
          onAddReply={onAddReply}
        />
      ))}
    </div>
  );
}
