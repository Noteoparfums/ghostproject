import { ERROR_HTTP_STATUS, type ErrorCode } from '@ghostwriter/shared';

export class AppError extends Error {
  code: ErrorCode;
  status: number;
  details?: unknown;
  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.status = ERROR_HTTP_STATUS[code];
    this.details = details;
  }
}

export const Unauthorized = (m = 'Authentication required') => new AppError('UNAUTHORIZED', m);
export const Forbidden = (m = 'Forbidden') => new AppError('FORBIDDEN', m);
export const NotFound = (m = 'Not found') => new AppError('NOT_FOUND', m);
export const Conflict = (m: string) => new AppError('CONFLICT', m);
export const Validation = (m: string, details?: unknown) => new AppError('VALIDATION_ERROR', m, details);
export const InsufficientCredits = (details: object) =>
  new AppError('INSUFFICIENT_CREDITS', 'Not enough credits', details);
export const ModerationBlocked = (clause: string) =>
  new AppError('MODERATION_BLOCKED', `Request violates our Acceptable Use Policy (${clause}).`, {
    clause,
    policy_url: '/legal/acceptable-use',
  });
