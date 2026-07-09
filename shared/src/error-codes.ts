/**
 * Machine-readable error codes shared by every endpoint and the client apiClient.
 * The `code` in the error envelope is always one of these keys.
 */
export const ERROR_CODES = {
  // Generic
  INTERNAL: 'INTERNAL',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  MAINTENANCE: 'MAINTENANCE',

  // Auth
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ACCOUNT_BANNED: 'ACCOUNT_BANNED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',

  // Product / engine
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  MODERATION_BLOCKED: 'MODERATION_BLOCKED',
  GENERATION_BUSY: 'GENERATION_BUSY',
  QUEUE_FULL: 'QUEUE_FULL',

  // Billing
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
  ILLEGAL_TRANSITION: 'ILLEGAL_TRANSITION',
  REFUND_WINDOW_EXPIRED: 'REFUND_WINDOW_EXPIRED',
  WEBHOOK_SIGNATURE_INVALID: 'WEBHOOK_SIGNATURE_INVALID',

  // Server lifecycle
  SERVER_RESTART: 'SERVER_RESTART',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

/** HTTP status paired with every error code. */
export const ERROR_HTTP_STATUS: Record<ErrorCode, number> = {
  INTERNAL: 500,
  VALIDATION_ERROR: 422,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  MAINTENANCE: 503,

  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INVALID_TOKEN: 401,
  TOKEN_EXPIRED: 401,
  ACCOUNT_BANNED: 403,
  EMAIL_NOT_VERIFIED: 403,
  INVALID_CREDENTIALS: 401,
  ACCOUNT_LOCKED: 429,

  INSUFFICIENT_CREDITS: 402,
  MODERATION_BLOCKED: 422,
  GENERATION_BUSY: 503,
  QUEUE_FULL: 429,

  PAYMENT_REQUIRED: 402,
  ILLEGAL_TRANSITION: 409,
  REFUND_WINDOW_EXPIRED: 422,
  WEBHOOK_SIGNATURE_INVALID: 400,

  SERVER_RESTART: 503,
};

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
export function errorEnvelope(
  code: ErrorCode,
  message: string,
  requestId: string,
  details?: unknown,
): ApiErrorEnvelope {
  return { error: { code, message, request_id: requestId, ...(details !== undefined ? { details } : {}) } };
}
