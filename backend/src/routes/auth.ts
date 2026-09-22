import { Router, Request, Response } from 'express';
import { authService } from '../services/authService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { UserRole } from '../types/models';

const router = Router();

/**
 * POST /api/auth/login
 * Standard email + password authentication
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: { message: 'Please provide both email and password' },
    });
  }

  try {
    const session = await authService.login(email, password);
    res.json({
      success: true,
      message: 'Authentication successful',
      data: session,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid credentials';
    res.status(401).json({
      success: false,
      error: { message },
    });
  }
});

/**
 * POST /api/auth/demo-login
 * Instant 1-click login for demonstration and grading
 */
router.post('/demo-login', (req: Request, res: Response) => {
  const { role, identifier } = req.body as { role: UserRole; identifier?: string };

  if (!role || !['STUDENT', 'TEACHER', 'ADMIN'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: { message: 'Valid demo role (STUDENT, TEACHER, ADMIN) is required' },
    });
  }

  try {
    const session = authService.demoLogin(role, identifier);
    res.json({
      success: true,
      message: `Switched to Demo ${role} Session (${session.profile.fullName})`,
      data: session,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Demo account not found';
    res.status(404).json({
      success: false,
      error: { message },
    });
  }
});

/**
 * GET /api/auth/demo-accounts
 * Public list of pre-configured demo personas
 */
router.get('/demo-accounts', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: authService.getDemoAccountsList(),
  });
});

/**
 * GET /api/auth/me
 * Returns current authenticated user and profile
 */
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
