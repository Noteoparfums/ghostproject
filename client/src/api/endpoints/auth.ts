import { api } from '../client';
import type { 
  SignupInput, 
  LoginInput, 
  ResetPasswordInput,
} from '@ghostwriter/shared';

export interface Me {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export const authApi = {
  signup: (body: SignupInput) =>
    api<{ access_token: string; user: Me }>('/api/auth/signup', { method: 'POST', body }),
  
  login: (body: LoginInput) =>
    api<{ access_token: string; user: Me }>('/api/auth/login', { method: 'POST', body }),
  
  refresh: () =>
    api<{ access_token: string; user: Me }>('/api/auth/refresh', { method: 'POST' }),
  
  logout: () =>
    api<void>('/api/auth/logout', { method: 'POST' }),
  
  verifyEmail: (token: string) =>
    api<void>('/api/auth/verify-email', { method: 'POST', body: { token } }),
  
  forgotPassword: (email: string) =>
    api<void>('/api/auth/forgot-password', { method: 'POST', body: { email } }),
  
  resetPassword: (body: ResetPasswordInput) =>
    api<void>('/api/auth/reset-password', { method: 'POST', body }),
  
  me: () =>
    api<Me>('/api/auth/me'),
};
