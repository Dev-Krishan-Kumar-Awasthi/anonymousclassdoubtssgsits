'use client';

import React, { useState } from 'react';
import { Check, Smile, Meh, Frown, HelpCircle, Activity } from 'lucide-react';
import { authStorage } from '@/lib/auth';

interface ClassPulseWidgetProps {
  classSessionId?: string;
  subjectCode?: string;
}

export const ClassPulseWidget: React.FC<ClassPulseWidgetProps> = ({
  classSessionId = 'sess-today',
  subjectCode = 'OOP',
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = authStorage.getToken();

  const handleRate = async (rating: 'FULLY' | 'MOSTLY' | 'PARTIAL' | 'NEED_REVISION') => {
    setSelected(rating);
    setLoading(true);

    try {
      await fetch(`${apiUrl}/api/doubts/pulse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          classSessionId,
          rating,
          subjectCode,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit pulse:', err);
    } finally {
      setLoading(false);
    }
  };

  const options = [
    {
      id: 'FULLY',
      label: 'Fully understood',
      icon: Smile,
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70',
      activeBadge: 'bg-emerald-600 text-white border-emerald-600',
    },
    {
      id: 'MOSTLY',
      label: 'Mostly understood',
      icon: Smile,
      badge: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/70',
      activeBadge: 'bg-[#1769AA] text-white border-[#1769AA]',
    },
    {
      id: 'PARTIAL',
      label: 'Partially understood',
      icon: Meh,
      badge: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/70',
      activeBadge: 'bg-[#D98C00] text-white border-[#D98C00]',
    },
    {
      id: 'NEED_REVISION',
      label: 'Need revision',
      icon: Frown,
      badge: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100/70',
      activeBadge: 'bg-[#C62828] text-white border-[#C62828]',
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-institutional">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#1769AA]" />
          <h4 className="text-xs font-bold text-[#0B1F3A]">Class Pulse • Quick Understanding Check</h4>
        </div>
        <span className="text-[11px] text-[#667085]">Anonymous Feedback</span>
      </div>

      <p className="text-xs text-slate-600 mb-3">
        How well did you understand the core concepts covered in today&apos;s lecture?
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isCurrent = selected === opt.id;
          return (
            <button
              key={opt.id}
              disabled={loading}
              onClick={() => handleRate(opt.id as 'FULLY' | 'MOSTLY' | 'PARTIAL' | 'NEED_REVISION')}
              className={`p-2.5 rounded-md border text-xs font-medium transition-all flex flex-col items-center gap-1.5 text-center ${
                isCurrent ? opt.activeBadge : opt.badge
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{opt.label}</span>
              {isCurrent && submitted && <Check className="w-3.5 h-3.5 mt-0.5" />}
            </button>
          );
        })}
      </div>

      {submitted && (
        <p className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
          <Check className="w-3 h-3" /> Thank you! Your anonymous pulse has been recorded for faculty insights.
        </p>
      )}

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#667085]">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> Aggregated percentages only
        </span>
        <span>Never linked to your name or roll number</span>
      </div>
    </div>
  );
};
