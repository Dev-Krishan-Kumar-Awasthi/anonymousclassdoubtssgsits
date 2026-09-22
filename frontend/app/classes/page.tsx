'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OOP_CLASSES, OOPClass } from '@/data/mockData';
import { ClassCard } from '@/components/ClassCard';
import { TimetableBar } from '@/components/TimetableBar';
import { TodayDoubtsFeed } from '@/components/TodayDoubtsFeed';
import {
  getIndiaCurrentDateTime,
  sortClassesWithActiveFirst,
  isClassActive,
} from '@/lib/timetableUtils';
import { fetchDoubtCountsPerClass } from '@/lib/supabaseService';
import { ArrowLeft, BookOpen, Radio, Sparkles, MessageSquare, Layers } from 'lucide-react';

export default function ClassesPage() {
  const [viewMode, setViewMode] = useState<'classrooms' | 'all-doubts'>('classrooms');
  const [doubtCounts, setDoubtCounts] = useState<Record<string, number>>({});
  const [simulatedDate, setSimulatedDate] = useState<Date | null>(null);
  const [timeInfo, setTimeInfo] = useState(() => getIndiaCurrentDateTime(null));

  // Load doubt counts per class
  useEffect(() => {
    fetchDoubtCountsPerClass()
      .then((counts) => setDoubtCounts(counts))
      .catch((err) => console.warn('Could not load counts:', err));
  }, []);

  // Update clock every 10 seconds if on real time
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInfo(getIndiaCurrentDateTime(simulatedDate));
    }, 10000);
    return () => clearInterval(interval);
  }, [simulatedDate]);

  // Handle simulation toggle
  const handleSetSimulation = (type: 'real' | 'wednesday-4' | 'monday-11' | 'friday-4') => {
    if (type === 'real') {
      setSimulatedDate(null);
      setTimeInfo(getIndiaCurrentDateTime(null));
    } else if (type === 'wednesday-4') {
      const d = new Date();
      const currentDay = d.getDay();
      const diffToWednesday = 3 - currentDay;
      d.setDate(d.getDate() + diffToWednesday);
      d.setHours(16, 15, 0, 0);
      setSimulatedDate(d);
      setTimeInfo(getIndiaCurrentDateTime(d));
    } else if (type === 'monday-11') {
      const d = new Date();
      const currentDay = d.getDay();
      const diffToMonday = 1 - currentDay;
      d.setDate(d.getDate() + diffToMonday);
      d.setHours(11, 15, 0, 0);
      setSimulatedDate(d);
      setTimeInfo(getIndiaCurrentDateTime(d));
    } else if (type === 'friday-4') {
      const d = new Date();
      const currentDay = d.getDay();
      const diffToFriday = 5 - currentDay;
      d.setDate(d.getDate() + diffToFriday);
      d.setHours(16, 30, 0, 0);
      setSimulatedDate(d);
      setTimeInfo(getIndiaCurrentDateTime(d));
    }
  };

  // Sort classes so the active class is PINNED FIRST
  const sortedClasses = sortClassesWithActiveFirst(OOP_CLASSES, simulatedDate);
  const activeClass = sortedClasses.find((c) => c.isActive);
  const totalDoubtsAcrossAll = Object.values(doubtCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Back to Home & Academic Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1769AA] hover:text-[#0B1F3A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3FB] border border-[#1769AA]/20 text-xs font-semibold text-[#1769AA]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>IT • 2nd Year • Section B • Timetable Synchronized</span>
        </div>
      </div>

      {/* Page Title & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              {viewMode === 'classrooms' ? 'Scheduled Classrooms' : 'All Doubts of the Day'}
            </h1>
            {activeClass && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse">
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                <span>1 Class Currently Active & Pinned to Top</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#667085]">
            {viewMode === 'classrooms'
              ? 'Select your active lecture or lab slot to enter the discussion. The live class automatically pins to #1.'
              : 'Browse all student questions and teacher answers across today’s OOP lectures and labs.'}
          </p>
        </div>

        {/* View Switcher Tabs (Classrooms vs All Doubts) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('classrooms')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'classrooms'
                ? 'bg-white text-[#1769AA] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Classrooms Schedule</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('all-doubts')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'all-doubts'
                ? 'bg-[#1769AA] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#1769AA]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>All Doubts Today</span>
            {totalDoubtsAcrossAll > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                viewMode === 'all-doubts' ? 'bg-white/20 text-white' : 'bg-[#EAF3FB] text-[#1769AA]'
              }`}>
                {totalDoubtsAcrossAll}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Real-time Timetable and Simulation Bar */}
      <TimetableBar
        currentTimeInfo={timeInfo}
        activeClassName={activeClass ? `${activeClass.code} (${activeClass.time})` : undefined}
        isSimulated={Boolean(simulatedDate)}
        onSetSimulation={handleSetSimulation}
      />

      {/* Conditional View Rendering */}
      {viewMode === 'classrooms' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {sortedClasses.map((cls, idx) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              isActive={cls.isActive}
              statusText={cls.statusText}
              isPinned={cls.isActive && idx === 0}
              doubtCount={doubtCounts[cls.id]}
            />
          ))}
        </div>
      ) : (
        <div className="pt-2">
          <TodayDoubtsFeed showHeader={true} />
        </div>
      )}
    </div>
  );
}
