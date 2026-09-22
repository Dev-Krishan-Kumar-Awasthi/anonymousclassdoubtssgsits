'use client';

import React from 'react';
import {
  Clock,
  Radio,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface TimetableBarProps {
  currentTimeInfo: {
    dayName: string;
    formattedTime: string;
    formattedDate: string;
  };
  activeClassName?: string;
  isSimulated: boolean;
  onSetSimulation: (type: 'real' | 'wednesday-4' | 'monday-11' | 'friday-4') => void;
}

export function TimetableBar({
  currentTimeInfo,
  activeClassName,
  isSimulated,
  onSetSimulation,
}: TimetableBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Real-time Clock & Active Indicator */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-[#0B1F3A] text-white px-3 py-1.5 rounded-xl font-mono font-bold shadow-sm">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{currentTimeInfo.dayName}, {currentTimeInfo.formattedTime}</span>
            <span className="text-[10px] text-slate-400 font-sans font-normal">(Asia/Kolkata)</span>
          </div>

          {activeClassName ? (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Active Now: {activeClassName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>No lecture is currently live</span>
            </div>
          )}

          {isSimulated && (
            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
              Simulation Mode Active
            </span>
          )}
        </div>

        {/* Right: Quick Demo / Testing Mode selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
            Test Schedules:
          </span>
          <button
            type="button"
            onClick={() => onSetSimulation('real')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              !isSimulated
                ? 'bg-[#0B1F3A] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Real Time Clock
          </button>
          <button
            type="button"
            onClick={() => onSetSimulation('wednesday-4')}
            className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition-all flex items-center gap-1"
            title="Simulate Wednesday 4:15 PM (OOP Lecture Live)"
          >
            <Sparkles className="w-3 h-3" />
            <span>Simulate Wednesday 4:00 PM (Active)</span>
          </button>
          <button
            type="button"
            onClick={() => onSetSimulation('monday-11')}
            className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-all"
            title="Simulate Monday 11:15 AM (OOP Lecture Live)"
          >
            Monday 11:00 AM
          </button>
        </div>
      </div>
    </div>
  );
}
