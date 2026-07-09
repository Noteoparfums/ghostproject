import { z } from 'zod';

/** Password policy mirrored on the client meter (length/case/number/symbol). */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(200)
  .refine((v) => /[a-z]/.test(v), 'Password must contain a lowercase letter')
  .refine((v) => /[A-Z]/.test(v), 'Password must contain an uppercase letter')
  .refine((v) => /[0-9]/.test(v), 'Password must contain a number')
  .refine((v) => /[^A-Za-z0-9]/.test(v), 'Password must contain a symbol');

export const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address');

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: emailSchema,
  password: passwordSchema,
  marketing_opt_in: z.boolean().default(false),
  tos: z.literal(true, { errorMap: () => ({ message: 'You must accept the Terms of Service' }) }),
  utm: z
    .object({
      source: z.string().nullable().optional(),
      medium: z.string().nullable().optional(),
      campaign: z.string().nullable().optional(),
      term: z.string().nullable().optional(),
      content: z.string().nullable().optional(),
    })
    .optional(),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().default(false),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const verifyEmailSchema = z.object({ token: z.string().min(1) });

export const resendVerificationSchema = z.object({ email: emailSchema });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
