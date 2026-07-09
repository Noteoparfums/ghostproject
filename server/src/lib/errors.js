import { ERROR_HTTP_STATUS } from '@ghostwriter/shared';
export class AppError extends Error {
    code;
    status;
    details;
    constructor(code, message, details) {
        super(message);
        this.code = code;
        this.status = ERROR_HTTP_STATUS[code];
        this.details = details;
    }
}
export const Unauthorized = (m = 'Authentication required') => new AppError('UNAUTHORIZED', m);
export const Forbidden = (m = 'Forbidden') => new AppError('FORBIDDEN', m);
export const NotFound = (m = 'Not found') => new AppError('NOT_FOUND', m);
export const Conflict = (m) => new AppError('CONFLICT', m);
export const Validation = (m, details) => new AppError('VALIDATION_ERROR', m, details);
export const InsufficientCredits = (details) => new AppError('INSUFFICIENT_CREDITS', 'Not enough credits', details);
export const ModerationBlocked = (clause) => new AppError('MODERATION_BLOCKED', `Request violates our Acceptable Use Policy (${clause}).`, {
    clause,
    policy_url: '/legal/acceptable-use',
});
//# sourceMappingURL=errors.js.map