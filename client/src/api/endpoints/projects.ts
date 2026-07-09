import { api } from '../client';
import type { Paginated, ProjectStatus } from '@ghostwriter/shared';

export interface Project {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export const projectsApi = {
  list: (page = 1, status?: ProjectStatus) =>
    api<Paginated<Project>>('/api/projects', { query: { page, status } }),
  
  create: (body: { name: string; description?: string }) =>
    api<Project>('/api/projects', { method: 'POST', body }),
  
  get: (id: number) =>
    api<Project>(`/api/projects/${id}`),
  
  update: (id: number, body: { name?: string; description?: string; status?: ProjectStatus }) =>
    api<Project>(`/api/projects/${id}`, { method: 'PATCH', body }),
  
  delete: (id: number) =>
    api<void>(`/api/projects/${id}`, { method: 'DELETE' }),

  listAssets: (projectId: number) =>
    api<any[]>(`/api/projects/${projectId}/assets`),
};
