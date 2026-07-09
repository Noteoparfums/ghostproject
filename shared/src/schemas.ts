import { z } from 'zod';
import { FUNNEL_TYPES } from './funnels';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[a-z]/, 'Add a lowercase letter')
    .regex(/[A-Z]/, 'Add an uppercase letter')
    .regex(/[0-9]/, 'Add a number'),
  marketing_opt_in: z.boolean().optional().default(false),
  tos: z.literal(true, { errorMap: () => ({ message: 'You must accept the Terms' }) }),
  utm: z.record(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional().default(false),
});

export const createProjectSchema = z.object({
  name: z.string().min(1).max(160),
  description: z.string().max(2000).optional(),
});

export const brandVoiceSchema = z.object({
  name: z.string().min(1).max(160),
  sample_texts: z.string().min(50, 'Paste at least ~50 characters of sample copy').max(20000),
  tone_sliders: z
    .object({
      formal_casual: z.number().min(0).max(100),
      safe_bold: z.number().min(0).max(100),
      short_story: z.number().min(0).max(100),
    })
    .optional(),
  banned_words: z.array(z.string()).max(50).optional(),
});

export const generateSchema = z.object({
  project_id: z.number().int().positive().nullable().optional(),
  brand_voice_id: z.number().int().positive().nullable().optional(),
  funnel_type: z.enum(FUNNEL_TYPES),
  product: z.string().min(10, 'Describe your offer (min 10 chars)').max(4000),
  audience: z.string().max(1000).optional().default(''),
  tone: z.string().max(200).optional().default(''),
  template_id: z.number().int().positive().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GenerateInput = z.infer<typeof generateSchema>;
export type BrandVoiceInput = z.infer<typeof brandVoiceSchema>;
