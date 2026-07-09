import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { jwtSecret } from '../config/env.js';

export interface AccessPayload {
  id: number;
  role: 'user' | 'admin';
  email: string;
  sid: number;
}

export function signAccess(payload: AccessPayload): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
}

export function verifyAccess(token: string): AccessPayload {
  return jwt.verify(token, jwtSecret) as AccessPayload;
}

export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
