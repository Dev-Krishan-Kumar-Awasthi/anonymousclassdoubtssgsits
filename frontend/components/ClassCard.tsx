import React from 'react';
import Link from 'next/link';
import { OOPClass } from '@/data/mockData';
import { Clock, MapPin, User, ArrowRight, BookOpen, FlaskConical } from 'lucide-react';

interface ClassCardProps {
  cls: OOPClass;
}

export function ClassCard({ cls }: ClassCardProps) {
  const isLab = cls.type === 'Laboratory';

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-[#1769AA]/60 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Banner */}
      <div className={`p-4 border-b ${isLab ? 'bg-[#F0FDF4] border-emerald-100' : 'bg-[#EAF3FB] border-blue-100'}`}>
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
            isLab ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-[#1769AA]'
          }`}>
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
      </div>

      {/* Bottom Action */}
      <div className="p-4 pt-0">
        <Link
          href={`/classes/${cls.id}`}
          className="w-full py-2.5 px-4 rounded-lg bg-[#F6F8FB] group-hover:bg-[#1769AA] text-slate-700 group-hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-none group-hover:shadow"
        >
          <span>Open Class</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
