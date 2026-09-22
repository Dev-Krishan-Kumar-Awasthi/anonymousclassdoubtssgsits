import { Router, Response } from 'express';
import { doubtService, CreateDoubtDTO } from '../services/doubtService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { socketEvents } from '../socket';
import { PulseRating } from '../types/models';

const router = Router();

/**
 * POST /api/doubts
 * Submit a new anonymous classroom doubt
 */
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: { message: 'Authentication required' } });
  }

  const { subjectCode, text, category, isWholeClass, classSessionId } = req.body as CreateDoubtDTO;

  if (!subjectCode || !text) {
    return res.status(400).json({
      success: false,
      error: { message: 'Subject code and doubt text are required' },
    });
  }

  try {
    const newDoubt = doubtService.createDoubt(req.user.userId, {
      subjectCode,
      text,
      category,
      isWholeClass: !!isWholeClass,
      classSessionId,
    });

    const maskedDoubt = doubtService.maskStudentIdentity(newDoubt);

    // Broadcast to teacher and class via Socket.IO
    socketEvents.emitNewDoubt(newDoubt, maskedDoubt);

    res.status(201).json({
      success: true,
      message: 'Your question was sent anonymously to your teacher.',
      data: {
        referenceNo: newDoubt.referenceNo,
        doubt: maskedDoubt,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit doubt';
    res.status(400).json({
      success: false,
      error: { message },
    });
  }
});

/**
 * GET /api/doubts/my
 * Returns authenticated student's own doubts (includes referenceNo, status, and teacher response)
 */
router.get('/my', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: { message: 'Authentication required' } });
  }

  const doubts = doubtService.getStudentDoubts(req.user.userId);
  res.json({
    success: true,
    count: doubts.length,
    data: doubts,
  });
});

/**
 * GET /api/doubts/common
 * Returns publicly answered / common doubts for a subject
 */
router.get('/common', (req, res) => {
  const subjectCode = req.query.subjectCode as string | undefined;
  const commonDoubts = doubtService.getCommonDoubts(subjectCode);

  res.json({
    success: true,
    count: commonDoubts.length,
    data: commonDoubts,
  });
});

/**
 * POST /api/doubts/:id/upvote
 * Upvote a doubt in live Q&A
 */
router.post('/:id/upvote', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = doubtService.upvoteDoubt(req.params.id);
    socketEvents.emitDoubtUpvoted(updated);

    res.json({
      success: true,
      data: {
        id: updated.id,
        upvotes: updated.upvotes,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to upvote';
    res.status(404).json({ success: false, error: { message } });
  }
});

/**
 * POST /api/doubts/pulse
 * Submit anonymous Class Pulse understanding rating
 */
router.post('/pulse', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: { message: 'Authentication required' } });
  }

  const { classSessionId, rating, subjectCode } = req.body as {
    classSessionId?: string;
    rating: PulseRating;
    subjectCode?: string;
  };

  if (!rating) {
    return res.status(400).json({ success: false, error: { message: 'Rating is required' } });
  }

  const sessionId = classSessionId || 'sess-today';
  doubtService.submitClassPulse(sessionId, req.user.userId, rating);
  const stats = doubtService.getClassPulseStats(sessionId);

  if (subjectCode) {
    socketEvents.emitPulseUpdate(subjectCode, stats);
  }

  res.json({
    success: true,
    message: 'Class pulse submitted anonymously. Thank you for your feedback.',
    data: stats,
  });
});

/**
 * GET /api/doubts/pulse-stats
 * Get aggregated understanding percentages
 */
router.get('/pulse-stats', (req, res) => {
  const sessionId = (req.query.classSessionId as string) || 'sess-today';
  const stats = doubtService.getClassPulseStats(sessionId);
  res.json({
    success: true,
    data: stats,
  });
});

export default router;
