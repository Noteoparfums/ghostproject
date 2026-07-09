import { z } from 'zod';
import { passwordSchema } from './auth.js';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  avatar_url: z.string().url().nullable().optional(),
  marketing_opt_in: z.boolean().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: passwordSchema,
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const notificationPreferenceSchema = z.object({
  type: z.string().min(1),
  email_enabled: z.boolean(),
  inapp_enabled: z.boolean(),
});

export const updateNotificationPreferencesSchema = z.object({
  preferences: z.array(notificationPreferenceSchema).min(1),
});
export type UpdateNotificationPreferencesInput = z.infer<
  typeof updateNotificationPreferencesSchema
>;

export const createApiKeySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirm: z.literal('DELETE', {
    errorMap: () => ({ message: 'Type DELETE to confirm' }),
  }),
});
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
