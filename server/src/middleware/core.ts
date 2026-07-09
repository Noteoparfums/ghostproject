import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { verifyAccess, type AccessPayload } from '../lib/jwt.js';
import { Unauthorized } from '../lib/errors.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id: string;
      user?: AccessPayload;
    }
  }
}

export function requestId(req: Request, res: Response, next: NextFunction) {
  req.id = (req.headers['x-request-id'] as string) || `req_${randomUUID()}`;
  res.setHeader('X-Request-Id', req.id);
  next();
}

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer /, '');
  if (!token) throw Unauthorized();
  try {
    req.user = verifyAccess(token);
  } catch {
    throw new AppError('INVALID_TOKEN', 'Session expired');
  }
  next();
}

export const requireAdmin: RequestHandler[] = [
  requireAuth,
  (req, _res, next) => {
    if (req.user?.role !== 'admin') throw new AppError('FORBIDDEN', 'Admin access required');
    next();
  },
];

function envelope(code: string, message: string, details: unknown, requestId: string) {
  return { error: { code, message, details, request_id: requestId } };
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const rid = req.id;
  if (err instanceof ZodError) {
    const details: Record<string, string> = {};
    for (const issue of err.issues) details[issue.path.join('.')] = issue.message;
    return res.status(422).json(envelope('VALIDATION_ERROR', 'Invalid input', details, rid));
  }
  if (err instanceof AppError) {
    if (err.status >= 500) logger.error({ err: err.message, rid }, err.message);
    return res.status(err.status).json(envelope(err.code, err.message, err.details, rid));
  }
  const message = err instanceof Error ? err.message : 'unknown';
  logger.error({ rid, stack: err instanceof Error ? err.stack : undefined }, `unexpected: ${message}`);
  return res.status(500).json(envelope('INTERNAL', 'Something went wrong', undefined, rid));
}
