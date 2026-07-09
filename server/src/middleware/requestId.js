import { randomUUID } from 'node:crypto';
export function requestId(req, res, next) {
    req.id = req.headers['x-request-id'] || `req_${randomUUID()}`;
    res.setHeader('X-Request-Id', req.id);
    next();
}
//# sourceMappingURL=requestId.js.map