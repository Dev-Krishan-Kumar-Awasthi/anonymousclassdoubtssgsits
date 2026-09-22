'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center mx-auto">
        <HelpCircle className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-black text-[#0B1F3A]">Page Not Found</h2>
      <p className="text-xs text-[#667085]">
        The page or class you are looking for does not exist in Anonymous Class Doubts SGSITS.
      </p>
      <div className="pt-2">
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1769AA] text-white text-xs font-bold shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Explore Classes</span>
        </Link>
      </div>
    </div>
  );
}
