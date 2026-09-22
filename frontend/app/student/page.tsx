'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Clock,
  MapPin,
  User,
  PlusCircle,
  CheckCircle2,
  Calendar,
  ThumbsUp,
  AlertTriangle,
  RefreshCw,
  LogOut,
  GraduationCap,
  Sparkles,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { authStorage, UserSession } from '@/lib/auth';
import { useSocket } from '@/hooks/useSocket';
import { AskDoubtModal } from '@/components/AskDoubtModal';
import { ClassPulseWidget } from '@/components/ClassPulseWidget';

interface TimetableEntry {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  isLab: boolean;
  section: string;
  batch?: string;
  teacherCodes: string[];
  roomNumber: string;
}

interface ActiveClassData {
  entry: TimetableEntry | null;
  statusInfo: {
    status: 'UPCOMING' | 'STARTING_SOON' | 'LIVE' | 'COMPLETED';
    isLive: boolean;
    isStartingSoon: boolean;
    minutesRemaining?: number;
    minutesUntilStart?: number;
  };
  nextEntry: TimetableEntry | null;
  academicTime: {
    dayOfWeek: string;
    timeString: string;
    currentMinutes: number;
    timezone: string;
    isSimulated: boolean;
  };
}

interface DoubtItem {
  id: string;
  referenceNo: string;
  subjectCode: string;
  text: string;
  normalizedText?: string;
  category: string;
  isWholeClass: boolean;
  status: 'PENDING' | 'ANSWERED' | 'PUBLISHED' | 'RESOLVED';
  isPinned: boolean;
  upvotes: number;
  createdAt: string;
  askedBy?: string;
  responses?: Array<{
    id: string;
    teacherCode: string;
    answerText: string;
    isPublishedToClass: boolean;
    createdAt: string;
  }>;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'my-doubts' | 'common' | 'timetable'>('dashboard');

  // Timetable state
  const [activeClass, setActiveClass] = useState<ActiveClassData | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<TimetableEntry[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, TimetableEntry[]>>({});

  // Doubts state
  const [myDoubts, setMyDoubts] = useState<DoubtItem[]>([]);
  const [commonDoubts, setCommonDoubts] = useState<DoubtItem[]>([]);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  // Realtime alerts & simulation
  const [roomChangeAlert, setRoomChangeAlert] = useState<{
    subjectCode: string;
    oldRoom: string;
    newRoom: string;
  } | null>(null);
  const [simulatedSlot, setSimulatedSlot] = useState<string>('real');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Check auth session
  useEffect(() => {
    const currentSession = authStorage.getSession();
    if (!currentSession) {
      // Auto demo student fallback
      const defaultStudent: UserSession = {
        user: { id: 'usr-student-krishan', email: 'krishan.awasthi@sgsits.ac.in', role: 'STUDENT', isDemo: true },
        profile: {
          fullName: 'Krishan Awasthi',
          rollNumber: '0801IT221045',
          departmentCode: 'IT',
          academicYear: '2nd Year',
          section: 'B',
          batch: 'B2',
        },
        token: 'demo-token',
      };
      authStorage.saveSession(defaultStudent);
      setSession(defaultStudent);
    } else {
      setSession(currentSession);
    }
  }, []);

  // Fetch current active class and schedule
  const fetchTimetable = useCallback(async (simTimeParam?: string) => {
    try {
      const studentBatch = session?.profile.batch || 'B2';
      let currentUrl = `${apiUrl}/api/timetable/current-class?batch=${studentBatch}`;
      let todayUrl = `${apiUrl}/api/timetable/today?batch=${studentBatch}`;

      if (simTimeParam && simTimeParam !== 'real') {
        currentUrl += `&simulatedTime=${encodeURIComponent(simTimeParam)}`;
        todayUrl += `&simulatedTime=${encodeURIComponent(simTimeParam)}`;
      }

      const [curRes, todRes] = await Promise.all([
        fetch(currentUrl),
        fetch(todayUrl),
      ]);

      const curData = await curRes.json();
      const todData = await todRes.json();

      if (curData.success) setActiveClass(curData.data);
      if (todData.success) setTodaySchedule(todData.data.entries);
    } catch (err) {
      console.error('Error fetching timetable:', err);
    }
  }, [apiUrl, session?.profile.batch]);

  // Fetch student doubts
  const fetchMyDoubts = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/api/doubts/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMyDoubts(data.data);
    } catch (err) {
      console.error('Error fetching my doubts:', err);
    }
  }, [apiUrl]);

  // Fetch common class doubts
  const fetchCommonDoubts = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/doubts/common?subjectCode=OOP`);
      const data = await res.json();
      if (data.success) setCommonDoubts(data.data);
    } catch (err) {
      console.error('Error fetching common doubts:', err);
    }
  }, [apiUrl]);

  // Fetch weekly schedule
  const fetchWeekly = useCallback(async () => {
    try {
      const studentBatch = session?.profile.batch || 'B2';
      const res = await fetch(`${apiUrl}/api/timetable/weekly?batch=${studentBatch}`);
      const data = await res.json();
      if (data.success) setWeeklySchedule(data.data);
    } catch (err) {
      console.error('Error fetching weekly:', err);
    }
  }, [apiUrl, session?.profile.batch]);

  useEffect(() => {
    if (session) {
      fetchTimetable();
      fetchMyDoubts();
      fetchCommonDoubts();
      fetchWeekly();
    }
  }, [session, fetchTimetable, fetchMyDoubts, fetchCommonDoubts, fetchWeekly]);

  // Socket.IO realtime connection
  useSocket(
    activeClass?.entry?.subjectCode || 'OOP',
    session?.user.id,
    {
      onDoubtAnswered: () => {
        fetchMyDoubts();
        fetchCommonDoubts();
      },
      onRoomChanged: (data) => {
        setRoomChangeAlert(data);
      },
      onDoubtPublished: () => {
        fetchCommonDoubts();
      },
    }
  );

  const handleSimulateChange = (val: string) => {
    setSimulatedSlot(val);
    if (val === 'real') {
      fetchTimetable();
    } else {
      fetchTimetable(val);
    }
  };

  const handleUpvote = async (doubtId: string) => {
    const token = authStorage.getToken();
    try {
      const res = await fetch(`${apiUrl}/api/doubts/${doubtId}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCommonDoubts((prev) =>
          prev.map((d) => (d.id === doubtId ? { ...d, upvotes: d.upvotes + 1 } : d))
        );
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleLogout = () => {
    authStorage.clearSession();
    router.push('/login');
  };

  const activeEntry = activeClass?.entry;
  const isLive = activeClass?.statusInfo.isLive;
  const isStartingSoon = activeClass?.statusInfo.isStartingSoon;

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#F6F8FB]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shadow-institutional flex-shrink-0">
        <div>
          {/* Student Profile Info Card */}
          <div className="p-4 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EAF3FB] border border-[#1769AA]/30 flex items-center justify-center text-[#1769AA]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-sm text-[#0B1F3A] truncate">
                  {session?.profile.fullName || 'Krishan Awasthi'}
                </h2>
                <p className="text-[11px] text-[#667085] truncate">
                  Roll: {session?.profile.rollNumber || '0801IT221045'}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded border border-slate-200">
              <span>IT • 2nd Year • Section B</span>
              <span className="bg-[#1769AA] text-white px-1.5 py-0.2 rounded text-[10px]">
                Batch {session?.profile.batch || 'B2'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[#1769AA] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span>Classroom Dashboard</span>
              </div>
              {isLive && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('my-doubts')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'my-doubts'
                  ? 'bg-[#1769AA] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>My Anonymous Doubts</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-800">
                {myDoubts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('common')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'common'
                  ? 'bg-[#1769AA] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Common Class Doubts</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-800">
                {commonDoubts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('timetable')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'timetable'
                  ? 'bg-[#1769AA] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Weekly Timetable</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar: Time Simulation & Signout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-3">
          {/* Time simulation selector for grading / test */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#0B1F3A]">
              <span>Time Simulator</span>
              <span className="text-[10px] font-normal text-amber-700 bg-amber-100 px-1 rounded">Dev Mode</span>
            </div>
            <select
              value={simulatedSlot}
              onChange={(e) => handleSimulateChange(e.target.value)}
              className="w-full text-[11px] p-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1769AA]"
            >
              <option value="real">Real Time (IST Authoritative)</option>
              <option value="2026-09-28T06:00:00Z">Mon 11:30 AM → OOP Live (ATC-301)</option>
              <option value="2026-09-28T05:22:00Z">Mon 10:52 AM → OOP Starting Soon</option>
              <option value="2026-09-28T09:00:00Z">Mon 02:30 PM → DS Lab B2 Live (LAB105)</option>
              <option value="2026-09-29T05:00:00Z">Tue 10:30 AM → Linux Lab B2 (Lab204)</option>
              <option value="2026-09-30T10:00:00Z">Wed 03:30 PM → COA Live (LT-002)</option>
              <option value="2026-09-27T05:30:00Z">Sun 11:00 AM → Free Time</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-1.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded border border-rose-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Classroom Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Realtime Room Change Alert Banner */}
        {roomChangeAlert && (
          <div className="p-4 rounded-lg bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-center justify-between shadow-institutional animate-bounce">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-[#D98C00] flex-shrink-0" />
              <div>
                <span className="font-extrabold text-sm uppercase tracking-wide">
                  ⚠️ Lecture Room Changed in Real-Time:
                </span>
                <p className="text-xs mt-0.5">
                  Your class for <strong>{roomChangeAlert.subjectCode}</strong> has been moved to{' '}
                  <span className="font-bold text-[#0B1F3A] underline text-sm">
                    {roomChangeAlert.newRoom}
                  </span>{' '}
                  (Previous: {roomChangeAlert.oldRoom}). Please proceed to {roomChangeAlert.newRoom}.
                </p>
              </div>
            </div>
            <button
              onClick={() => setRoomChangeAlert(null)}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-200 text-amber-900 hover:bg-amber-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Greeting & Academic Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                  Good Morning, {session?.profile.fullName?.split(' ')[0] || 'Krishan'}
                </h1>
                <p className="text-xs text-[#667085] mt-0.5">
                  Information Technology • 2nd Year • Section B • Laboratory Batch {session?.profile.batch || 'B2'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="text-right text-xs bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                  <div className="text-[#667085]">Academic Clock (IST)</div>
                  <div className="font-bold text-[#0B1F3A]">
                    {activeClass?.academicTime.dayOfWeek || 'MONDAY'} •{' '}
                    {activeClass?.academicTime.timeString || '11:00 AM'}
                  </div>
                </div>
                <button
                  onClick={() => fetchTimetable(simulatedSlot)}
                  title="Sync Timetable"
                  className="p-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Active Class Card */}
            <div
              className={`p-6 rounded-xl border shadow-institutional-md relative overflow-hidden transition-all ${
                isLive
                  ? 'bg-gradient-to-br from-[#0B1F3A] to-[#123B6D] text-white border-blue-900'
                  : isStartingSoon
                  ? 'bg-gradient-to-br from-amber-900/90 to-amber-950 text-white border-amber-800'
                  : 'bg-white text-[#172033] border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3">
                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white tracking-wide shadow-sm animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        LIVE NOW
                      </span>
                    ) : isStartingSoon ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white tracking-wide">
                        <Clock className="w-3.5 h-3.5" />
                        STARTS IN {activeClass?.statusInfo.minutesUntilStart} MINS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <Clock className="w-3.5 h-3.5" />
                        CURRENTLY FREE
                      </span>
                    )}

                    {activeEntry?.isLab && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                        PRACTICAL LAB (Batch {activeEntry.batch})
                      </span>
                    )}
                  </div>

                  {/* Subject Name & Code */}
                  {activeEntry ? (
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        {activeEntry.subjectName}
                      </h2>
                      <p className="text-xs text-slate-300 mt-1">
                        Code: <strong>{activeEntry.subjectCode}</strong> • Section {activeEntry.section}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        No Class Currently Active
                      </h2>
                      <p className="text-xs text-[#667085] mt-1">
                        Enjoy your break. You can review past doubts or prepare for your upcoming lecture.
                      </p>
                    </div>
                  )}

                  {/* Metadata Row */}
                  {activeEntry && (
                    <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#60A5FA]" />
                        <span>
                          {activeEntry.startTime} – {activeEntry.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#60A5FA]" />
                        <span className="font-semibold">{activeEntry.roomNumber}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#60A5FA]" />
                        <span>
                          Faculty:{' '}
                          <strong className="text-white">
                            {activeEntry.teacherCodes.join(', ')}
                          </strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Action CTA: Ask Anonymous Doubt */}
                <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(true)}
                    className="px-6 py-3 rounded-lg bg-[#1769AA] hover:bg-[#155a91] text-white text-sm font-bold shadow-institutional-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Ask Anonymous Doubt</span>
                  </button>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Identity 100% hidden from faculty
                  </p>
                </div>
              </div>
            </div>

            {/* Next Up Banner */}
            {activeClass?.nextEntry && (
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-institutional flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded font-bold bg-[#EAF3FB] text-[#1769AA] text-[11px]">
                    NEXT UP
                  </span>
                  <span className="font-semibold text-[#0B1F3A]">
                    {activeClass.nextEntry.subjectName} ({activeClass.nextEntry.subjectCode})
                  </span>
                  <span className="text-[#667085]">
                    • Starts at {activeClass.nextEntry.startTime} in {activeClass.nextEntry.roomNumber}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            )}

            {/* Class Pulse Interactive Widget */}
            <ClassPulseWidget
              subjectCode={activeEntry?.subjectCode || 'OOP'}
              classSessionId="sess-today"
            />

            {/* Today's Schedule Overview */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-institutional p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1769AA]" />
                  <h3 className="font-bold text-sm text-[#0B1F3A]">
                    Today&apos;s Schedule (Section B • Batch {session?.profile.batch || 'B2'})
                  </h3>
                </div>
                <span className="text-xs text-[#667085]">Parallel Labs Filtered</span>
              </div>

              <div className="space-y-2">
                {todaySchedule.length === 0 ? (
                  <p className="text-xs text-[#667085] py-4 text-center">
                    No classes scheduled for today in initial seed data.
                  </p>
                ) : (
                  todaySchedule.map((item) => {
                    const isItemLive = activeEntry?.id === item.id && isLive;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-md border text-xs flex items-center justify-between transition-colors ${
                          isItemLive
                            ? 'bg-[#EAF3FB] border-[#1769AA] font-semibold'
                            : 'bg-slate-50/70 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-20 font-mono text-slate-700">
                            {item.startTime}
                          </span>
                          <span className="font-bold text-[#0B1F3A]">
                            {item.subjectName}
                          </span>
                          {item.isLab && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-800">
                              Lab {item.batch}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-slate-600">
                          <span>Room: <strong className="text-slate-800">{item.roomNumber}</strong></span>
                          <span>Faculty: {item.teacherCodes.join(', ')}</span>
                          {isItemLive && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-600 text-white font-bold animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Doubts */}
        {activeTab === 'my-doubts' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#0B1F3A]">My Submitted Doubts</h2>
                <p className="text-xs text-[#667085]">
                  Only you can see this list. Your identity is hidden from your teacher.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAskModalOpen(true)}
                className="px-4 py-2 bg-[#1769AA] text-white text-xs font-semibold rounded-md flex items-center gap-2 hover:bg-[#123B6D] transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ask New Doubt</span>
              </button>
            </div>

            {myDoubts.length === 0 ? (
              <div className="py-12 bg-white rounded-lg border border-slate-200 text-center p-6 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-sm text-[#0B1F3A]">No doubts submitted yet</h4>
                <p className="text-xs text-[#667085]">
                  Click &ldquo;Ask New Doubt&rdquo; to submit an anonymous question to your faculty during class.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myDoubts.map((doubt) => (
                  <div
                    key={doubt.id}
                    className="p-4 bg-white rounded-lg border border-slate-200 shadow-institutional space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0B1F3A] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {doubt.referenceNo}
                        </span>
                        <span className="font-semibold text-[#1769AA]">
                          {doubt.subjectCode}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[#667085]">{doubt.category}</span>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {doubt.status === 'PENDING' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            🟡 Waiting for response
                          </span>
                        )}
                        {doubt.status === 'ANSWERED' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            🟢 Answered Privately
                          </span>
                        )}
                        {doubt.status === 'PUBLISHED' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            ⭐ Published to Class
                          </span>
                        )}
                        {doubt.status === 'RESOLVED' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#172033] font-medium leading-relaxed">
                      &ldquo;{doubt.text}&rdquo;
                    </p>

                    {/* Teacher Answers */}
                    {doubt.responses && doubt.responses.length > 0 && (
                      <div className="p-3 bg-[#EAF3FB]/60 border border-[#1769AA]/20 rounded-md space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 font-bold text-[#0B1F3A]">
                          <CheckCircle2 className="w-4 h-4 text-[#1769AA]" />
                          <span>Teacher Response (Faculty {doubt.responses[0].teacherCode}):</span>
                        </div>
                        <p className="text-slate-800 pl-6 leading-relaxed">
                          {doubt.responses[0].answerText}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Common Class Doubts */}
        {activeTab === 'common' && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-[#0B1F3A]">Common Class Doubts & Live Q&A</h2>
              <p className="text-xs text-[#667085]">
                Doubts answered publicly by faculty for collective class learning. Upvote questions you share.
              </p>
            </div>

            <div className="space-y-3">
              {commonDoubts.map((doubt) => (
                <div
                  key={doubt.id}
                  className="p-5 bg-white rounded-lg border border-slate-200 shadow-institutional space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {doubt.referenceNo}
                      </span>
                      <span className="font-bold text-[#1769AA]">{doubt.subjectCode}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[#667085]">Asked by: Anonymous Student</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUpvote(doubt.id)}
                      className="px-2.5 py-1 rounded border border-slate-200 hover:border-[#1769AA] hover:bg-[#EAF3FB] text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-[#1769AA]" />
                      <span>{doubt.upvotes}</span>
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-[#0B1F3A]">
                    &ldquo;{doubt.text}&rdquo;
                  </h3>

                  {doubt.responses && doubt.responses.length > 0 && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1 text-xs">
                      <div className="font-bold text-[#1769AA] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Teacher Answer (Faculty {doubt.responses[0].teacherCode}):</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {doubt.responses[0].answerText}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Weekly Timetable Grid */}
        {activeTab === 'timetable' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-[#0B1F3A]">Weekly Academic Timetable</h2>
              <p className="text-xs text-[#667085]">
                SGSITS Indore • Department of Information Technology • 2nd Year • Section B (Batch {session?.profile.batch || 'B2'})
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map((day) => {
                const dayEntries = weeklySchedule[day] || [];
                return (
                  <div key={day} className="bg-white rounded-lg border border-slate-200 p-3 space-y-2 shadow-institutional">
                    <div className="font-bold text-xs text-[#0B1F3A] border-b border-slate-100 pb-1 uppercase tracking-wide">
                      {day}
                    </div>
                    <div className="space-y-2">
                      {dayEntries.length === 0 ? (
                        <p className="text-[11px] text-[#667085] py-2 text-center">No classes</p>
                      ) : (
                        dayEntries.map((e) => (
                          <div
                            key={e.id}
                            className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] space-y-0.5"
                          >
                            <div className="font-bold text-[#0B1F3A] truncate">{e.subjectCode}</div>
                            <div className="text-[#667085]">{e.startTime} - {e.endTime}</div>
                            <div className="text-slate-600 flex justify-between">
                              <span>{e.roomNumber}</span>
                              <span className="font-semibold">{e.teacherCodes.join(',')}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Ask Anonymous Doubt Modal Dialog */}
      <AskDoubtModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        subjectCode={activeEntry?.subjectCode || 'OOP'}
        subjectName={activeEntry?.subjectName || 'Object Oriented Programming'}
        roomNumber={activeEntry?.roomNumber || 'ATC-301'}
        teacherCodes={activeEntry?.teacherCodes || ['US']}
        onDoubtSubmitted={() => {
          fetchMyDoubts();
        }}
      />
    </div>
  );
}
