import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { errorDigest } from '../lib/errorDigest.js';
import { recordMetric } from './metrics.js';
function envelope(code, message, details, requestId) {
    return { error: { code, message, details, request_id: requestId } };
}
function zodDetails(err) {
    const details = {};
    for (const issue of err.issues) {
        details[issue.path.join('.')] = issue.message;
    }
    return details;
}
export function errorHandler(err, req, res, _next) {
    const requestId = req.id;
    if (err instanceof ZodError) {
        return res.status(422).json(envelope('VALIDATION_ERROR', 'Invalid input', zodDetails(err), requestId));
    }
    if (err instanceof AppError) {
        if (err.status >= 500) {
            logger.error({ err: err.message, requestId, code: err.code }, err.message);
        }
        return res.status(err.status).json(envelope(err.code, err.message, err.details, requestId));
    }
    // Unexpected errors
    const message = err instanceof Error ? err.message : 'unknown';
    logger.error({ err, requestId, stack: err instanceof Error ? err.stack : undefined }, `unexpected error: ${message}`);
    // Log error digest asynchronously
    errorDigest.record(err).catch(() => { });
    // Increment metrics error count
    const routeGroup = req.routeGroup || req.route?.path || req.path;
    recordMetric(routeGroup, 0, true);
    return res.status(500).json(envelope('INTERNAL', 'Something went wrong', undefined, requestId));
}
//# sourceMappingURL=errorHandler.js.map