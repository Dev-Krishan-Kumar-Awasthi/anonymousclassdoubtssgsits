'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Doubt, Reply, OOPClass, OOP_CLASSES } from '@/data/mockData';
import {
  fetchAllDoubts,
  subscribeToAllDoubts,
  createReply,
  createDoubt,
} from '@/lib/supabaseService';
import { DoubtCard } from '@/components/DoubtCard';
import {
  MessageSquare,
  Search,
  Filter,
  GraduationCap,
  UserCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  Radio,
  ArrowRight,
  BookOpen,
  User,
  ShieldAlert,
  Send,
  Lock,
} from 'lucide-react';

interface TodayDoubtsFeedProps {
  initialClassId?: string;
  showHeader?: boolean;
}

export function TodayDoubtsFeed({ initialClassId, showHeader = true }: TodayDoubtsFeedProps) {
  const [doubts, setDoubts] = useState<(Doubt & { classInfo?: OOPClass })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick doubt submission state
  const [newDoubtText, setNewDoubtText] = useState('');
  const [postClassId, setPostClassId] = useState<string>('oop-wednesday-4');
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  // Load all doubts across all classes
  const loadAll = async () => {
    try {
      setIsRefreshing(true);
      const data = await fetchAllDoubts();
      setDoubts(data);
    } catch (err) {
      console.error('Error fetching all doubts:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // 3.5-second automatic background polling fallback
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const fresh = await fetchAllDoubts();
        setDoubts((prev) => {
          if (fresh.length !== prev.length || fresh[0]?.id !== prev[0]?.id) {
            return fresh;
          }
          return prev;
        });
      } catch {}
    }, 3500);

    return () => clearInterval(pollInterval);
  }, []);

  // Real-time subscription across all classes
  useEffect(() => {
    const unsubscribe = subscribeToAllDoubts(
      (newDoubt) => {
        setDoubts((prev) => {
          if (prev.some((d) => d.id === newDoubt.id)) return prev;
          return [newDoubt, ...prev];
        });
      },
      (newReply) => {
        setDoubts((prev) =>
          prev.map((doubt) => {
            if (doubt.id === newReply.doubtId) {
              const existingReplies = doubt.replies || [];
              if (existingReplies.some((r) => r.id === newReply.id)) return doubt;
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
  }, []);

  const handleAddReply = async (doubtId: string, replyText: string, author?: string) => {
    const targetDoubt = doubts.find((d) => d.id === doubtId);
    if (!targetDoubt) return;

    const authorName = author || (userRole === 'teacher' ? 'Instructor (US)' : 'Anonymous Student');
    const savedReply = await createReply(doubtId, targetDoubt.classId, replyText, authorName);

    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id === doubtId) {
          const existing = d.replies || [];
          if (existing.some((r) => r.id === savedReply.id)) return d;
          return {
            ...d,
            replies: [...existing, savedReply],
          };
        }
        return d;
      })
    );
  };

  const handleQuickPostDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newDoubtText.trim();
    if (!text || isPosting) return;

    try {
      setIsPosting(true);
      const created = await createDoubt(postClassId, text);
      const classInfo = OOP_CLASSES.find((c) => c.id === postClassId);

      // Optimistic instant update: shows on screen in 0ms!
      setDoubts((prev) => [
        { ...created, classInfo },
        ...prev.filter((d) => d.id !== created.id),
      ]);

      setNewDoubtText('');
      setPostSuccess('✓ Doubt posted live to classroom feed!');
      setTimeout(() => setPostSuccess(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'Could not post doubt');
    } finally {
      setIsPosting(false);
    }
  };

  // Filtered doubts
  const filteredDoubts = useMemo(() => {
    return doubts.filter((d) => {
      // Class filter
      if (selectedClassId !== 'all' && d.classId !== selectedClassId) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const contentMatch = d.content.toLowerCase().includes(q);
        const replyMatch = (d.replies || []).some((r) => r.content.toLowerCase().includes(q));
        const classMatch = d.classInfo?.subject.toLowerCase().includes(q) || d.classInfo?.day.toLowerCase().includes(q);
        if (!contentMatch && !replyMatch && !classMatch) return false;
      }
      return true;
    });
  }, [doubts, selectedClassId, searchQuery]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
      {/* Header Bar */}
      {showHeader && (
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-extrabold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live Classroom Sync
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  • Total Doubts: <strong>{doubts.length}</strong>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
                All Doubts of the Day (आज के सारे डाउट्स)
              </h2>
              <p className="text-xs text-[#667085]">
                Real-time stream of all questions posted by students across SGSITS IT OOP lectures and labs.
              </p>
            </div>

            {/* Student vs Teacher Mode Switcher */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">Viewing as:</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setUserRole('student')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    userRole === 'student'
                      ? 'bg-white text-[#1769AA] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('teacher')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    userRole === 'teacher'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Teacher View (US)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={loadAll}
                disabled={isRefreshing}
                className="p-2 text-slate-500 hover:text-[#1769AA] hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="Refresh Doubts"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Teacher Mode Notice Banner */}
          {userRole === 'teacher' && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Teacher Mode Active:</strong> You can review all anonymous questions from your batch and reply directly with the official <strong>👨‍🏫 Instructor (US)</strong> badge.
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                Faculty Portal
              </span>
            </div>
          )}
        </div>
      )}

      {/* Quick Doubt Composer Box */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#EAF3FB]/40">
        <form onSubmit={handleQuickPostDoubt} className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A]">
              <Lock className="w-3.5 h-3.5 text-[#1769AA]" />
              <span>Ask Doubt in Today&apos;s Lecture or Lab:</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold text-[11px]">Class:</span>
              <select
                value={postClassId}
                onChange={(e) => setPostClassId(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#1769AA]"
              >
                {OOP_CLASSES.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.day} {cls.time.split('–')[0].trim()} ({cls.code} • {cls.room})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newDoubtText}
              onChange={(e) => setNewDoubtText(e.target.value)}
              placeholder="Type your question anonymously (e.g., Why do we use virtual functions in C++?)..."
              disabled={isPosting}
              className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1769AA]/20 focus:border-[#1769AA] text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!newDoubtText.trim() || isPosting}
              className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#1769AA] to-[#0B1F3A] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>{isPosting ? 'Posting...' : 'Ask Live'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {postSuccess && (
            <div className="p-2 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>{postSuccess}</span>
            </div>
          )}
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#F8FAFC] space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doubts by keyword (e.g. constructor, polymorphism, vtable, array)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1769AA] focus:border-[#1769AA] text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Clear Filter */}
          {(searchQuery || selectedClassId !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedClassId('all');
              }}
              className="text-xs font-bold text-[#1769AA] hover:underline self-end sm:self-auto whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Class Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
          <span className="text-[11px] text-slate-400 font-bold uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedClassId('all')}
            className={`px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap ${
              selectedClassId === 'all'
                ? 'bg-[#1769AA] text-white shadow-xs font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Classes ({doubts.length})
          </button>
          {OOP_CLASSES.map((cls) => {
            const count = doubts.filter((d) => d.classId === cls.id).length;
            const isSelected = selectedClassId === cls.id;
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => setSelectedClassId(cls.id)}
                className={`px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1769AA] text-white shadow-xs font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{cls.day} {cls.time.split('–')[0].trim()} ({cls.code})</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doubts List */}
      <div className="p-4 sm:p-6 space-y-4">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex justify-between">
                  <div className="w-24 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-3 bg-slate-200 rounded" />
                </div>
                <div className="w-3/4 h-4 bg-slate-200 rounded" />
                <div className="w-1/2 h-4 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredDoubts.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#0B1F3A]">No doubts found matching your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `No questions contain "${searchQuery}". Try different keywords or clear the search.`
                : 'Select another class slot or reset filters to see all batch questions.'}
            </p>
          </div>
        ) : (
          filteredDoubts.map((doubt) => {
            const cls = doubt.classInfo || OOP_CLASSES.find((c) => c.id === doubt.classId);
            return (
              <div
                key={doubt.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3 shadow-xs hover:border-[#1769AA]/40 transition-all group"
              >
                {/* Classroom Tag Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#EAF3FB] text-[#1769AA] border border-[#1769AA]/20 uppercase">
                      <BookOpen className="w-3 h-3" />
                      {cls?.code || 'OOP'} • {cls?.day} {cls?.time}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Room: {cls?.room}
                    </span>
                  </div>

                  <Link
                    href={`/classes/${doubt.classId}`}
                    className="text-[11px] font-bold text-[#1769AA] hover:text-[#0B1F3A] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Open Room Feed</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Question and Replies rendered via DoubtCard */}
                <DoubtCard doubt={doubt} onAddReply={handleAddReply} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
