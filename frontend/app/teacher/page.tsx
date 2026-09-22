'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
  Pin,
  Send,
  Sparkles,
  BarChart3,
  Calendar,
  LogOut,
  Radio,
  Users,
  Check,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { authStorage, UserSession } from '@/lib/auth';
import { useSocket } from '@/hooks/useSocket';
import { TeacherAnswerModal } from '@/components/TeacherAnswerModal';
import { RoomChangeModal } from '@/components/RoomChangeModal';

interface DoubtCardData {
  id: string;
  referenceNo: string;
  subjectCode: string;
  text: string;
  normalizedText?: string;
  category: string;
  isWholeClass: boolean;
  status: 'PENDING' | 'ANSWERED' | 'PUBLISHED' | 'RESOLVED' | 'DISMISSED';
  isPinned: boolean;
  upvotes: number;
  createdAt: string;
  askedBy: string;
  responses?: Array<{
    id: string;
    teacherCode: string;
    answerText: string;
    isPublishedToClass: boolean;
    createdAt: string;
  }>;
}

interface CommonGroup {
  topicTitle: string;
  studentCount: number;
  doubtIds: string[];
  sampleQuestions: string[];
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<'live-doubts' | 'common-groups' | 'insights' | 'timetable'>('live-doubts');

  // Teacher Doubts state
  const [doubts, setDoubts] = useState<DoubtCardData[]>([]);
  const [commonGroups, setCommonGroups] = useState<CommonGroup[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, unanswered: 0, resolved: 0, common: 0 });
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PINNED' | 'ANSWERED'>('ALL');

  // Live Class state
  const [currentRoom, setCurrentRoom] = useState('ATC-301');
  const [isClassActive, setIsClassActive] = useState(true);
  const [insightsData, setInsightsData] = useState<{
    understandingScore: number;
    pulseStats: { fullyPct: number; mostlyPct: number; partialPct: number; needRevisionPct: number; total: number };
    mostDiscussedTopics: Array<{ topic: string; count: number }>;
  } | null>(null);

  // Modals state
  const [selectedDoubtForAnswer, setSelectedDoubtForAnswer] = useState<DoubtCardData | null>(null);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [newDoubtAlert, setNewDoubtAlert] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Check auth session
  useEffect(() => {
    const currentSession = authStorage.getSession();
    if (!currentSession || currentSession.user.role !== 'TEACHER') {
      // Auto demo teacher fallback (Faculty US)
      const defaultTeacher: UserSession = {
        user: { id: 'usr-teacher-us', email: 'faculty.us@sgsits.ac.in', role: 'TEACHER', isDemo: true },
        profile: {
          fullName: 'Faculty US',
          teacherCode: 'US',
          departmentCode: 'IT',
        },
        token: 'demo-teacher-token',
      };
      authStorage.saveSession(defaultTeacher);
      setSession(defaultTeacher);
    } else {
      setSession(currentSession);
    }
  }, []);

  // Fetch teacher live queue & groups
  const fetchLiveDoubts = useCallback(async () => {
    const token = authStorage.getToken();
    try {
      const res = await fetch(`${apiUrl}/api/teacher/live-doubts?subjectCode=OOP`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setDoubts(json.data.doubts);
        setCommonGroups(json.data.commonTopicGroups);
        setMetrics(json.data.metrics);
      }
    } catch (err) {
      console.error('Error fetching live doubts:', err);
    }
  }, [apiUrl]);

  // Fetch insights
  const fetchInsights = useCallback(async () => {
    const token = authStorage.getToken();
    try {
      const res = await fetch(`${apiUrl}/api/teacher/insights?subjectCode=OOP`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setInsightsData(json.data);
    } catch (err) {
      console.error('Error fetching insights:', err);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (session) {
      fetchLiveDoubts();
      fetchInsights();
    }
  }, [session, fetchLiveDoubts, fetchInsights]);

  // Socket.IO realtime listener for incoming doubts and pulse updates
  useSocket('OOP', session?.user.id, {
    onNewDoubt: (data: unknown) => {
      fetchLiveDoubts();
      const ref = (data as { referenceNo?: string })?.referenceNo || 'New Question';
      setNewDoubtAlert(`Live incoming doubt received: ${ref}`);
      setTimeout(() => setNewDoubtAlert(null), 6000);
    },
  });

  const handleResolve = async (doubtId: string) => {
    const token = authStorage.getToken();
    try {
      await fetch(`${apiUrl}/api/teacher/doubts/${doubtId}/resolve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLiveDoubts();
    } catch (err) {
      console.error('Error resolving doubt:', err);
    }
  };

  const handleDismiss = async (doubtId: string) => {
    const token = authStorage.getToken();
    try {
      await fetch(`${apiUrl}/api/teacher/doubts/${doubtId}/dismiss`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLiveDoubts();
    } catch (err) {
      console.error('Error dismissing doubt:', err);
    }
  };

  const handleTogglePin = async (doubtId: string) => {
    const token = authStorage.getToken();
    try {
      await fetch(`${apiUrl}/api/teacher/doubts/${doubtId}/pin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLiveDoubts();
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  };

  const handleLogout = () => {
    authStorage.clearSession();
    router.push('/login');
  };

  const filteredDoubts = doubts.filter((d) => {
    if (filter === 'PENDING') return d.status === 'PENDING';
    if (filter === 'PINNED') return d.isPinned;
    if (filter === 'ANSWERED') return d.status === 'ANSWERED' || d.status === 'PUBLISHED';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#F6F8FB]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shadow-institutional flex-shrink-0">
        <div>
          {/* Teacher Profile Card */}
          <div className="p-4 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-bold">
                {session?.profile.teacherCode || 'US'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-sm text-[#0B1F3A] truncate">
                  {session?.profile.fullName || 'Faculty US'}
                </h2>
                <p className="text-[11px] text-[#667085] truncate">
                  Teacher Code: <strong>{session?.profile.teacherCode || 'US'}</strong>
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              <span>Department of IT</span>
              <span className="bg-[#1769AA] text-white px-1.5 py-0.2 rounded text-[10px]">
                Faculty Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('live-doubts')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'live-doubts'
                  ? 'bg-[#1769AA] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4" />
                <span>Live Classroom Doubts</span>
              </div>
              {metrics.unanswered > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                  {metrics.unanswered}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('common-groups')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'common-groups'
                  ? 'bg-[#1769AA] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Topic Clusters & Groups</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-800">
                {commonGroups.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('insights')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'insights'
                  ? 'bg-[#1769AA] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Class Insights & Pulse</span>
              </div>
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
                <span>My Teaching Schedule</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sign Out */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
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

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Realtime Incoming Doubt Toast Notification */}
        {newDoubtAlert && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-institutional animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{newDoubtAlert}</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-normal">Real-Time Update (No refresh)</span>
          </div>
        )}

        {/* Current Class Live Control Banner */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-[#0B1F3A] to-[#123B6D] text-white shadow-institutional-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                YOUR CLASS IS LIVE
              </span>
              <span className="text-xs text-slate-300">
                IT 2nd Year • Section B • Asia/Kolkata
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Object Oriented Programming (OOP)
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#60A5FA]" /> 11:00 AM – 12:00 PM
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#60A5FA]" /> Room:{' '}
                <strong className="text-white underline">{currentRoom}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#60A5FA]" /> Enrolled: 74 Students
              </span>
            </div>
          </div>

          {/* Quick Session Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsRoomModalOpen(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-md border border-white/20 transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Change Room</span>
            </button>

            <button
              type="button"
              onClick={() => setIsClassActive(!isClassActive)}
              className={`px-4 py-2 text-xs font-bold rounded-md shadow-sm transition-all ${
                isClassActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isClassActive ? 'End Live Session' : 'Start Live Session'}
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-institutional">
            <div className="text-xs font-semibold text-[#667085]">Total Doubts</div>
            <div className="text-2xl font-black text-[#0B1F3A] mt-1">{metrics.total}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Submitted anonymously</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-institutional">
            <div className="text-xs font-semibold text-[#D98C00]">Unanswered Queue</div>
            <div className="text-2xl font-black text-[#D98C00] mt-1">{metrics.unanswered}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Awaiting explanation</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-institutional">
            <div className="text-xs font-semibold text-[#198754]">Resolved Doubts</div>
            <div className="text-2xl font-black text-[#198754] mt-1">{metrics.resolved}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Answered or solved</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-institutional">
            <div className="text-xs font-semibold text-[#1769AA]">Common / Published</div>
            <div className="text-2xl font-black text-[#1769AA] mt-1">{metrics.common}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Shared with whole class</div>
          </div>
        </div>

        {/* Tab 1: Live Doubts Queue */}
        {activeTab === 'live-doubts' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1F3A]">Live Anonymous Incoming Doubts</h2>
                <p className="text-xs text-[#667085]">
                  Student identities are strictly masked. Questions update automatically via Socket.IO.
                </p>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
                {(['ALL', 'PENDING', 'PINNED', 'ANSWERED'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2.5 py-1 rounded font-semibold text-[11px] transition-all ${
                      filter === f ? 'bg-white text-[#1769AA] shadow-sm' : 'text-[#667085] hover:text-slate-900'
                    }`}
                  >
                    {f === 'ALL' ? 'All Doubts' : f === 'PENDING' ? 'Unanswered' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Doubts List */}
            <div className="space-y-3">
              {filteredDoubts.length === 0 ? (
                <div className="py-12 bg-white rounded-lg border border-slate-200 text-center p-6 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-sm text-[#0B1F3A]">No doubts in this filter</h4>
                  <p className="text-xs text-[#667085]">
                    All incoming student questions have been addressed or resolved.
                  </p>
                </div>
              ) : (
                filteredDoubts.map((doubt) => (
                  <div
                    key={doubt.id}
                    className={`p-5 rounded-lg border bg-white shadow-institutional space-y-3 transition-all ${
                      doubt.isPinned ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {doubt.isPinned && (
                          <span className="p-1 rounded bg-amber-100 text-amber-800" title="Pinned Doubt">
                            <Pin className="w-3 h-3 fill-amber-700 text-amber-700" />
                          </span>
                        )}
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {doubt.referenceNo}
                        </span>
                        <span className="font-semibold text-slate-700">❓ {doubt.askedBy}</span>
                        <span className="text-slate-300">•</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                          {doubt.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          👍 {doubt.upvotes} students
                        </span>
                        {doubt.status === 'PENDING' ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Unanswered
                          </span>
                        ) : doubt.status === 'PUBLISHED' ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            Published to Class
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Answered
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-semibold text-[#0B1F3A] leading-relaxed">
                        &ldquo;{doubt.text}&rdquo;
                      </h3>
                      {doubt.normalizedText && (
                        <p className="text-xs text-[#1769AA] flex items-center gap-1.5 pt-0.5">
                          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Normalized topic: {doubt.normalizedText}</span>
                        </p>
                      )}
                    </div>

                    {/* Responses already given */}
                    {doubt.responses && doubt.responses.length > 0 && (
                      <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1 text-xs">
                        <div className="font-bold text-slate-800">Your Answer:</div>
                        <p className="text-slate-700">{doubt.responses[0].answerText}</p>
                      </div>
                    )}

                    {/* Teacher Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[11px] text-[#667085]">
                        Received 2 min ago • Section B
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePin(doubt.id)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                        >
                          {doubt.isPinned ? 'Unpin' : 'Pin'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDismiss(doubt.id)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                        >
                          Dismiss
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResolve(doubt.id)}
                          className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Resolve</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDoubtForAnswer(doubt);
                            setIsAnswerModalOpen(true);
                          }}
                          className="px-4 py-1.5 bg-[#1769AA] hover:bg-[#123B6D] text-white font-semibold rounded shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Answer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Topic Clusters & Groups */}
        {activeTab === 'common-groups' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0B1F3A]">
                Common Doubt Topic Detection & Clustering
              </h2>
              <p className="text-xs text-[#667085]">
                Intelligently groups similar doubts asked by multiple students so you can answer once for the entire class.
              </p>
            </div>

            <div className="space-y-4">
              {commonGroups.map((group, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg bg-white border border-slate-200 shadow-institutional space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md bg-[#EAF3FB] text-[#1769AA] flex items-center justify-center font-bold text-xs">
                        #{idx + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-[#0B1F3A]">
                          {group.topicTitle}
                        </h3>
                        <p className="text-[11px] text-[#667085]">
                          {group.studentCount} students asked or upvoted questions on this topic
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const sampleDoubt = doubts.find((d) => group.doubtIds.includes(d.id)) || doubts[0];
                        setSelectedDoubtForAnswer(sampleDoubt);
                        setIsAnswerModalOpen(true);
                      }}
                      className="px-4 py-1.5 bg-[#1769AA] hover:bg-[#123B6D] text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Answer Once for Class</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700">Sample Student Inquiries:</div>
                    <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                      {group.sampleQuestions.map((q, qIdx) => (
                        <li key={qIdx}>&ldquo;{q}&rdquo;</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Insights & Class Pulse */}
        {activeTab === 'insights' && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0B1F3A]">Classroom Analytics & Pulse Insights</h2>
                <p className="text-xs text-[#667085]">
                  Calculated from genuine anonymous student doubts and end-of-lecture Class Pulse ratings.
                </p>
              </div>
              <button
                onClick={fetchInsights}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Overall Understanding Index Card */}
            <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-institutional flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Academic Health Index</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F3A]">
                  Class Understanding Score: {insightsData?.understandingScore || 85}%
                </h3>
                <p className="text-xs text-[#667085] max-w-lg leading-relaxed">
                  Based on aggregated student pulse responses for today&apos;s Object Oriented Programming lecture.
                </p>
              </div>

              {/* Progress Ring / Percentage */}
              <div className="w-24 h-24 rounded-full border-4 border-[#1769AA] flex flex-col items-center justify-center text-center bg-[#EAF3FB]/30">
                <span className="text-2xl font-black text-[#0B1F3A]">{insightsData?.understandingScore || 85}%</span>
                <span className="text-[10px] text-[#667085] font-semibold">Positive</span>
              </div>
            </div>

            {/* Pulse Distribution Breakdown */}
            <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-institutional space-y-3">
              <h4 className="font-bold text-sm text-[#0B1F3A]">
                Class Pulse Breakdown ({insightsData?.pulseStats.total || 3} Responses)
              </h4>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 font-semibold mb-1">
                    <span>🟢 Fully Understood</span>
                    <span>{insightsData?.pulseStats.fullyPct || 42}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${insightsData?.pulseStats.fullyPct || 42}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-semibold mb-1">
                    <span>🟡 Mostly Understood</span>
                    <span>{insightsData?.pulseStats.mostlyPct || 31}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${insightsData?.pulseStats.mostlyPct || 31}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-semibold mb-1">
                    <span>🟠 Partially Understood</span>
                    <span>{insightsData?.pulseStats.partialPct || 18}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${insightsData?.pulseStats.partialPct || 18}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-semibold mb-1">
                    <span>🔴 Need Revision</span>
                    <span>{insightsData?.pulseStats.needRevisionPct || 9}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-600 rounded-full"
                      style={{ width: `${insightsData?.pulseStats.needRevisionPct || 9}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Most Discussed Topics */}
            <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-institutional space-y-3">
              <h4 className="font-bold text-sm text-[#0B1F3A]">Most Discussed Topics This Week</h4>
              <div className="space-y-2">
                {insightsData?.mostDiscussedTopics.map((topic, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800">
                      {i + 1}. {topic.topic}
                    </span>
                    <span className="font-bold text-[#1769AA]">{topic.count} questions</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Faculty Timetable */}
        {activeTab === 'timetable' && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-[#0B1F3A]">My Teaching Assignments (Faculty US)</h2>
              <p className="text-xs text-[#667085]">
                Object Oriented Programming Lecture & Laboratory Sessions
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-institutional space-y-3">
              <div className="p-3 rounded-md border border-[#1769AA] bg-[#EAF3FB] text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#0B1F3A]">Monday 11:00 AM – 12:00 PM</span>
                  <div className="text-slate-600 mt-0.5">OOP Lecture • Section B • Room ATC-301</div>
                </div>
                <span className="px-2 py-0.5 bg-rose-600 text-white font-bold rounded text-[10px] animate-pulse">
                  CURRENT LIVE SLOT
                </span>
              </div>

              <div className="p-3 rounded-md border border-slate-200 bg-slate-50 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">Monday 02:00 PM – 04:00 PM</span>
                  <div className="text-slate-600 mt-0.5">OOP Lab • Batch B3 • Room Lab207 (with VM)</div>
                </div>
                <span className="text-slate-500 font-medium">Practical</span>
              </div>

              <div className="p-3 rounded-md border border-slate-200 bg-slate-50 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">Wednesday 10:00 AM – 12:00 PM</span>
                  <div className="text-slate-600 mt-0.5">OOP Lab • Batch B1 • Room Lab207 (with VM)</div>
                </div>
                <span className="text-slate-500 font-medium">Practical</span>
              </div>

              <div className="p-3 rounded-md border border-slate-200 bg-slate-50 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">Wednesday 04:00 PM – 05:00 PM</span>
                  <div className="text-slate-600 mt-0.5">OOP Lecture • Section B • Room LT-002</div>
                </div>
                <span className="text-slate-500 font-medium">Lecture</span>
              </div>

              <div className="p-3 rounded-md border border-slate-200 bg-slate-50 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">Thursday 11:00 AM – 12:00 PM</span>
                  <div className="text-slate-600 mt-0.5">OOP Lecture • Section B • Room ATC-309</div>
                </div>
                <span className="text-slate-500 font-medium">Lecture</span>
              </div>

              <div className="p-3 rounded-md border border-slate-200 bg-slate-50 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">Friday 04:00 PM – 06:00 PM</span>
                  <div className="text-slate-600 mt-0.5">OOP Lab • Batch B2 • Room Lab207 (with VM)</div>
                </div>
                <span className="text-slate-500 font-medium">Practical</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Answer Modal */}
      <TeacherAnswerModal
        isOpen={isAnswerModalOpen}
        onClose={() => {
          setIsAnswerModalOpen(false);
          setSelectedDoubtForAnswer(null);
        }}
        doubt={selectedDoubtForAnswer}
        onAnswerSubmitted={() => {
          fetchLiveDoubts();
        }}
      />

      {/* Room Change Modal */}
      <RoomChangeModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        subjectCode="OOP"
        currentRoom={currentRoom}
        onRoomChanged={(newRoom) => {
          setCurrentRoom(newRoom);
        }}
      />
    </div>
  );
}
