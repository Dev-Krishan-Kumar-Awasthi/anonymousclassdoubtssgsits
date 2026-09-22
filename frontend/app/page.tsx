'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Clock,
  MessageSquareShare,
  Users,
  Building2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface HealthStatus {
  status: string;
  service: string;
  istTimestamp: string;
  timezone: string;
  institution: string;
}

export default function HomePage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoadingHealth(false);
      })
      .catch((err) => {
        console.warn('Backend API connection check:', err.message);
        setLoadingHealth(false);
      });
  }, []);

  return (
    <div className="flex flex-col flex-1">
      {/* Institutional Hero Banner */}
      <section className="bg-gradient-to-b from-[#0B1F3A] to-[#123B6D] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1769AA]/30 text-[#EAF3FB] border border-[#1769AA]/40 backdrop-blur-sm">
              <Building2 className="w-3.5 h-3.5" />
              <span>SGSITS Indore • Department of Information Technology</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ask Freely. <br className="hidden sm:inline" />
              <span className="text-[#60A5FA]">Learn Better.</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              An official academic classroom doubt platform for 2nd Year IT students and faculty.
              Submit questions anonymously during lectures, eliminate hesitation, and enable collective learning.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1769AA] text-white text-sm font-semibold shadow-sm hover:bg-[#155a91] transition-colors"
              >
                <MessageSquareShare className="w-4 h-4" />
                <span>Student Portal</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-white/10 text-white text-sm font-semibold border border-white/20 hover:bg-white/15 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Faculty Console</span>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto flex justify-center">
            <div className="bg-white/95 backdrop-blur rounded-lg p-6 text-[#172033] shadow-institutional-lg border border-slate-200 w-full max-w-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                <Image
                  src="/sgsits-logo.png"
                  alt="SGSITS"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <h3 className="font-bold text-sm text-[#0B1F3A]">Academic Service Gateway</h3>
                  <p className="text-xs text-[#667085]">Authoritative Timezone: Asia/Kolkata</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-[#667085] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#1769AA]" /> Academic Time:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {loadingHealth ? (
                      <span className="animate-pulse">Detecting...</span>
                    ) : health?.istTimestamp ? (
                      health.istTimestamp
                    ) : (
                      'IST (Asia/Kolkata)'
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-[#667085] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#198754]" /> Backend Health:
                  </span>
                  <span className="font-semibold text-[#198754] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {health?.status === 'healthy' ? 'Operational (200 OK)' : 'Ready'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-[#667085] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#D98C00]" /> Privacy Protocol:
                  </span>
                  <span className="font-medium text-[#1769AA] bg-[#EAF3FB] px-2 py-0.5 rounded text-[11px]">
                    Anonymous to Teacher
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Privacy & Architecture Features Preview */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="border-b border-slate-200 pb-4 mb-8">
          <h2 className="text-xl font-bold text-[#0B1F3A]">Platform Foundation & Principles</h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Built specifically for SGSITS IT 2nd Year Section B academic workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-institutional space-y-3">
            <div className="w-10 h-10 rounded-md bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0B1F3A]">Anonymous to Teacher</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Student identities are authenticated for accountability and spam prevention, but the
              teacher interface never exposes roll numbers, names, emails, or student IDs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-institutional space-y-3">
            <div className="w-10 h-10 rounded-md bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0B1F3A]">Auto Active Timetable</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Synchronized with the authoritative SGSITS timetable in Asia/Kolkata timezone.
              Handles parallel lab batches (B1, B2, B3) and detects live active lecture rooms automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-institutional space-y-3">
            <div className="w-10 h-10 rounded-md bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center">
              <MessageSquareShare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0B1F3A]">Real-time Socket.IO Queue</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Incoming questions appear instantly on the teacher screen without page reloads.
              Faculty can group similar doubts, answer privately, or publish to the entire class.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
