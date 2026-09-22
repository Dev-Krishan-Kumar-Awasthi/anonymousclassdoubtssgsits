'use client';

import React, { useState } from 'react';
import { X, MapPin, Radio, AlertTriangle } from 'lucide-react';
import { authStorage } from '@/lib/auth';

interface RoomChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectCode: string;
  currentRoom: string;
  onRoomChanged: (newRoom: string) => void;
}

const AVAILABLE_ROOMS = [
  'ATC-301',
  'ATC-305',
  'ATC-309',
  'LT-201',
  'LT-002',
  'LAB105',
  'Lab204',
  'Lab206',
  'Lab207',
];

export const RoomChangeModal: React.FC<RoomChangeModalProps> = ({
  isOpen,
  onClose,
  subjectCode,
  currentRoom,
  onRoomChanged,
}) => {
  const [newRoom, setNewRoom] = useState('ATC-305');
  const [customRoom, setCustomRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = authStorage.getToken();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalRoom = customRoom.trim() || newRoom;
    if (!finalRoom) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${apiUrl}/api/teacher/room-change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subjectCode,
          oldRoom: currentRoom,
          newRoom: finalRoom,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to update room');
      }

      onRoomChanged(finalRoom);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error updating room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-200 shadow-institutional-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#D98C00]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0B1F3A]">Change Lecture Room</h3>
              <p className="text-[11px] text-amber-800">Broadcasts instant notification to students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleUpdate} className="p-5 space-y-4">
          <div className="text-xs text-slate-600">
            Subject: <strong>{subjectCode}</strong> • Currently Scheduled in:{' '}
            <strong className="text-slate-800">{currentRoom}</strong>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              Select New Assigned Room
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_ROOMS.map((room) => (
                <button
                  key={room}
                  type="button"
                  onClick={() => {
                    setNewRoom(room);
                    setCustomRoom('');
                  }}
                  className={`p-2 rounded border text-xs font-medium text-center transition-all ${
                    newRoom === room && !customRoom
                      ? 'bg-[#1769AA] text-white border-[#1769AA]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              Or Type Custom Room / Lab Number
            </label>
            <input
              type="text"
              value={customRoom}
              onChange={(e) => setCustomRoom(e.target.value)}
              placeholder="e.g. Seminar Hall 2"
              className="w-full p-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1769AA] bg-white text-slate-900"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="p-2.5 rounded bg-blue-50/70 border border-blue-200 text-[11px] text-[#123B6D] flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 flex-shrink-0 animate-pulse text-[#1769AA]" />
            <span>Students currently viewing the dashboard will receive an instant banner.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#D98C00] hover:bg-[#b57400] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{loading ? 'Broadcasting...' : 'Broadcast Room Change'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
