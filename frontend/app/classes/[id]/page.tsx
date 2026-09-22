'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { OOP_CLASSES, Doubt, Reply, OOPClass } from '@/data/mockData';
import {
  fetchDoubtsForClass,
  createDoubt,
  createReply,
  subscribeToClass,
} from '@/lib/supabaseService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { DiscussionFeed } from '@/components/DiscussionFeed';
import { DoubtComposer } from '@/components/DoubtComposer';
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  FlaskConical,
  BookOpen,
  Radio,
  Lock,
  Database,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  const currentClass: OOPClass | undefined = OOP_CLASSES.find((c) => c.id === classId);

  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load doubts on mount
  const loadDoubts = useCallback(async () => {
    if (!classId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDoubtsForClass(classId);
      setDoubts(data);
    } catch (err: any) {
      console.error('Error loading doubts:', err);
      setError('Unable to load discussion. Please refresh to try again.');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadDoubts();
  }, [loadDoubts]);

  // Setup Supabase Realtime Subscription with duplicate protection
  useEffect(() => {
    if (!classId) return;

    const unsubscribe = subscribeToClass(
      classId,
      (newDoubt: Doubt) => {
        setDoubts((prev) => {
          // Prevent duplicates if already added locally
          if (prev.some((d) => d.id === newDoubt.id)) {
            return prev;
          }
          return [newDoubt, ...prev];
        });
      },
      (newReply: Reply) => {
        setDoubts((prev) =>
          prev.map((doubt) => {
            if (doubt.id === newReply.doubtId) {
              const existingReplies = doubt.replies || [];
              if (existingReplies.some((r) => r.id === newReply.id)) {
                return doubt;
              }
              return {
                ...doubt,
                replies: [...existingReplies, newReply],
              };
            }
            return doubt;
          })
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [classId]);

  // Handler for adding doubt
  const handleAddDoubt = async (doubtText: string) => {
    const savedDoubt = await createDoubt(classId, doubtText);
    setDoubts((prev) => {
      if (prev.some((d) => d.id === savedDoubt.id)) {
        return prev;
      }
      return [savedDoubt, ...prev];
    });
  };

  // Handler for adding reply
  const handleAddReply = async (doubtId: string, replyText: string) => {
    const savedReply = await createReply(doubtId, classId, replyText);
    setDoubts((prev) =>
      prev.map((doubt) => {
        if (doubt.id === doubtId) {
          const existingReplies = doubt.replies || [];
          if (existingReplies.some((r) => r.id === savedReply.id)) {
            return doubt;
          }
          return {
            ...doubt,
            replies: [...existingReplies, savedReply],
          };
        }
        return doubt;
      })
    );
  };

  if (!currentClass) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#0B1F3A]">Class Not Found</h2>
        <p className="text-xs text-[#667085]">
          The class ID you requested does not exist in the OOP timetable.
        </p>
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1769AA] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Classes</span>
        </Link>
      </div>
    );
  }

  const isLab = currentClass.type === 'Laboratory';
  const supabaseActive = isSupabaseConfigured();

  return (
    <div className="py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Top Back Navigation Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1769AA] hover:text-[#0B1F3A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Classes</span>
        </Link>

        {/* Persistence Indicator */}
        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
          <Database className="w-3 h-3 text-[#1769AA]" />
          <span>{supabaseActive ? 'Supabase Realtime Connected' : 'Persistent Storage Active'}</span>
        </div>
      </div>

      {/* Class Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                isLab ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-[#1769AA]'
              }`}
            >
              {isLab ? <FlaskConical className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
              {currentClass.code} • {currentClass.type}
            </span>
            <span className="text-xs font-bold text-slate-700">
              {currentClass.section}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Class Discussion Active</span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
            {currentClass.subject}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#667085] mt-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <Clock className="w-3.5 h-3.5 text-[#1769AA]" />
              {currentClass.day} • {currentClass.time}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Room: {currentClass.room}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Instructor: <strong className="text-[#0B1F3A]">{currentClass.teacher}</strong>
            </span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-[#1769AA]" />
          <span>All doubts and replies in this room appear as <strong>Anonymous Student</strong>.</span>
        </div>
      </div>

      {/* Ask Doubt Composer */}
      <div className="pt-1">
        <DoubtComposer onAddDoubt={handleAddDoubt} />
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadDoubts}
            className="flex items-center gap-1 font-bold text-rose-900 underline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Doubts and Discussion Feed */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2">
            <span>Class Questions</span>
            {!loading && (
              <span className="px-2 py-0.5 rounded-full bg-[#EAF3FB] text-[#1769AA] text-xs font-bold">
                {doubts.length}
              </span>
            )}
          </h2>
          <span className="text-[11px] text-[#667085]">
            {loading ? 'Fetching questions...' : 'Realtime feed active'}
          </span>
        </div>

        <DiscussionFeed
          doubts={doubts}
          loading={loading}
          onAddReply={handleAddReply}
        />
      </div>
    </div>
  );
}
