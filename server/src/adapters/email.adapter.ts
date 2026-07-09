import { logger } from '../lib/logger.js';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface EmailAdapter {
  sendVerificationEmail(to: string, token: string): Promise<void>;
  sendPasswordResetEmail(to: string, token: string): Promise<void>;
  sendWelcomeEmail(to: string, name: string): Promise<void>;
}

export class DevMailboxAdapter implements EmailAdapter {
  private async appendToMailbox(to: string, subject: string, body: string) {
    const mailboxDir = path.join(process.cwd(), 'mailbox');
    await fs.mkdir(mailboxDir, { recursive: true });
    const id = Date.now();
    const entry = {
      id,
      to,
      subject,
      body,
      date: new Date().toISOString()
    };
    await fs.writeFile(path.join(mailboxDir, `${id}.json`), JSON.stringify(entry, null, 2));
    logger.info({ to, subject }, 'Email sent to dev mailbox');
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const url = `http://localhost:5173/verify-email?token=${token}`;
    await this.appendToMailbox(to, 'Verify your Ghostwriter OS account', `Click here to verify: ${url}`);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const url = `http://localhost:5173/reset-password?token=${token}`;
    await this.appendToMailbox(to, 'Reset your password', `Click here to reset: ${url}`);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.appendToMailbox(to, 'Welcome to Ghostwriter OS', `Hi ${name}, welcome aboard!`);
  }
}

export const emailAdapter = new DevMailboxAdapter();
