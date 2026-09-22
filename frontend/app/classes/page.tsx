'use client';

import React from 'react';
import Link from 'next/link';
import { OOP_CLASSES } from '@/data/mockData';
import { ClassCard } from '@/components/ClassCard';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function ClassesPage() {
  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-8">
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
          <span>IT • 2nd Year • Section B</span>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
          Classes
        </h1>
        <p className="text-xs sm:text-sm text-[#667085]">
          Choose a class to join the discussion. Select any active Object Oriented Programming lecture or laboratory session below.
        </p>
      </div>

      {/* Grid of 6 OOP Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {OOP_CLASSES.map((cls) => (
          <ClassCard key={cls.id} cls={cls} />
        ))}
      </div>
    </div>
  );
}
