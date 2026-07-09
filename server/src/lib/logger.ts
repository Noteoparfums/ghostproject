import { env } from '../config/env.js';

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 } as const;
const threshold = LEVELS[env.LOG_LEVEL];
const REDACT = ['password', 'token', 'cookie', 'authorization', 'card', 'password_hash', 'refresh_token_hash'];

function redact(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redact);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    out[k] = REDACT.includes(k.toLowerCase()) ? '[redacted]' : redact(v);
  }
  return out;
}

function log(level: keyof typeof LEVELS, fields: Record<string, unknown>, msg: string) {
  if (LEVELS[level] < threshold) return;
  const line = { level, time: new Date().toISOString(), msg, ...(redact(fields) as object) };
  const out = env.NODE_ENV === 'production' ? JSON.stringify(line) : `${level.toUpperCase()} ${msg} ${Object.keys(fields).length ? JSON.stringify(redact(fields)) : ''}`;
  if (level === 'error') console.error(out);
  else if (level === 'warn') console.warn(out);
  else console.log(out);
}

export const logger = {
  debug: (fields: Record<string, unknown>, msg: string) => log('debug', fields, msg),
  info: (fields: Record<string, unknown>, msg: string) => log('info', fields, msg),
  warn: (fields: Record<string, unknown>, msg: string) => log('warn', fields, msg),
  error: (fields: Record<string, unknown>, msg: string) => log('error', fields, msg),
};
