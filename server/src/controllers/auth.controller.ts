import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { signupSchema, loginSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } from '@ghostwriter/shared';

function setAuthCookies(res: Response, refreshToken: string, remember: boolean) {
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/refresh',
    maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : undefined
  });
}

export const authController = {
  async signup(req: Request, res: Response) {
    const data = signupSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.signup({
      email: data.email,
      name: data.name,
      passwordRaw: data.password,
      marketingOptIn: data.marketing_opt_in,
      signupUtm: data.utm
    });

    setAuthCookies(res, refreshToken, true);

    res.status(201).json({
      data: {
        access_token: accessToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    });
  },

  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const ip = req.ip || '127.0.0.1';
    const userAgent = req.get('User-Agent') || 'Unknown';

    const { user, accessToken, refreshToken } = await authService.login(data.email, data.password, ip, userAgent);

    setAuthCookies(res, refreshToken, data.remember);

    res.json({
      data: {
        access_token: accessToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    });
  },

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No refresh token' } });
    }

    const ip = req.ip || '127.0.0.1';
    const { accessToken, user } = await authService.refresh(refreshToken, ip);

    return res.json({
      data: {
        access_token: accessToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    });
  },

  async logout(req: Request, res: Response) {
    const sessionId = req.user?.sid;
    if (sessionId) {
      await authService.logout(sessionId);
    }
    
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
    res.status(204).send();
  },

  async verifyEmail(req: Request, res: Response) {
    const data = verifyEmailSchema.parse(req.body);
    await authService.verifyEmail(data.token);
    res.status(204).send();
  },

  async forgotPassword(req: Request, res: Response) {
    const data = forgotPasswordSchema.parse(req.body);
    await authService.requestPasswordReset(data.email);
    res.status(204).send();
  },

  async resetPassword(req: Request, res: Response) {
    const data = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(data.token, data.password);
    res.status(204).send();
  }
};
