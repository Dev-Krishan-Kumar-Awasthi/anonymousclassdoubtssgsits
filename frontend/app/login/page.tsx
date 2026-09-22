'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Briefcase,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { authStorage, UserSession } from '@/lib/auth';

interface DemoAccount {
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  name: string;
  badge: string;
  email: string;
  identifier: string;
  description: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'demo' | 'standard'>('demo');
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);
  const [email, setEmail] = useState('krishan.awasthi@sgsits.ac.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Fetch demo accounts
    fetch(`${apiUrl}/api/auth/demo-accounts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDemoAccounts(data.data);
        }
      })
      .catch(() => {
        // Fallback default demo personas
        setDemoAccounts([
          {
            role: 'STUDENT',
            name: 'Krishan Awasthi',
            badge: 'IT 2nd Year • Section B • Batch B2',
            email: 'krishan.awasthi@sgsits.ac.in',
            identifier: 'krishan',
            description: 'Primary demo student for lecture doubts and practicals',
          },
          {
            role: 'STUDENT',
            name: 'Aarav Patel',
            badge: 'IT 2nd Year • Section B • Batch B1',
            email: 'student.b1@sgsits.ac.in',
            identifier: 'B1',
            description: 'Parallel Lab Batch B1 student',
          },
          {
            role: 'TEACHER',
            name: 'Faculty US',
            badge: 'Teacher Code: US',
            email: 'faculty.us@sgsits.ac.in',
            identifier: 'US',
            description: 'Teaches OOP Lecture (ATC-301) and OOP Lab',
          },
          {
            role: 'ADMIN',
            name: 'IT Department Admin',
            badge: 'Administrator',
            email: 'admin.it@sgsits.ac.in',
            identifier: 'admin',
            description: 'Full timetable, room, and moderation controls',
          },
        ]);
      });
  }, [apiUrl]);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Authentication failed');
      }

      const session: UserSession = json.data;
      authStorage.saveSession(session);
      setSuccessMsg(`Welcome, ${session.profile.fullName}!`);

      setTimeout(() => {
        if (session.user.role === 'STUDENT') router.push('/student');
        else if (session.user.role === 'TEACHER') router.push('/teacher');
        else router.push('/admin');
      }, 500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (account: DemoAccount) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${apiUrl}/api/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: account.role, identifier: account.identifier }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Demo login failed');
      }

      const session: UserSession = json.data;
      authStorage.saveSession(session);
      setSuccessMsg(`Logged in as ${account.name} (${account.role})`);

      setTimeout(() => {
        if (session.user.role === 'STUDENT') router.push('/student');
        else if (session.user.role === 'TEACHER') router.push('/teacher');
        else router.push('/admin');
      }, 500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 bg-[#F6F8FB]">
      <div className="w-full max-w-xl">
        {/* Institutional Demo Notice Banner */}
        <div className="mb-6 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-institutional">
          <ShieldAlert className="w-5 h-5 text-[#D98C00] flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Institutional Demo Environment: </span>
            You can sign in with pre-configured personas (Krishan Awasthi, Faculty US, Admin)
            with 1-click or use standard collegiate credentials.
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-institutional-md overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 text-center bg-gradient-to-b from-white to-slate-50">
            <div className="inline-block p-2 bg-white rounded-full shadow-sm border border-slate-200 mb-3">
              <Image
                src="/sgsits-logo.png"
                alt="SGSITS Indore"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-[#0B1F3A]">SGSITS Anonymous</h1>
            <p className="text-xs text-[#667085] mt-1">
              Department of Information Technology • Portal Authentication
            </p>

            {/* Tab switch */}
            <div className="mt-5 flex p-1 bg-slate-100 rounded-md max-w-xs mx-auto border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('demo')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
                  activeTab === 'demo'
                    ? 'bg-white text-[#1769AA] shadow-sm'
                    : 'text-[#667085] hover:text-slate-900'
                }`}
              >
                1-Click Demo Switcher
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('standard')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
                  activeTab === 'standard'
                    ? 'bg-white text-[#1769AA] shadow-sm'
                    : 'text-[#667085] hover:text-slate-900'
                }`}
              >
                Credential Login
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="m-6 mb-0 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="m-6 mb-0 p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Tab 1: 1-Click Demo Personas */}
          {activeTab === 'demo' && (
            <div className="p-6 space-y-4">
              <div className="text-xs text-[#667085] font-medium">
                Select a persona to test classroom interaction and realtime timetable logic:
              </div>

              <div className="space-y-2.5">
                {demoAccounts.map((account) => (
                  <button
                    key={`${account.role}-${account.identifier}`}
                    disabled={loading}
                    onClick={() => handleQuickDemoLogin(account)}
                    className="w-full text-left p-3.5 rounded-lg border border-slate-200 hover:border-[#1769AA] hover:bg-[#EAF3FB]/30 transition-all flex items-center justify-between group shadow-sm disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${
                          account.role === 'STUDENT'
                            ? 'bg-[#EAF3FB] text-[#1769AA]'
                            : account.role === 'TEACHER'
                            ? 'bg-amber-50 text-[#D98C00]'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {account.role === 'STUDENT' ? (
                          <GraduationCap className="w-5 h-5" />
                        ) : account.role === 'TEACHER' ? (
                          <Briefcase className="w-5 h-5" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#172033] group-hover:text-[#1769AA]">
                            {account.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {account.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#667085] font-medium">{account.badge}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{account.description}</p>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#1769AA] group-hover:text-white flex items-center justify-center text-slate-400 transition-colors flex-shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Standard Login */}
          {activeTab === 'standard' && (
            <form onSubmit={handleStandardLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-transparent bg-white"
                    placeholder="name@sgsits.ac.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1769AA] focus:border-transparent bg-white"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-[11px] text-[#667085] mt-1">
                  Default seed password: <code className="bg-slate-100 px-1 rounded">password123</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#1769AA] hover:bg-[#123B6D] text-white text-sm font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In with SGSITS Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-[11px] text-[#667085]">
              🔒 <strong>Privacy Assurance:</strong> Authentication is required for campus
              accountability, but your identity remains completely hidden from faculty when asking doubts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
