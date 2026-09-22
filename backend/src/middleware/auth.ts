import { Request, Response, NextFunction } from 'express';
import { authService, AuthTokenPayload } from '../services/authService';
import { UserRole } from '../types/models';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

/**
 * Middleware to authenticate JWT token from Authorization header
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required. Please provide a valid Bearer token.',
      },
    });
  }

  try {
    const payload = authService.verifyToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Session expired or invalid token. Please log in again.',
      },
    });
  }
};

/**
 * Middleware to restrict route access to specific roles
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: `Access denied. Route requires one of: [${allowedRoles.join(', ')}]`,
        },
      });
    }

    next();
  };
};

/**
 * Ensures teacher only accesses their assigned classes / private doubts
 */
export const requireTeacherScope = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'TEACHER') {
    return res.status(403).json({
      success: false,
      error: { message: 'Access restricted to authorized faculty members' },
    });
  }

  const requestedTeacherCode = req.params.teacherCode || req.query.teacherCode;
  if (requestedTeacherCode && requestedTeacherCode !== req.user.teacherCode) {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Privacy violation: Faculty cannot access private logs of another faculty member.',
      },
    });
  }

  next();
};
