import type { Request, Response, NextFunction } from 'express';
import { verifyAccess, type AccessPayload } from '../lib/jwt.js';
import { Unauthorized, AppError } from '../lib/errors.js';

// Extend Express Request type locally for this file
declare global {
  namespace Express {
    interface Request {
      user?: AccessPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer /, '');
  if (!token) throw Unauthorized();
  try {
    const payload = verifyAccess(token);
    if ((payload as any).banned) {
      throw new AppError('ACCOUNT_BANNED', 'Account suspended');
    }
    req.user = payload;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('UNAUTHORIZED', 'Invalid or expired token');
  }
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer /, '');
  if (token) {
    try {
      const payload = verifyAccess(token);
      if (!(payload as any).banned) {
        req.user = payload;
      }
    } catch {
      // Ignored for optional auth
    }
  }
  next();
}

export const requireAdmin = [
  requireAuth,
  (req: Request, _res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
      throw new AppError('FORBIDDEN', 'Admin access required');
    }
    next();
  }
];
