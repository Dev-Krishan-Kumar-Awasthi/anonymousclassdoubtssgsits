import { Server as SocketIOServer, Socket } from 'socket.io';
import { Doubt, DoubtResponse } from '../types/models';

let ioInstance: SocketIOServer | null = null;

export const initSocketServer = (io: SocketIOServer) => {
  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    // Join class room e.g. "class:OOP"
    socket.on('join_class', (subjectCode: string) => {
      if (subjectCode) {
        const room = `class:${subjectCode.toUpperCase()}`;
        socket.join(room);
      }
    });

    // Join teacher channel e.g. "teacher:US"
    socket.on('join_teacher', (teacherCode: string) => {
      if (teacherCode) {
        const room = `teacher:${teacherCode.toUpperCase()}`;
        socket.join(room);
      }
    });

    // Join private student channel e.g. "student:usr-student-krishan"
    socket.on('join_student', (userId: string) => {
      if (userId) {
        const room = `student:${userId}`;
        socket.join(room);
      }
    });

    socket.on('disconnect', () => {
      // client disconnected
    });
  });

  return ioInstance;
};

export const getSocketIO = (): SocketIOServer | null => {
  return ioInstance;
};

/**
 * Socket.IO Realtime Broadcast Helpers
 */
export const socketEvents = {
  // Broadcast new doubt to teacher live stream and active class
  emitNewDoubt(doubt: Doubt, safeMaskedDoubt: unknown) {
    if (!ioInstance) return;
    // Broadcast to teacher of this subject
    ioInstance.to(`class:${doubt.subjectCode}`).emit('new_doubt', safeMaskedDoubt);
  },

  // Notify student when teacher answers, and broadcast to whole class if published
  emitDoubtAnswered(doubt: Doubt, response: DoubtResponse, safeMaskedDoubt: unknown) {
    if (!ioInstance) return;

    // Send instant notification to the private student room
    ioInstance.to(`student:${doubt.internalUserId}`).emit('doubt_answered', {
      doubtId: doubt.id,
      referenceNo: doubt.referenceNo,
      subjectCode: doubt.subjectCode,
      response,
      doubt: doubt,
    });

    // If published, broadcast to whole class as common doubt
    if (response.isPublishedToClass) {
      ioInstance.to(`class:${doubt.subjectCode}`).emit('doubt_published', {
        doubt: safeMaskedDoubt,
        response,
      });
    }
  },

  // Notify when doubt is marked resolved
  emitDoubtResolved(doubt: Doubt) {
    if (!ioInstance) return;
    ioInstance.to(`class:${doubt.subjectCode}`).emit('doubt_resolved', {
      doubtId: doubt.id,
      referenceNo: doubt.referenceNo,
    });
  },

  // Notify when a doubt receives an upvote
  emitDoubtUpvoted(doubt: Doubt) {
    if (!ioInstance) return;
    ioInstance.to(`class:${doubt.subjectCode}`).emit('doubt_upvoted', {
      doubtId: doubt.id,
      upvotes: doubt.upvotes,
    });
  },

  // Realtime room change broadcast (e.g. ATC-301 -> ATC-305)
  emitRoomChange(subjectCode: string, oldRoom: string, newRoom: string) {
    if (!ioInstance) return;
    ioInstance.to(`class:${subjectCode.toUpperCase()}`).emit('room_changed', {
      subjectCode: subjectCode.toUpperCase(),
      oldRoom,
      newRoom,
      timestamp: new Date().toISOString(),
    });
  },

  // Realtime class pulse update
  emitPulseUpdate(subjectCode: string, stats: unknown) {
    if (!ioInstance) return;
    ioInstance.to(`class:${subjectCode.toUpperCase()}`).emit('pulse_updated', stats);
  },
};
