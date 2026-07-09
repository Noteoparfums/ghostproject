/**
 * Auth request schemas. Shared by server validation and client `useForm`.
 */
import { z } from 'zod';

export const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address');

/**
 * Password policy: 8+ chars with lower, upper, number, and symbol. The top-100
 * common-password blocklist is enforced additionally on the server (and mirrored
 * in the client strength meter) — not expressible cleanly in a single regex.
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(200, 'Password is too long')
  .refine((v) => /[a-z]/.test(v), 'Add a lowercase letter')
  .refine((v) => /[A-Z]/.test(v), 'Add an uppercase letter')
  .refine((v) => /\d/.test(v), 'Add a number')
  .refine((v) => /[^A-Za-z0-9]/.test(v), 'Add a symbol');

export const signupBody = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: emailSchema,
  password: passwordSchema,
  marketing_opt_in: z.boolean().default(false),
  accept_terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms and Privacy Policy' }),
  }),
  utm: z.record(z.string()).optional(),
});
export type SignupBody = z.infer<typeof signupBody>;

export const loginBody = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().default(false),
});
export type LoginBody = z.infer<typeof loginBody>;

export const verifyEmailBody = z.object({ token: z.string().min(1) });
export const resendVerificationBody = z.object({ email: emailSchema });
export const forgotPasswordBody = z.object({ email: emailSchema });

export const resetPasswordBody = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});
export type ResetPasswordBody = z.infer<typeof resetPasswordBody>;
