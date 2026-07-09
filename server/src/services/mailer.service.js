import { emailAdapter } from '../adapters/email.adapter.js';
export const mailerService = {
    async sendVerification(to, token) {
        await emailAdapter.sendVerificationEmail(to, token);
    },
    async sendPasswordReset(to, token) {
        await emailAdapter.sendPasswordResetEmail(to, token);
    },
    async sendWelcome(to, name) {
        await emailAdapter.sendWelcomeEmail(to, name);
    }
};
//# sourceMappingURL=mailer.service.js.map