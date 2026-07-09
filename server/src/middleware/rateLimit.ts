import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';

class RateLimiter {
  private windows: Map<string, number[]> = new Map();
  constructor(
    private limit: number,
    private windowMs: number
  ) {}

  public check(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let timestamps = this.windows.get(key) || [];
    timestamps = timestamps.filter(t => t > windowStart);

    if (timestamps.length >= this.limit) {
      const oldest = timestamps[0] || now;
      const resetTime = oldest + this.windowMs;
      this.windows.set(key, timestamps);
      return { allowed: false, remaining: 0, resetTime };
    }

    timestamps.push(now);
    this.windows.set(key, timestamps);

    return {
      allowed: true,
      remaining: this.limit - timestamps.length,
      resetTime: now + this.windowMs,
    };
  }
}

export function createLimiter(limit: number, windowMs: number, keyFn: (req: Request) => string) {
  const limiter = new RateLimiter(limit, windowMs);
  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyFn(req);
    const result = limiter.check(key);

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return next(new AppError('RATE_LIMITED', 'Too many requests, please try again later.', { retry_after: retryAfter }));
    }
    next();
  };
}

export const rateLimits = {
  global: createLimiter(300, 60 * 1000, (req) => req.ip || 'unknown'),
  auth: createLimiter(10, 60 * 1000, (req) => {
    const email = req.body?.email ? `:${req.body.email}` : '';
    return `${req.ip || 'unknown'}${email}`;
  }),
  billing: createLimiter(30, 60 * 1000, (req) => req.user?.id ? `user:${req.user.id}` : `ip:${req.ip || 'unknown'}`),
  webhooks: createLimiter(60, 60 * 1000, (req) => req.ip || 'unknown'),
  analytics: createLimiter(60, 60 * 1000, (req) => req.user?.id ? `user:${req.user.id}` : `ip:${req.ip || 'unknown'}`),
  contact: createLimiter(5, 10 * 60 * 1000, (req) => req.ip || 'unknown'),
};
