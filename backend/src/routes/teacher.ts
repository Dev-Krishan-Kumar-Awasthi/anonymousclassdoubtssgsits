import { Router, Response } from 'express';
import { doubtService, AnswerDoubtDTO } from '../services/doubtService';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { socketEvents } from '../socket';

const router = Router();

// Enforce that only TEACHER or ADMIN can access teacher endpoints
router.use(authenticateToken);
router.use(requireRole(['TEACHER', 'ADMIN']));

/**
 * GET /api/teacher/live-doubts
 * Live queue of incoming doubts, similar topic clusters, and metrics
 */
router.get('/live-doubts', (req: AuthenticatedRequest, res: Response) => {
  const subjectCode = req.query.subjectCode as string | undefined;
  const data = doubtService.getTeacherLiveDoubts(subjectCode);

  res.json({
    success: true,
    data,
  });
});

/**
 * POST /api/teacher/doubts/:id/answer
 * Answer a doubt (private response or publish to class)
 */
router.post('/doubts/:id/answer', (req: AuthenticatedRequest, res: Response) => {
  const teacherCode = req.user?.teacherCode || 'FACULTY';
  const { answerText, isPublishedToClass, isSavedAsFaq } = req.body as AnswerDoubtDTO;

  if (!answerText || answerText.trim().length === 0) {
    return res.status(400).json({ success: false, error: { message: 'Answer text cannot be empty' } });
  }

  try {
    const { doubt, response } = doubtService.answerDoubt(req.params.id, teacherCode, {
      answerText,
      isPublishedToClass: !!isPublishedToClass,
      isSavedAsFaq: !!isSavedAsFaq,
    });

    const safeMaskedDoubt = doubtService.maskStudentIdentity(doubt);

    // Socket.IO realtime notification to student and whole class
    socketEvents.emitDoubtAnswered(doubt, response, safeMaskedDoubt);

    res.json({
      success: true,
      message: isPublishedToClass
        ? 'Answer sent to student and published as common class doubt.'
        : 'Answer sent privately to student.',
      data: {
        doubt: safeMaskedDoubt,
        response,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to answer doubt';
    res.status(404).json({ success: false, error: { message } });
  }
});

/**
 * POST /api/teacher/doubts/:id/resolve
 */
router.post('/doubts/:id/resolve', (req: AuthenticatedRequest, res: Response) => {
  try {
    const resolved = doubtService.resolveDoubt(req.params.id);
    socketEvents.emitDoubtResolved(resolved);

    res.json({
      success: true,
      message: 'Doubt marked as resolved',
      data: doubtService.maskStudentIdentity(resolved),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to resolve doubt';
    res.status(404).json({ success: false, error: { message } });
  }
});

/**
 * POST /api/teacher/doubts/:id/dismiss
 */
router.post('/doubts/:id/dismiss', (req: AuthenticatedRequest, res: Response) => {
  try {
    const dismissed = doubtService.dismissDoubt(req.params.id);
    res.json({
      success: true,
      message: 'Doubt dismissed from live queue',
      data: doubtService.maskStudentIdentity(dismissed),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to dismiss doubt';
    res.status(404).json({ success: false, error: { message } });
  }
});

/**
 * POST /api/teacher/doubts/:id/pin
 */
router.post('/doubts/:id/pin', (req: AuthenticatedRequest, res: Response) => {
  try {
    const pinned = doubtService.pinDoubt(req.params.id);
    res.json({
      success: true,
      data: doubtService.maskStudentIdentity(pinned),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to pin doubt';
    res.status(404).json({ success: false, error: { message } });
  }
});

/**
 * POST /api/teacher/room-change
 * Instantly broadcast room change to students (e.g. ATC-301 -> ATC-305)
 */
router.post('/room-change', (req: AuthenticatedRequest, res: Response) => {
  const { subjectCode, oldRoom, newRoom } = req.body as {
    subjectCode: string;
    oldRoom: string;
    newRoom: string;
  };

  if (!subjectCode || !newRoom) {
    return res.status(400).json({
      success: false,
      error: { message: 'Subject code and new room number are required' },
    });
  }

  socketEvents.emitRoomChange(subjectCode, oldRoom || 'Scheduled Room', newRoom);

  res.json({
    success: true,
    message: `Room updated to ${newRoom} and broadcasted to students in real-time.`,
  });
});

/**
 * GET /api/teacher/insights
 * Classroom analytics and pulse breakdown
 */
router.get('/insights', (req: AuthenticatedRequest, res: Response) => {
  const subjectCode = (req.query.subjectCode as string) || 'OOP';
  const insights = doubtService.getTeacherInsights(subjectCode);

  res.json({
    success: true,
    data: insights,
  });
});

export default router;
