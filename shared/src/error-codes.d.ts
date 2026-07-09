/**
 * Machine-readable error codes shared by every endpoint and the client apiClient.
 * The `code` in the error envelope is always one of these keys.
 */
export declare const ERROR_CODES: {
    readonly INTERNAL: "INTERNAL";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly CONFLICT: "CONFLICT";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly MAINTENANCE: "MAINTENANCE";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly INVALID_TOKEN: "INVALID_TOKEN";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly ACCOUNT_BANNED: "ACCOUNT_BANNED";
    readonly EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED";
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly ACCOUNT_LOCKED: "ACCOUNT_LOCKED";
    readonly INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS";
    readonly MODERATION_BLOCKED: "MODERATION_BLOCKED";
    readonly GENERATION_BUSY: "GENERATION_BUSY";
    readonly QUEUE_FULL: "QUEUE_FULL";
    readonly PAYMENT_REQUIRED: "PAYMENT_REQUIRED";
    readonly ILLEGAL_TRANSITION: "ILLEGAL_TRANSITION";
    readonly REFUND_WINDOW_EXPIRED: "REFUND_WINDOW_EXPIRED";
    readonly WEBHOOK_SIGNATURE_INVALID: "WEBHOOK_SIGNATURE_INVALID";
    readonly SERVER_RESTART: "SERVER_RESTART";
};
export type ErrorCode = keyof typeof ERROR_CODES;
/** HTTP status paired with every error code. */
export declare const ERROR_HTTP_STATUS: Record<ErrorCode, number>;
/** The single error envelope shape every client ever sees. */
export interface ApiErrorEnvelope {
    error: {
        code: ErrorCode;
        message: string;
        details?: unknown;
        request_id: string;
    };
}
/** Build a well-formed error envelope. */
export declare function errorEnvelope(code: ErrorCode, message: string, requestId: string, details?: unknown): ApiErrorEnvelope;
//# sourceMappingURL=error-codes.d.ts.map