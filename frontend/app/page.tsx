'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OOP_CLASSES } from '@/data/mockData';
import { ClassCard } from '@/components/ClassCard';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  Users,
  XCircle,
  MessageSquare,
  ShieldCheck,
  Zap,
  BookOpen,
  Radio,
  Lock,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'overloading' | 'constructors' | 'polymorphism'>('overloading');

  return (
    <div className="flex flex-col selection:bg-[#EAF3FB] selection:text-[#1769AA]">
      {/* ==================================================
          1. HERO SECTION (High-Impact Visual Split Screen)
          ================================================== */}
      <section className="relative pt-10 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-gradient-to-b from-white via-[#F6F8FB] to-[#EAF3FB]/40 border-b border-slate-200">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#0B1F3A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Institutional Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-white text-[#1769AA] border border-[#1769AA]/25 shadow-sm hover:shadow transition-all">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1769AA] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1769AA]"></span>
                </span>
                <span className="tracking-wide">SGSITS INDORE • IT DEPT • 2ND YEAR SECTION B</span>
              </div>

              {/* Main Headline H1 with SEO keywords */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-[#0B1F3A] leading-[1.14]">
                Ask the Question <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1769AA] via-[#2563EB] to-[#0284C7]">
                  You Hesitate to Ask.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-[#475467] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                <strong>Anonymous Class Doubts SGSITS</strong> gives students a comfortable,
                judgment-free space to ask questions during lectures, discuss concepts with peers,
                and learn together in real time.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/classes"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#1769AA] to-[#0B1F3A] hover:from-[#123B6D] hover:to-[#081528] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Explore OOP Classes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0B1F3A] border border-slate-300/90 text-xs sm:text-sm font-bold shadow-sm transition-all hover:border-[#1769AA] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#1769AA]" />
                  <span>How It Works</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-3 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Anonymous to Class</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                  <Zap className="w-4 h-4 text-[#1769AA] flex-shrink-0" />
                  <span>Real-Time Updates</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                  <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>Official SGSITS Timetable</span>
                </div>
              </div>
            </div>

            {/* Right Side: Realistic High-Fidelity Discussion UI Mockup */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Floating Badge 1: Live Indicator */}
              <div className="absolute -top-3.5 -right-2 sm:right-2 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-md text-xs font-bold text-[#0B1F3A] flex items-center gap-2 animate-bounce">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>18 Doubts In Class Today</span>
              </div>

              {/* Floating Badge 2: Identity Guard */}
              <div className="absolute -bottom-3.5 -left-2 sm:left-2 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-md text-xs font-bold text-[#1769AA] flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#1769AA]" />
                <span>Identity Protected</span>
              </div>

              {/* Main Realistic Product Card */}
              <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden transition-all hover:shadow-institutional-lg">
                {/* Mockup Header */}
                <div className="bg-gradient-to-r from-[#0B1F3A] to-[#123B6D] text-white p-4.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold tracking-widest text-slate-300 uppercase">
                      ANONYMOUS CLASS DOUBTS • SGSITS
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      LIVE
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base tracking-tight text-white">
                    Object Oriented Programming (OOP)
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-400" /> Monday 11:00 AM – 12:00 PM
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-white">ATC-301</span>
                  </div>
                </div>

                {/* Interactive Mockup Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overloading')}
                    className={`flex-1 py-2 text-center transition-colors ${
                      activeTab === 'overloading' ? 'bg-white text-[#1769AA] border-b-2 border-[#1769AA] font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    Question 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('constructors')}
                    className={`flex-1 py-2 text-center transition-colors ${
                      activeTab === 'constructors' ? 'bg-white text-[#1769AA] border-b-2 border-[#1769AA] font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    Question 2
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('polymorphism')}
                    className={`flex-1 py-2 text-center transition-colors ${
                      activeTab === 'polymorphism' ? 'bg-white text-[#1769AA] border-b-2 border-[#1769AA] font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    Question 3
                  </button>
                </div>

                {/* Mockup Body Content */}
                <div className="p-4 space-y-3 bg-[#F8FAFC]">
                  {activeTab === 'overloading' && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center text-[10px]">
                            <User className="w-2.5 h-2.5" />
                          </div>
                          Anonymous Student
                        </span>
                        <span>2 min ago</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        &ldquo;What is the difference between method overloading and overriding?&rdquo;
                      </p>
                      <div className="p-2.5 rounded-lg bg-[#EAF3FB]/70 border border-[#1769AA]/20 text-xs text-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-[#1769AA] block">
                          Anonymous Student Reply:
                        </span>
                        <p className="leading-relaxed text-[11px]">
                          Overloading has different method parameters in the same class (compile-time). Overriding provides a custom subclass implementation (runtime).
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'constructors' && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center text-[10px]">
                            <User className="w-2.5 h-2.5" />
                          </div>
                          Anonymous Student
                        </span>
                        <span>5 min ago</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        &ldquo;Why do we need constructors if default constructor is automatically created?&rdquo;
                      </p>
                      <div className="p-2.5 rounded-lg bg-[#EAF3FB]/70 border border-[#1769AA]/20 text-xs text-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-[#1769AA] block">
                          Anonymous Student Reply:
                        </span>
                        <p className="leading-relaxed text-[11px]">
                          Default constructors only initialize with default zeroes/nulls. Parameterized constructors let you pass custom initial values upon instantiation.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'polymorphism' && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center text-[10px]">
                            <User className="w-2.5 h-2.5" />
                          </div>
                          Anonymous Student
                        </span>
                        <span>8 min ago</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        &ldquo;Can someone explain polymorphism with a simple real-world example?&rdquo;
                      </p>
                      <div className="p-2.5 rounded-lg bg-[#EAF3FB]/70 border border-[#1769AA]/20 text-xs text-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-[#1769AA] block">
                          Anonymous Student Reply:
                        </span>
                        <p className="leading-relaxed text-[11px]">
                          Like a smartphone: one device that acts as a camera, music player, and phone depending on what you call!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Fake Composer Bar inside Preview */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-sm">
                    <div className="text-xs text-slate-400 pl-1">Ask doubt anonymously...</div>
                    <span className="px-3 py-1 text-[11px] font-bold text-white bg-[#1769AA] rounded-md shadow-sm">
                      Send
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          2. STATS & CAMPUS HIGHLIGHTS BAR
          ================================================== */}
      <section className="bg-white border-b border-slate-200/90 py-6 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-black text-[#0B1F3A]">6 Slots</div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Authoritative OOP Lectures & Labs</p>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-black text-[#1769AA]">100%</div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Anonymous Student Display</p>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-black text-[#0B1F3A]">Real-Time</div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Live Question & Reply Sync</p>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">Zero Fear</div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">No Hand-Raising Awkwardness</p>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. PROBLEM SECTION (Visual Storytelling)
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1769AA] bg-[#EAF3FB] px-3.5 py-1 rounded-full border border-[#1769AA]/20">
            Why We Built This
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            Sometimes the easiest question is the hardest to ask.
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] max-w-2xl mx-auto leading-relaxed">
            In engineering classrooms at SGSITS, students frequently hesitate to raise their hand,
            interrupt the lecture, or ask basic conceptual doubts in front of 70+ peers.
          </p>
        </div>

        {/* Visual Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left: The Classroom Silence Trap */}
          <div className="bg-white p-7 rounded-2xl border border-rose-200/80 shadow-sm space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                <span className="font-bold text-xs uppercase tracking-wider text-rose-700 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  The Old Classroom Hesitation
                </span>
                <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                  Hesitation Loop
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
                  <span className="text-lg">💭</span>
                  <span className="font-medium">&ldquo;I didn&apos;t understand this code snippet...&rdquo;</span>
                </div>
                <div className="text-center text-slate-400 text-xs">↓</div>
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
                  <span className="text-lg">😬</span>
                  <span className="font-medium">&ldquo;What if everyone else already knows this? I&apos;ll look foolish.&rdquo;</span>
                </div>
                <div className="text-center text-slate-400 text-xs">↓</div>
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
                  <span className="text-lg">🤐</span>
                  <span className="font-medium">&ldquo;I&apos;ll ask sir after class... (and then forget or leave)&rdquo;</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-bold text-center">
              ❌ Doubt remains unanswered • Conceptual gap remains in exams
            </div>
          </div>

          {/* Right: Anonymous Class Doubts SGSITS */}
          <div className="bg-white p-7 rounded-2xl border-2 border-[#1769AA]/40 shadow-md space-y-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#1769AA] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Solution
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                <span className="font-bold text-xs uppercase tracking-wider text-[#1769AA] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1769AA]" />
                  With Anonymous Class Doubts SGSITS
                </span>
                <span className="text-[10px] font-bold text-[#1769AA] bg-[#EAF3FB] px-2 py-0.5 rounded">
                  Frictionless
                </span>
              </div>

              {/* 4-Stage Connected Pipeline */}
              <div className="grid grid-cols-4 gap-2 text-center py-3">
                <div className="p-2.5 rounded-xl bg-[#EAF3FB] border border-[#1769AA]/20">
                  <div className="font-bold text-xs text-[#0B1F3A]">Student</div>
                  <div className="text-[10px] text-[#1769AA]">Types doubt</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#EAF3FB] border border-[#1769AA]/20">
                  <div className="font-bold text-xs text-[#0B1F3A]">Anonymous</div>
                  <div className="text-[10px] text-[#1769AA]">No names</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#EAF3FB] border border-[#1769AA]/20">
                  <div className="font-bold text-xs text-[#0B1F3A]">Discuss</div>
                  <div className="text-[10px] text-[#1769AA]">Peers reply</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-xs text-emerald-900">Clarity</div>
                  <div className="text-[10px] text-emerald-700">Class learns</div>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Zero judgment:</strong> No peer pressure, ask whatever you need to understand</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Instant visibility:</strong> Questions appear live for all classmates in that room</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><strong>Shared peer insights:</strong> When one student asks, 10 others learn the same concept</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold text-center">
              ✓ Ask it. Discuss it. Understand it.
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. CLASSES SHOWCASE (Direct Access)
          ================================================== */}
      <section id="classes" className="py-20 px-4 sm:px-6 bg-white border-y border-slate-200 scroll-mt-16">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1769AA] bg-[#EAF3FB] px-3 py-1 rounded-full border border-[#1769AA]/20">
                SGSITS Timetable Classrooms
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
                Explore Classes
              </h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                Open a scheduled Object Oriented Programming class or lab slot to join the anonymous discussion.
              </p>
            </div>

            <Link
              href="/classes"
              className="text-xs font-bold text-[#1769AA] hover:text-[#0B1F3A] flex items-center gap-1.5 transition-colors group"
            >
              <span>View all 6 OOP classes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid of OOP Class Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OOP_CLASSES.map((cls) => (
              <ClassCard key={cls.id} cls={cls} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          5. HOW IT WORKS (3 Step Interactive Flow)
          ================================================== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full scroll-mt-16">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1769AA] bg-[#EAF3FB] px-3 py-1 rounded-full border border-[#1769AA]/20">
            Frictionless Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] max-w-lg mx-auto leading-relaxed">
            From lecture confusion to crystal-clear understanding in 3 quick steps.
          </p>
        </div>

        {/* 3 Connected Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 01 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-[#1769AA]/60 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center font-black text-lg group-hover:bg-[#1769AA] group-hover:text-white transition-colors">
              01
            </div>
            <h3 className="font-extrabold text-base text-[#0B1F3A]">Choose Your Class</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Open your scheduled OOP lecture or lab based on the SGSITS timetable.
            </p>
            <div className="p-2.5 bg-[#F8FAFC] rounded-lg text-[11px] font-bold text-[#1769AA] text-center border border-slate-200">
              CLASSROOM SELECTION
            </div>
          </div>

          {/* Step 02 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-[#1769AA]/60 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center font-black text-lg group-hover:bg-[#1769AA] group-hover:text-white transition-colors">
              02
            </div>
            <h3 className="font-extrabold text-base text-[#0B1F3A]">Ask Your Question</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Type your doubt anonymously. Your name, email, or identity is never shown.
            </p>
            <div className="p-2.5 bg-[#F8FAFC] rounded-lg text-[11px] font-bold text-[#1769AA] text-center border border-slate-200">
              ANONYMOUS SUBMISSION
            </div>
          </div>

          {/* Step 03 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-[#1769AA]/60 hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center font-black text-lg group-hover:bg-[#1769AA] group-hover:text-white transition-colors">
              03
            </div>
            <h3 className="font-extrabold text-base text-[#0B1F3A]">Discuss & Learn</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Read peer explanations, reply with code examples, and clear concepts together.
            </p>
            <div className="p-2.5 bg-[#F8FAFC] rounded-lg text-[11px] font-bold text-[#1769AA] text-center border border-slate-200">
              COMMUNITY CLARITY
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. FINAL CTA
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#F6F8FB] to-white border-t border-slate-200 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="inline-block p-2 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Image
              src="/sgsits-logo.png"
              alt="SGSITS Indore"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#0B1F3A] tracking-tight">
            Have a Doubt in Class?
          </h2>

          <p className="text-sm sm:text-base text-[#667085] leading-relaxed max-w-lg mx-auto">
            Don&apos;t keep it to yourself. One simple question can clear a core concept for your entire batch.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/classes"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#1769AA] to-[#0B1F3A] hover:from-[#123B6D] hover:to-[#081528] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <span>Explore OOP Classes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
