import { api } from '../client';
import type { CreateBrandVoiceInput, ToneSliders } from '@ghostwriter/shared';

export interface BrandVoice {
  id: number;
  user_id: number;
  name: string;
  tone_sliders: ToneSliders;
  sample_texts: string;
  banned_words: string[];
  style_summary: string | null;
  created_at: string;
  updated_at: string;
}

export const brandVoicesApi = {
  list: () =>
    api<BrandVoice[]>('/api/brand-voices'),
  
  create: (body: CreateBrandVoiceInput) =>
    api<BrandVoice>('/api/brand-voices', { method: 'POST', body }),
  
  get: (id: number) =>
    api<BrandVoice>(`/api/brand-voices/${id}`),
  
  update: (id: number, body: Partial<CreateBrandVoiceInput>) =>
    api<BrandVoice>(`/api/brand-voices/${id}`, { method: 'PATCH', body }),
  
  delete: (id: number) =>
    api<void>(`/api/brand-voices/${id}`, { method: 'DELETE' }),
};
