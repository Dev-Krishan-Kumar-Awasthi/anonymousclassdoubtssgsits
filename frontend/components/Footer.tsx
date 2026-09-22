import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B1F3A] text-slate-300 border-t border-slate-800 py-14 px-4 sm:px-6 text-xs mt-auto relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-slate-800 relative z-10">
        {/* Brand & Description */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl shadow-sm">
              <Image
                src="/sgsits-logo.png"
                alt="SGSITS Crest"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight">
                Anonymous Class Doubts <span className="text-[#60A5FA]">SGSITS</span>
              </span>
              <p className="text-xs text-slate-400">Department of Information Technology</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            The dedicated classroom communication platform for Shri G. S. Institute of Technology and Science, Indore.
            Engineered to empower students to ask questions freely and learn without hesitation.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#60A5FA]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>&ldquo;Ask Freely. Learn Without Hesitation.&rdquo;</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">Classroom Navigation</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home Page
              </Link>
            </li>
            <li>
              <Link href="/classes" className="hover:text-white transition-colors">
                All OOP Classes (Section B)
              </Link>
            </li>
            <li>
              <Link href="/classes/oop-monday-11" className="hover:text-white transition-colors">
                Monday Lecture (ATC-301)
              </Link>
            </li>
            <li>
              <Link href="/classes/oop-lab-monday-b3" className="hover:text-white transition-colors">
                Monday OOP Lab (Lab 207)
              </Link>
            </li>
          </ul>
        </div>

        {/* Academic Details */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">Academic Details</h4>
          <div className="space-y-2 text-xs text-slate-400">
            <p className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>B.Tech 2nd Year • Section B</span>
            </p>
            <p className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Subject: Object Oriented Programming</span>
            </p>
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy: Anonymous Student Display</span>
            </p>
            <p className="pt-2 text-[11px] text-slate-400">
              Shri G. S. Institute of Technology and Science, 23 Park Road, Indore (M.P.) - 452003
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400 relative z-10">
        <p>
          © 2026 Anonymous Class Doubts SGSITS • Department of Information Technology • Academic Prototype
        </p>
        <div className="flex items-center gap-4 text-[#60A5FA]">
          <span>Indore, Madhya Pradesh</span>
          <span>•</span>
          <span>Asia/Kolkata Timetable</span>
        </div>
      </div>
    </footer>
  );
}
