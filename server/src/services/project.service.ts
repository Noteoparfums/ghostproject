import { projectRepository } from '../repositories/project.repository.js';
import { AppError } from '../lib/errors.js';
import type { ProjectStatus } from '@ghostwriter/shared';

export const projectService = {
  async create(userId: number, name: string, description: string) {
    if (!name || name.trim().length === 0) {
      throw new AppError('VALIDATION_ERROR', 'Project name is required');
    }
    return projectRepository.create(userId, name, description);
  },

  async getById(id: number, userId: number) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError('NOT_FOUND', 'Project not found');
    }
    if (project.user_id !== userId) {
      throw new AppError('FORBIDDEN', 'Access to project denied');
    }
    return project;
  },

  async update(id: number, userId: number, updates: { name?: string; description?: string; status?: ProjectStatus }) {
    await this.getById(id, userId); // Ownership validation
    await projectRepository.update(id, updates);
    return this.getById(id, userId);
  },

  async delete(id: number, userId: number) {
    await this.getById(id, userId); // Ownership validation
    await projectRepository.delete(id);
  },

  async list(userId: number, status?: ProjectStatus, page = 1, perPage = 20) {
    return projectRepository.list(userId, status, page, perPage);
  }
};
