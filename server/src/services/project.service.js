import { projectRepository } from '../repositories/project.repository.js';
import { AppError } from '../lib/errors.js';
export const projectService = {
    async create(userId, name, description) {
        if (!name || name.trim().length === 0) {
            throw new AppError('VALIDATION_ERROR', 'Project name is required');
        }
        return projectRepository.create(userId, name, description);
    },
    async getById(id, userId) {
        const project = await projectRepository.findById(id);
        if (!project) {
            throw new AppError('NOT_FOUND', 'Project not found');
        }
        if (project.user_id !== userId) {
            throw new AppError('FORBIDDEN', 'Access to project denied');
        }
        return project;
    },
    async update(id, userId, updates) {
        await this.getById(id, userId); // Ownership validation
        await projectRepository.update(id, updates);
        return this.getById(id, userId);
    },
    async delete(id, userId) {
        await this.getById(id, userId); // Ownership validation
        await projectRepository.delete(id);
    },
    async list(userId, status, page = 1, perPage = 20) {
        return projectRepository.list(userId, status, page, perPage);
    }
};
//# sourceMappingURL=project.service.js.map