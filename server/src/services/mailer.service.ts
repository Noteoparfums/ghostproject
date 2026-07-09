import { emailAdapter } from '../adapters/email.adapter.js';

export const mailerService = {
  async sendVerification(to: string, token: string): Promise<void> {
    await emailAdapter.sendVerificationEmail(to, token);
  },

  async sendPasswordReset(to: string, token: string): Promise<void> {
    await emailAdapter.sendPasswordResetEmail(to, token);
  },

  async sendWelcome(to: string, name: string): Promise<void> {
    await emailAdapter.sendWelcomeEmail(to, name);
  }
};
