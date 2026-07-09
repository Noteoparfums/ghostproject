import { env } from '../config/env.js';
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = LEVELS[env.LOG_LEVEL];
const REDACT = ['password', 'token', 'cookie', 'authorization', 'card', 'password_hash', 'refresh_token_hash'];
function redact(obj) {
    if (!obj || typeof obj !== 'object')
        return obj;
    if (Array.isArray(obj))
        return obj.map(redact);
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
        out[k] = REDACT.includes(k.toLowerCase()) ? '[redacted]' : redact(v);
    }
    return out;
}
function log(level, fields, msg) {
    if (LEVELS[level] < threshold)
        return;
    const line = { level, time: new Date().toISOString(), msg, ...redact(fields) };
    const out = env.NODE_ENV === 'production' ? JSON.stringify(line) : `${level.toUpperCase()} ${msg} ${Object.keys(fields).length ? JSON.stringify(redact(fields)) : ''}`;
    if (level === 'error')
        console.error(out);
    else if (level === 'warn')
        console.warn(out);
    else
        console.log(out);
}
export const logger = {
    debug: (fields, msg) => log('debug', fields, msg),
    info: (fields, msg) => log('info', fields, msg),
    warn: (fields, msg) => log('warn', fields, msg),
    error: (fields, msg) => log('error', fields, msg),
};
//# sourceMappingURL=logger.js.map