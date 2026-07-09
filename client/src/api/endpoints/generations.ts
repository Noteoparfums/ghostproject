import { api } from '../client';
import type { Paginated, GenerationStatus, FunnelType } from '@ghostwriter/shared';

export interface Generation {
  id: number;
  user_id: number;
  project_id: number | null;
  brand_voice_id: number | null;
  funnel_type: FunnelType;
  brief: string;
  target_audience: string | null;
  angle_override: string | null;
  status: GenerationStatus;
  credit_cost: number;
  provider_info: any | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedAsset {
  id: number;
  generation_id: number;
  user_id: number;
  project_id: number | null;
  asset_type: string;
  variant_of_id: number | null;
  content: string;
  copy_score: number | null;
  score_reasoning: string | null;
  tokens_used: number;
  is_favorited: boolean;
  created_at: string;
  updated_at: string;
}

export const generationsApi = {
  list: (page = 1, perPage = 20) =>
    api<Paginated<Generation>>('/api/generate', { query: { page, per_page: perPage } }),

  updateAsset: (assetId: number, body: { content?: string; is_favorited?: boolean }) =>
    api<GeneratedAsset>(`/api/generate/assets/${assetId}`, { method: 'PATCH', body }),

  regenerateSection: (assetId: number, body: { instruction?: string }) =>
    api<GeneratedAsset>(`/api/generate/assets/${assetId}/regenerate`, { 
      method: 'POST', 
      body: { asset_id: assetId, instruction: body.instruction } 
    }),
};
