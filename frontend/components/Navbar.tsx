'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, Sparkles, MessageCircleQuestion } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
      {/* Top Academic Department Announcement Ribbon */}
      <div className="bg-[#0B1F3A] text-white text-[11px] py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-semibold tracking-wide text-slate-300">
            Shri G. S. Institute of Technology and Science, Indore • Department of IT
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Realtime Doubt Forum Active
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Name: Anonymous Class Doubts SGSITS */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 flex-shrink-0 bg-white p-1 rounded-xl border border-slate-200 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md group-hover:border-[#1769AA]/40">
            <Image
              src="/sgsits-logo.png"
              alt="SGSITS Indore Crest"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#0B1F3A] group-hover:text-[#1769AA] transition-colors">
                Anonymous Class Doubts <span className="text-[#1769AA] font-black">SGSITS</span>
              </span>
              <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF3FB] text-[#1769AA] border border-[#1769AA]/20">
                IT Dept
              </span>
            </div>
            <span className="text-[11px] text-[#667085] font-medium tracking-wide flex items-center gap-1">
              Ask Freely • Learn Without Hesitation
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#667085]">
          <Link href="/" className="hover:text-[#1769AA] transition-colors py-1">
            Home
          </Link>
          <Link href="/classes" className="hover:text-[#1769AA] transition-colors py-1">
            Classes
          </Link>
          <a href="/#how-it-works" className="hover:text-[#1769AA] transition-colors py-1">
            How It Works
          </a>
          <a href="/#features" className="hover:text-[#1769AA] transition-colors py-1">
            Features
          </a>
        </nav>

        {/* Right CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/classes"
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1769AA] to-[#0B1F3A] hover:from-[#123B6D] hover:to-[#081528] rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Classes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <nav className="flex flex-col gap-2.5 text-xs font-semibold text-slate-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Home</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/classes"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Explore Classes</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>How It Works</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Features</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </nav>
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/classes"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold text-white bg-[#1769AA] rounded-lg flex items-center justify-center gap-2 shadow"
            >
              <span>Open Classroom Discussions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
