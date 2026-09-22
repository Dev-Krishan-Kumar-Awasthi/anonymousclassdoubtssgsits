import { Router, Request, Response } from 'express';
import { timetableService } from '../services/timetableService';

const router = Router();

/**
 * GET /api/timetable/current-class
 * Determines active class, starting soon state, and next class
 * Query params: batch, teacherCode, simulatedTime
 */
router.get('/current-class', (req: Request, res: Response) => {
  const { batch, teacherCode, simulatedTime } = req.query;

  const result = timetableService.getCurrentClass({
    batch: batch as string | undefined,
    teacherCode: teacherCode as string | undefined,
    simulatedTime: simulatedTime as string | undefined,
  });

  res.json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/timetable/today
 * Returns full schedule for today in Asia/Kolkata
 */
router.get('/today', (req: Request, res: Response) => {
  const { batch, teacherCode, simulatedTime } = req.query;

  const result = timetableService.getTodaySchedule({
    batch: batch as string | undefined,
    teacherCode: teacherCode as string | undefined,
    simulatedTime: simulatedTime as string | undefined,
  });

  res.json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/timetable/weekly
 * Returns full weekly schedule matrix (Mon-Fri)
 */
router.get('/weekly', (req: Request, res: Response) => {
  const { batch, teacherCode, includeAllBatches } = req.query;

  const result = timetableService.getWeeklySchedule({
    batch: batch as string | undefined,
    teacherCode: teacherCode as string | undefined,
    includeAllBatches: includeAllBatches === 'true',
  });

  res.json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/timetable/entries
 * Raw entries list
 */
router.get('/entries', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: timetableService.getEntries().length,
    data: timetableService.getEntries(),
  });
});

export default router;
