import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../lib/errors.js';
export const accountService = {
    async getProfile(userId) {
        const user = await userRepository.findById(userId);
        if (!user)
            throw new AppError('NOT_FOUND', 'User not found');
        return user;
    },
    async updateProfile(userId, updates) {
        await userRepository.updateProfile(userId, updates);
        return this.getProfile(userId);
    },
    async deleteAccount(userId) {
        await userRepository.softDelete(userId);
    }
};
//# sourceMappingURL=account.service.js.map