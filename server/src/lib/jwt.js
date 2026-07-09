import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { jwtSecret } from '../config/env.js';
export function signAccess(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
}
export function verifyAccess(token) {
    return jwt.verify(token, jwtSecret);
}
export function randomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
}
export function sha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}
//# sourceMappingURL=jwt.js.map