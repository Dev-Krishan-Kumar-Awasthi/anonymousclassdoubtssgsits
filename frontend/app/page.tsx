'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OOP_CLASSES, OOPClass } from '@/data/mockData';
import { ClassCard } from '@/components/ClassCard';
import { TodayDoubtsFeed } from '@/components/TodayDoubtsFeed';
import { fetchDoubtCountsPerClass } from '@/lib/supabaseService';
import {
  sortClassesWithActiveFirst,
  getIndiaCurrentDateTime,
} from '@/lib/timetableUtils';
import {
  ArrowRight,
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
  HelpCircle,
  GraduationCap,
  MessageCircleQuestion,
  Lightbulb,
  ThumbsUp,
  Layers,
  Flame,
  Pin,
  Laptop,
  Check,
  Send,
  Code2,
  Share2,
  Terminal,
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'constructors' | 'vtable' | 'overriding'>('constructors');
  const [upvotes, setUpvotes] = useState({
    constructors: 24,
    vtable: 19,
    overriding: 32,
  });
  const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>({});
  const [demoInput, setDemoInput] = useState('');
  const [demoToast, setDemoToast] = useState<string | null>(null);
  const [simulatedDate, setSimulatedDate] = useState<Date | null>(null);
  const [timeInfo, setTimeInfo] = useState(() => getIndiaCurrentDateTime(null));
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [doubtCounts, setDoubtCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchDoubtCountsPerClass()
      .then((c) => setDoubtCounts(c))
      .catch((err) => console.warn('Could not load doubt counts:', err));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInfo(getIndiaCurrentDateTime(simulatedDate));
    }, 5000);
    return () => clearInterval(timer);
  }, [simulatedDate]);

  const handleSimulate = (toggle: boolean) => {
    if (!toggle) {
      setSimulatedDate(null);
      setTimeInfo(getIndiaCurrentDateTime(null));
    } else {
      const d = new Date();
      const currentDay = d.getDay();
      const diffToWednesday = 3 - currentDay;
      d.setDate(d.getDate() + diffToWednesday);
      d.setHours(16, 15, 0, 0);
      setSimulatedDate(d);
      setTimeInfo(getIndiaCurrentDateTime(d));
    }
  };

  const handleUpvote = (key: 'constructors' | 'vtable' | 'overriding') => {
    if (hasUpvoted[key]) return;
    setUpvotes((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setHasUpvoted((prev) => ({ ...prev, [key]: true }));
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput.trim()) return;
    setDemoToast(`Doubt submitted to demo feed! Click 'Explore Classrooms' below to join a live lecture.`);
    setDemoInput('');
    setTimeout(() => setDemoToast(null), 5000);
  };

  const sortedClasses = sortClassesWithActiveFirst(OOP_CLASSES, simulatedDate);
  const activeClass = sortedClasses.find((c) => c.isActive);

  return (
    <div className="flex flex-col selection:bg-[#EAF3FB] selection:text-[#1769AA]">
      {/* ==================================================
          1. HERO SECTION (Editorial, High-Impact Modern Design)
          ================================================== */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EDF4FA] border-b border-slate-200/90">
        {/* Ambient background glows */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0B1F3A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Value Proposition & Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Institution Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-white text-[#1769AA] border border-[#1769AA]/30 shadow-sm hover:shadow-md transition-all">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="tracking-wide">SGSITS INDORE • IT DEPT • 2ND YEAR SECTION B</span>
              </div>

              {/* Bold Editorial Headline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#0B1F3A] leading-[1.12]">
                  Never Leave a Lecture <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1769AA] via-[#2563EB] to-[#0284C7]">
                    With an Unasked Doubt.
                  </span>
                </h1>
                <p className="text-base sm:text-xl font-bold text-[#1769AA] tracking-tight">
                  Anonymous in the lecture hall. Loud and clear on the whiteboard.
                </p>
              </div>

              {/* Nuanced Editorial Copy */}
              <p className="text-sm sm:text-base text-[#475467] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                When 80 students sit in <strong>ATC-301</strong> or <strong>LT-002</strong>, hesitation kills curiosity.
                <span className="font-semibold text-slate-800"> Anonymous Class Doubts SGSITS</span> gives every student a judgment-free
                channel to post questions in real time during OOP lectures and labs. No names, no roll numbers, no peer pressure.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
                <Link
                  href="/classes"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#1769AA] via-[#123B6D] to-[#0B1F3A] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#1769AA]/20 transition-all flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Join Live Classroom Feed</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#psychology"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0B1F3A] border border-slate-300 text-xs sm:text-sm font-bold shadow-sm transition-all hover:border-[#1769AA] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#1769AA]" />
                  <span>Why Students Hesitate</span>
                </a>
              </div>

              {/* Trust Indicators Bar */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-2 text-[11px] font-bold text-slate-700">
                <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Cryptographic Anonymity</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-sm">
                  <Zap className="w-4 h-4 text-[#1769AA] flex-shrink-0" />
                  <span>Sub-100ms Realtime Sync</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-sm">
                  <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>Timetable-Gated Access</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Mock Classroom Terminal */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Floating Live Badge */}
              <div className="absolute -top-3.5 right-2 sm:right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-md text-[11px] font-bold text-[#0B1F3A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>Live Feed • Real-Time Broadcast</span>
              </div>

              {/* Main Card Container */}
              <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden transition-all hover:shadow-institutional-lg">
                {/* Window Header */}
                <div className="bg-[#0B1F3A] text-white p-4 border-b border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                    </div>
                    <span className="text-[10px] font-extrabold tracking-widest text-slate-300 uppercase">
                      ATC-301 • LIVE ROOM
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      ACTIVE NOW
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                    Object Oriented Programming (OOP)
                  </h3>
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-300 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-400" /> Monday 11:00 AM – 12:00 PM
                    </span>
                    <span>•</span>
                    <span className="text-white font-semibold">Teacher: US</span>
                  </div>
                </div>

                {/* Interactive Tab Selectors */}
                <div className="flex bg-slate-100/90 p-1 border-b border-slate-200 text-xs font-bold text-slate-600 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('constructors')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                      activeTab === 'constructors'
                        ? 'bg-white text-[#1769AA] shadow-sm'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    super() Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('vtable')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                      activeTab === 'vtable'
                        ? 'bg-white text-[#1769AA] shadow-sm'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    vtable & vptr
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('overriding')}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                      activeTab === 'overriding'
                        ? 'bg-white text-[#1769AA] shadow-sm'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Static Methods
                  </button>
                </div>

                {/* Discussion Simulator Feed */}
                <div className="p-4 space-y-3 bg-[#F8FAFC]">
                  {activeTab === 'constructors' && (
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center text-[10px]">
                            <User className="w-2.5 h-2.5" />
                          </div>
                          Anonymous Student
                        </span>
                        <span>Just now</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        &ldquo;Why does super() must be the very first statement inside a derived class constructor in Java?&rdquo;
                      </p>
                      <div className="p-3 rounded-lg bg-[#EAF3FB]/80 border border-[#1769AA]/20 text-xs text-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#1769AA]">
                          <span>Anonymous Peer Reply:</span>
                          <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                            ✓ Verified Concept
                          </span>
                        </div>
                        <p className="leading-relaxed text-[11px] text-slate-700">
                          Because the parent class state must be fully initialized before the child class constructor executes. Otherwise child code might access uninitialized inherited members.
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleUpvote('constructors')}
                          className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                            hasUpvoted.constructors
                              ? 'bg-[#1769AA] text-white border-[#1769AA]'
                              : 'bg-slate-50 hover:bg-[#EAF3FB] text-[#1769AA] border-slate-200'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{upvotes.constructors} students had this doubt</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">ATC-301</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'vtable' && (
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center text-[10px]">
                            <User className="w-2.5 h-2.5" />
                          </div>
                          Anonymous Student
                        </span>
                        <span>3 min ago</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        &ldquo;How does the compiler actually execute runtime polymorphism via vtable in C++?&rdquo;
                      </p>
                      <div className="p-3 rounded-lg bg-[#EAF3FB]/80 border border-[#1769AA]/20 text-xs text-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#1769AA]">
                          <span>Anonymous Peer Reply:</span>
                          <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                            ✓ Core Topic
                          </span>
                        </div>
                        <p className="leading-relaxed text-[11px] text-slate-700">
                          Every class with virtual functions has a hidden table of function pointers (<code className="bg-white/80 px-1 rounded text-sky-800">vtable</code>). Each object stores an invisible pointer (<code className="bg-white/80 px-1 rounded text-sky-800">_vptr</code>) resolved at runtime!
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleUpvote('vtable')}
                          className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                            hasUpvoted.vtable
                              ? 'bg-[#1769AA] text-white border-[#1769AA]'
                              : 'bg-slate-50 hover:bg-[#EAF3FB] text-[#1769AA] border-slate-200'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{upvotes.vtable} students found this helpful</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">LT-002</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'overriding' && (
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center text-[10px]">
                            <User className="w-2.5 h-2.5" />
                          </div>
                          Anonymous Student
                        </span>
                        <span>7 min ago</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        &ldquo;Can we override a static method in Java? Why or why not?&rdquo;
                      </p>
                      <div className="p-3 rounded-lg bg-[#EAF3FB]/80 border border-[#1769AA]/20 text-xs text-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#1769AA]">
                          <span>Anonymous Peer Reply:</span>
                          <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                            ✓ Exam Favorite
                          </span>
                        </div>
                        <p className="leading-relaxed text-[11px] text-slate-700">
                          No! Static methods are bound at compile-time using the Class reference, not object reference. Redefining it in a subclass is <strong>method hiding</strong>, not overriding.
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleUpvote('overriding')}
                          className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                            hasUpvoted.overriding
                              ? 'bg-[#1769AA] text-white border-[#1769AA]'
                              : 'bg-slate-50 hover:bg-[#EAF3FB] text-[#1769AA] border-slate-200'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{upvotes.overriding} students upvoted</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">Room 207</span>
                      </div>
                    </div>
                  )}

                  {/* Interactive Test Input Bar */}
                  <form onSubmit={handleDemoSubmit} className="pt-1">
                    <div className="p-1.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm focus-within:border-[#1769AA] transition-colors">
                      <input
                        type="text"
                        value={demoInput}
                        onChange={(e) => setDemoInput(e.target.value)}
                        placeholder="Try typing a test doubt anonymously..."
                        className="flex-1 text-xs px-2.5 py-1.5 text-slate-800 placeholder:text-slate-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1769AA] hover:bg-[#123B6D] rounded-lg shadow-sm transition-all flex items-center gap-1"
                      >
                        <span>Send</span>
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </form>

                  {demoToast && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{demoToast}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          2. LIVE CAMPUS TIMETABLE RADAR BAR
          ================================================== */}
      <section className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 sticky top-[57px] z-40 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-[#0B1F3A]">SGSITS Timetable Radar:</span>
            <span className="font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-800 font-semibold border border-slate-200">
              {timeInfo.dayName}, {timeInfo.formattedTime} (Asia/Kolkata)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {activeClass ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1 rounded-full font-bold">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Class is in Session: {activeClass.code} ({activeClass.time})</span>
              </div>
            ) : (
              <span className="text-slate-500 font-medium">
                ⚪ No active class at this moment • Next slot opens during lecture hours
              </span>
            )}

            {/* 1-Click Simulation Controls for testing */}
            <div className="hidden lg:flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Test Simulation:</span>
              <button
                type="button"
                onClick={() => handleSimulate(!simulatedDate)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                  simulatedDate
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {simulatedDate ? 'Reset to Real Time' : 'Simulate Wed 4 PM'}
              </button>
            </div>

            <Link
              href="/classes"
              className="font-bold text-[#1769AA] hover:text-[#0B1F3A] flex items-center gap-1 transition-colors ml-1"
            >
              <span>View All 6 Rooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. PSYCHOLOGY SECTION ("Why Students Hesitate")
          ================================================== */}
      <section id="psychology" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full scroll-mt-20">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1769AA] bg-[#EAF3FB] px-3.5 py-1 rounded-full border border-[#1769AA]/20">
            The Psychology of the Engineering Lecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            Why 80% of College Doubts Never Get Asked.
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] max-w-2xl mx-auto leading-relaxed">
            In engineering classrooms at SGSITS, doubts don&apos;t go unasked because students don&apos;t care.
            They go unasked because of social anxiety, fast lecture pace, and fear of looking foolish.
          </p>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Traditional Classroom Experience */}
          <div className="bg-white p-7 sm:p-8 rounded-2xl border border-rose-200 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                <span className="font-bold text-xs uppercase tracking-wider text-rose-700 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  The Old Lecture Dilemma
                </span>
                <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Fear of Judgment
                </span>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <span className="font-bold text-slate-900 block">&ldquo;Wait, why did we use virtual destructor here?&rdquo;</span>
                    <span className="text-[11px] text-slate-500">Teacher shifts to the next slide while confusion lingers.</span>
                  </div>
                </div>

                <div className="text-center text-slate-400 text-xs">↓</div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="text-xl">🤐</span>
                  <div>
                    <span className="font-bold text-slate-900 block">&ldquo;Should I interrupt? What if 75 classmates laugh?&rdquo;</span>
                    <span className="text-[11px] text-slate-500">Social friction forces the hand down. The doubt remains unspoken.</span>
                  </div>
                </div>

                <div className="text-center text-slate-400 text-xs">↓</div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="text-xl">📚</span>
                  <div>
                    <span className="font-bold text-slate-900 block">&ldquo;I&apos;ll just Google it tonight...&rdquo;</span>
                    <span className="text-[11px] text-slate-500">Forgotten until the night before the midsem exam.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-bold text-center">
              ❌ Doubt stays unresolved • Same confusion repeats in semester practicals
            </div>
          </div>

          {/* Card 2: Anonymous Class Doubts SGSITS Experience */}
          <div className="bg-white p-7 sm:p-8 rounded-2xl border-2 border-[#1769AA]/60 shadow-md space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-[#1769AA] to-[#0B1F3A] text-white text-[10px] font-bold px-3.5 py-1 rounded-bl-lg uppercase tracking-wider">
              The Engineering Fix
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                <span className="font-bold text-xs uppercase tracking-wider text-[#1769AA] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1769AA]" />
                  With Anonymous Class Doubts SGSITS
                </span>
                <span className="text-[10px] font-bold text-[#1769AA] bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
                  Zero Hesitation
                </span>
              </div>

              {/* 4-Stage Connected Workflow */}
              <div className="grid grid-cols-4 gap-2 text-center py-2">
                <div className="p-2.5 rounded-xl bg-[#EAF3FB] border border-[#1769AA]/20">
                  <div className="font-extrabold text-xs text-[#0B1F3A]">Student</div>
                  <div className="text-[10px] text-[#1769AA]">Types in app</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#EAF3FB] border border-[#1769AA]/20">
                  <div className="font-extrabold text-xs text-[#0B1F3A]">Anonymous</div>
                  <div className="text-[10px] text-[#1769AA]">Zero identity</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#EAF3FB] border border-[#1769AA]/20">
                  <div className="font-extrabold text-xs text-[#0B1F3A]">Real-Time</div>
                  <div className="text-[10px] text-[#1769AA]">Live in feed</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300">
                  <div className="font-extrabold text-xs text-emerald-900">Solved</div>
                  <div className="text-[10px] text-emerald-700">Batch learns</div>
                </div>
              </div>

              <div className="space-y-3.5 pt-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Complete Psychological Safety:</strong>
                    <span className="text-slate-600"> Ask whatever is genuinely confusing you without worrying about peer judgment.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">The Silent Majority Benefit:</strong>
                    <span className="text-slate-600"> When you post about method hiding, 20 quiet batchmates immediately gain clarity too.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Persistent Revision Archive:</strong>
                    <span className="text-slate-600"> Questions don&apos;t evaporate. They stay saved in the room to revise before midsem exams!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold text-center">
              ✓ Ask it without fear. Learn with confidence. Master your semester.
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. THE 4 PILLARS (Bento Grid Style)
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-slate-200/90 scroll-mt-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1769AA] bg-[#EAF3FB] px-3.5 py-1 rounded-full border border-[#1769AA]/20">
              Architected for Engineering Excellence
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              Built Specifically for SGSITS Classrooms.
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] max-w-lg mx-auto leading-relaxed">
              Every feature is purposefully tailored to the actual physical classroom workflow of SGSITS Indore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Bento Card 1: Zero Identity */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3.5 hover:shadow-md hover:border-[#1769AA]/40 transition-all flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-[#1769AA] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0B1F3A]">100% Cryptographic Anonymity</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No sign-ins, no email collection, no roll numbers. Doubts are submitted with randomized anonymous tokens that protect student privacy completely.
                </p>
              </div>
              <div className="text-[10px] font-bold text-[#1769AA] bg-white p-2 rounded-lg border border-slate-200 text-center">
                ZERO IDENTITY LEAKAGE
              </div>
            </div>

            {/* Bento Card 2: Timetable Aware */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3.5 hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0B1F3A]">Timetable Radar & Pinning</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The system automatically detects whether a class is live based on the official SGSITS IT Section B timetable. The active lecture is pinned straight to #1.
                </p>
              </div>
              <div className="text-[10px] font-bold text-emerald-700 bg-white p-2 rounded-lg border border-slate-200 text-center">
                LIVE ASIA/KOLKATA TIME
              </div>
            </div>

            {/* Bento Card 3: Supabase Realtime */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3.5 hover:shadow-md hover:border-purple-500/40 transition-all flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0B1F3A]">Instant WebSocket Sync</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Powered by Supabase Realtime replication. When a doubt is sent, it appears instantly on every screen in the room without requiring a page reload.
                </p>
              </div>
              <div className="text-[10px] font-bold text-purple-700 bg-white p-2 rounded-lg border border-slate-200 text-center">
                ZERO REFRESH NEEDED
              </div>
            </div>

            {/* Bento Card 4: Exam Vault */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3.5 hover:shadow-md hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0B1F3A]">Permanent Exam Revision</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Doubts asked during week 3 remain saved and searchable during week 14 before MST-1 and endsems. An organic question bank built by your own batch.
                </p>
              </div>
              <div className="text-[10px] font-bold text-amber-700 bg-white p-2 rounded-lg border border-slate-200 text-center">
                PERSISTENT ARCHIVE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. CLASSROOMS DIRECTORY (With Active Pinning)
          ================================================== */}
      <section id="classes" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full scroll-mt-16">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF3FB] text-[#1769AA] border border-[#1769AA]/20">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Object Oriented Programming • Section B Timetable</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
                Scheduled Classrooms
              </h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                Select your current room to enter the real-time feed. The live class automatically pins to #1.
              </p>
            </div>

            <Link
              href="/classes"
              className="text-xs font-bold text-[#1769AA] hover:text-[#0B1F3A] flex items-center gap-1.5 transition-colors group"
            >
              <span>Explore All Rooms</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid of OOP Class Cards with Active Class Pinned First */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>

      {/* ==================================================
          6. LIVE ALL DOUBTS OF THE DAY (Student & Teacher View)
          ================================================== */}
      <section id="today-doubts" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full scroll-mt-16">
        <TodayDoubtsFeed showHeader={true} />
      </section>

      {/* ==================================================
          6. FREQUENTLY ASKED QUESTIONS (Accordion FAQ)
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-[#F8FAFC] border-t border-slate-200/90 scroll-mt-16">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1769AA] bg-[#EAF3FB] px-3.5 py-1 rounded-full border border-[#1769AA]/20">
              Student Questions
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] max-w-lg mx-auto leading-relaxed">
              Clear answers on anonymity, timetable gating, and how the platform works.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                q: "Is my identity genuinely 100% anonymous? Can anyone trace my roll number?",
                a: "Yes, 100% anonymous. There is no signup, no login, no email verification, and no IP/roll-number broadcast. Doubts and replies are simply posted as 'Anonymous Student'. You can ask any question without any risk of peer judgment."
              },
              {
                q: "Why does the app show 'Class is not active' when I try to post outside lecture hours?",
                a: "To prevent spam and keep doubts tightly relevant to what is currently being taught in class, doubts can only be submitted during scheduled lecture & lab slots. However, all existing doubts and replies remain readable 24/7 for exam revision!"
              },
              {
                q: "Can I ask doubts in Hinglish or only formal English?",
                a: "You can ask in English, Hinglish, or casual code snippets! The focus is conceptual clarity—feel free to write: 'Sir ye virtual destructor wala concept clear nahi hua' or 'Can super() be used in static methods?'"
              },
              {
                q: "How does the real-time timetable synchronization work?",
                a: "The platform evaluates the real Indian Standard Time (Asia/Kolkata). When your Monday 11 AM, Wednesday 4 PM, or practical lab slot arrives, that room turns green ('LIVE NOW') and automatically pins to the #1 position on the dashboard."
              },
              {
                q: "Can classmates answer my doubts or only the teacher?",
                a: "Anyone in the class can reply! Often, a classmate has already cracked the issue or has a great code example to share. Teachers can also view the live feed on their screen to address trending questions directly on the whiteboard."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#0B1F3A] hover:text-[#1769AA] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-90 text-[#1769AA]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          7. INSPIRING CALL TO ACTION
          ================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EDF4FA] border-t border-slate-200 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="inline-block p-2.5 bg-white rounded-2xl shadow-md border border-slate-200">
            <Image
              src="/sgsits-logo.png"
              alt="SGSITS Indore"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#0B1F3A] tracking-tight">
            Have a Doubt in Class?
          </h2>

          <p className="text-sm sm:text-base text-[#667085] leading-relaxed max-w-lg mx-auto font-normal">
            Never stay quiet out of hesitation. One simple question asked by you can clear a crucial concept for your entire batch.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/classes"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#1769AA] via-[#123B6D] to-[#0B1F3A] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#1769AA]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enter Classroom Feed</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
