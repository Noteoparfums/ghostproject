import { userRepository, sessionRepository, tokenRepository, type UserRow, type SessionRow } from '../repositories/user.repository.js';
import { emailAdapter } from '../adapters/email.adapter.js';
import { AppError } from '../lib/errors.js';
import { signAccess, randomToken } from '../lib/jwt.js';
import bcrypt from 'bcryptjs';

export const authService = {
  async signup(data: { email: string; name: string; passwordRaw: string; marketingOptIn: boolean; signupUtm?: any }): Promise<{ user: UserRow; sessionId: number; accessToken: string; refreshToken: string }> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('CONFLICT', 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(data.passwordRaw, 10);
    const userId = await userRepository.create({
      email: data.email,
      name: data.name,
      password_hash: passwordHash,
      marketing_opt_in: data.marketingOptIn,
      signup_utm: data.signupUtm
    });

    const user = await userRepository.findById(userId);
    if (!user) throw new Error('Failed to load user after create');

    // Send verification email
    const verifyToken = await tokenRepository.createEmailVerificationToken(userId);
    await emailAdapter.sendVerificationEmail(user.email, verifyToken);
    
    // Welcome email
    await emailAdapter.sendWelcomeEmail(user.email, user.name);

    return this.createSession(user, '127.0.0.1', 'Ghostwriter API'); // Will be overwritten by controller
  },

  async login(email: string, passwordRaw: string, ip: string, userAgent: string): Promise<{ user: UserRow; sessionId: number; accessToken: string; refreshToken: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('UNAUTHORIZED', 'Invalid email or password');
    }

    const valid = await bcrypt.compare(passwordRaw, user.password_hash);
    if (!valid) {
      throw new AppError('UNAUTHORIZED', 'Invalid email or password');
    }

    return this.createSession(user, ip, userAgent);
  },

  async createSession(user: UserRow, ip: string, userAgent: string) {
    const refreshToken = randomToken(40);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    const sessionId = await sessionRepository.create(user.id, refreshToken, ip, userAgent, expiresAt);
    
    const accessToken = signAccess({
      id: user.id,
      email: user.email,
      role: user.role,
      sid: sessionId
    });

    return { user, sessionId, accessToken, refreshToken };
  },

  async refresh(refreshToken: string, ip: string): Promise<{ accessToken: string, user: UserRow }> {
    const session = await sessionRepository.findValidByHash(refreshToken);
    if (!session) {
      throw new AppError('UNAUTHORIZED', 'Invalid or expired refresh token');
    }

    const user = await userRepository.findById(session.user_id);
    if (!user) {
      throw new AppError('UNAUTHORIZED', 'User not found');
    }

    await sessionRepository.updateActivity(session.id, ip);

    const accessToken = signAccess({
      id: user.id,
      email: user.email,
      role: user.role,
      sid: session.id
    });

    return { accessToken, user };
  },

  async logout(sessionId: number): Promise<void> {
    await sessionRepository.revoke(sessionId);
  },

  async verifyEmail(token: string): Promise<void> {
    const userId = await tokenRepository.consumeEmailVerificationToken(token);
    if (!userId) {
      throw new AppError('VALIDATION_ERROR', 'Invalid or expired verification token');
    }
    await userRepository.markEmailVerified(userId);
  },

  async requestPasswordReset(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email);
    if (!user) return; // Don't leak user existence

    const token = await tokenRepository.createPasswordResetToken(user.id);
    await emailAdapter.sendPasswordResetEmail(user.email, token);
  },

  async resetPassword(token: string, newPasswordRaw: string): Promise<void> {
    const userId = await tokenRepository.consumePasswordResetToken(token);
    if (!userId) {
      throw new AppError('VALIDATION_ERROR', 'Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPasswordRaw, 10);
    await userRepository.updatePassword(userId, passwordHash);
    
    // Revoke all existing sessions to force re-login
    await sessionRepository.revokeAllUserSessions(userId);
  }
};
