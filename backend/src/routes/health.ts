import { Router, Request, Response } from 'express';
import { config } from '../config';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const istTime = new Intl.DateTimeFormat('en-IN', {
    timeZone: config.timezone,
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(new Date());

  res.json({
    status: 'healthy',
    service: 'SGSITS Anonymous Backend API',
    tagline: 'Ask Freely. Learn Better.',
    institution: 'Shri G. S. Institute of Technology and Science, Indore',
    department: 'Department of Information Technology',
    timestamp: new Date().toISOString(),
    istTimestamp: istTime,
    timezone: config.timezone,
    uptimeSeconds: Math.floor(process.uptime()),
    environment: config.nodeEnv,
  });
});

export default router;
