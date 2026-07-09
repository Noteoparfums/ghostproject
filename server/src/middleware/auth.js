import { verifyAccess } from '../lib/jwt.js';
import { Unauthorized, AppError } from '../lib/errors.js';
export function requireAuth(req, _res, next) {
    const token = req.headers.authorization?.replace(/^Bearer /, '');
    if (!token)
        throw Unauthorized();
    try {
        const payload = verifyAccess(token);
        if (payload.banned) {
            throw new AppError('ACCOUNT_BANNED', 'Account suspended');
        }
        req.user = payload;
    }
    catch (err) {
        if (err instanceof AppError)
            throw err;
        throw new AppError('UNAUTHORIZED', 'Invalid or expired token');
    }
    next();
}
export function optionalAuth(req, _res, next) {
    const token = req.headers.authorization?.replace(/^Bearer /, '');
    if (token) {
        try {
            const payload = verifyAccess(token);
            if (!payload.banned) {
                req.user = payload;
            }
        }
        catch {
            // Ignored for optional auth
        }
    }
    next();
}
export const requireAdmin = [
    requireAuth,
    (req, _res, next) => {
        if (req.user?.role !== 'admin') {
            throw new AppError('FORBIDDEN', 'Admin access required');
        }
        next();
    }
];
//# sourceMappingURL=auth.js.map