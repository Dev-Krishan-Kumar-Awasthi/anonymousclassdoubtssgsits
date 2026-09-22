import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRouter from './routes/health';
import timetableRouter from './routes/timetable';
import authRouter from './routes/auth';
import doubtsRouter from './routes/doubts';
import teacherRouter from './routes/teacher';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';

export const createApp = () => {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: [config.clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Base API routes
  app.use('/api/health', healthRouter);
  app.use('/api/timetable', timetableRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/doubts', doubtsRouter);
  app.use('/api/teacher', teacherRouter);

  // Root fallback
  app.get('/', (req, res) => {
    res.json({
      name: 'SGSITS Anonymous API',
      status: 'operational',
      institution: 'SGSITS Indore',
      docs: '/api/health',
    });
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};
