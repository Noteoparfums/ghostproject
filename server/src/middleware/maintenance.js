import { verifyAccess } from '../lib/jwt.js';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';
export function maintenanceGate(req, _res, next) {
    // Proceed if maintenance mode is not active
    if (!env.MAINTENANCE_MODE) {
        return next();
    }
    // Health and readiness endpoints are always allowed
    const path = req.path;
    if (path === '/health' || path === '/ready' || path === '/api/health' || path === '/api/ready') {
        return next();
    }
    // Allow admin bypass via access token validation
    const token = req.headers.authorization?.replace(/^Bearer /, '');
    if (token) {
        try {
            const payload = verifyAccess(token);
            if (payload.role === 'admin') {
                return next();
            }
        }
        catch {
            // Ignored, fall through to 503
        }
    }
    next(new AppError('MAINTENANCE', 'Server is undergoing scheduled maintenance. Please try again later.'));
}
//# sourceMappingURL=maintenance.js.map