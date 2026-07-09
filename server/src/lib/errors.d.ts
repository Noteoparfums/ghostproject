import { type ErrorCode } from '@ghostwriter/shared';
export declare class AppError extends Error {
    code: ErrorCode;
    status: number;
    details?: unknown;
    constructor(code: ErrorCode, message: string, details?: unknown);
}
export declare const Unauthorized: (m?: string) => AppError;
export declare const Forbidden: (m?: string) => AppError;
export declare const NotFound: (m?: string) => AppError;
export declare const Conflict: (m: string) => AppError;
export declare const Validation: (m: string, details?: unknown) => AppError;
export declare const InsufficientCredits: (details: object) => AppError;
export declare const ModerationBlocked: (clause: string) => AppError;
//# sourceMappingURL=errors.d.ts.map