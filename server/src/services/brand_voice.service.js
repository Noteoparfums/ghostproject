import { brandVoiceRepository } from '../repositories/brand_voice.repository.js';
import { AppError } from '../lib/errors.js';
export const brandVoiceService = {
    async create(data) {
        if (!data.name || data.name.trim().length === 0) {
            throw new AppError('VALIDATION_ERROR', 'Brand voice name is required');
        }
        return brandVoiceRepository.create(data);
    },
    async getById(id, userId) {
        const voice = await brandVoiceRepository.findById(id);
        if (!voice) {
            throw new AppError('NOT_FOUND', 'Brand voice not found');
        }
        if (voice.user_id !== userId) {
            throw new AppError('FORBIDDEN', 'Access to brand voice denied');
        }
        return voice;
    },
    async update(id, userId, updates) {
        await this.getById(id, userId); // Ownership validation
        await brandVoiceRepository.update(id, updates);
        return this.getById(id, userId);
    },
    async delete(id, userId) {
        await this.getById(id, userId); // Ownership validation
        await brandVoiceRepository.delete(id);
    },
    async list(userId) {
        return brandVoiceRepository.list(userId);
    }
};
//# sourceMappingURL=brand_voice.service.js.map