import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (
  subjectCode?: string,
  userId?: string,
  onEvents?: {
    onDoubtAnswered?: (data: unknown) => void;
    onRoomChanged?: (data: { subjectCode: string; oldRoom: string; newRoom: string }) => void;
    onDoubtPublished?: (data: unknown) => void;
    onNewDoubt?: (data: unknown) => void;
  }
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      if (subjectCode) {
        socket.emit('join_class', subjectCode);
      }
      if (userId) {
        socket.emit('join_student', userId);
      }
    });

    if (onEvents?.onDoubtAnswered) {
      socket.on('doubt_answered', onEvents.onDoubtAnswered);
    }
    if (onEvents?.onRoomChanged) {
      socket.on('room_changed', onEvents.onRoomChanged);
    }
    if (onEvents?.onDoubtPublished) {
      socket.on('doubt_published', onEvents.onDoubtPublished);
    }
    if (onEvents?.onNewDoubt) {
      socket.on('new_doubt', onEvents.onNewDoubt);
    }

    return () => {
      socket.disconnect();
    };
  }, [subjectCode, userId]);

  return socketRef;
};
