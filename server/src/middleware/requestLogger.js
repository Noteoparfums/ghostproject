import { logger } from '../lib/logger.js';
export function requestLogger(req, res, next) {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1e6;
        const logData = {
            request_id: req.id,
            method: req.method,
            path: req.originalUrl,
            route: req.route?.path || req.path,
            status: res.statusCode,
            duration_ms: Math.round(durationMs * 100) / 100,
            user_id: req.user?.id || null,
        };
        if (res.statusCode >= 500) {
            logger.error(logData, 'request error');
        }
        else if (res.statusCode >= 400) {
            logger.warn(logData, 'request client error');
        }
        else {
            logger.info(logData, 'request completed');
        }
    });
    next();
}
//# sourceMappingURL=requestLogger.js.map