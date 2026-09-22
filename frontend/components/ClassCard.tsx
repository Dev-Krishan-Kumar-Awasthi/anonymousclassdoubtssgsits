'use client';

import React from 'react';
import Link from 'next/link';
import { OOPClass } from '@/data/mockData';
import {
  Clock,
  MapPin,
  User,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Radio,
  Pin,
  Lock,
} from 'lucide-react';

interface ClassCardProps {
  cls: OOPClass;
  isActive?: boolean;
  statusText?: string;
  isPinned?: boolean;
  doubtCount?: number;
}

export function ClassCard({ cls, isActive = false, statusText, isPinned = false, doubtCount }: ClassCardProps) {
  const isLab = cls.type === 'Laboratory';

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group relative ${
        isActive
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10'
          : 'border-slate-200 hover:border-[#1769AA]/50 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Pinned / Active Header Badge */}
      {isActive && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-extrabold px-3 py-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
            <span>LIVE NOW • CLASS IS ACTIVE</span>
          </span>
          {isPinned && (
            <span className="flex items-center gap-1 bg-white/20 px-2 py-0.2 rounded text-[10px]">
              <Pin className="w-2.5 h-2.5" /> Pinned #1
            </span>
          )}
        </div>
      )}

      {/* Top Banner */}
      <div
        className={`p-4 border-b ${
          isActive
            ? 'bg-emerald-50/70 border-emerald-100'
            : isLab
            ? 'bg-[#F0FDF4] border-emerald-100'
            : 'bg-[#EAF3FB] border-blue-100'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
              isActive
                ? 'bg-emerald-200 text-emerald-900'
                : isLab
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-blue-100 text-[#1769AA]'
            }`}
          >
            {isLab ? <FlaskConical className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
            {cls.code} • {cls.type}
          </span>
          <span className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">
            {cls.day}
          </span>
        </div>
        <h3 className="font-extrabold text-base text-[#0B1F3A] mt-2 group-hover:text-[#1769AA] transition-colors">
          {cls.subject}
        </h3>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3 text-xs text-slate-600 flex-1">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#1769AA] flex-shrink-0" />
          <span className="font-semibold text-slate-800">{cls.time}</span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-700">{cls.room}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[11px]">
            {cls.section}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-medium text-slate-700">
            Teacher Code: <strong className="text-[#0B1F3A]">{cls.teacher}</strong>
          </span>
        </div>

        {/* Live Status Tag Under Class */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {isActive ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Class is Active (Live Now)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>{statusText || 'Class is Not Active'}</span>
            </div>
          )}

          {typeof doubtCount === 'number' && (
            <span className="text-[11px] font-bold text-[#1769AA] bg-[#EAF3FB] px-2 py-1 rounded-lg border border-[#1769AA]/20">
              💬 {doubtCount} {doubtCount === 1 ? 'Doubt' : 'Doubts'}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-4 pt-0">
        <Link
          href={`/classes/${cls.id}`}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            isActive
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow'
              : 'bg-[#F6F8FB] group-hover:bg-[#1769AA] text-slate-700 group-hover:text-white'
          }`}
        >
          <span>{isActive ? 'Enter Active Class' : 'Open Class'}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
