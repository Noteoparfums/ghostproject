import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../lib/errors.js';

export const accountService = {
  async getProfile(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('NOT_FOUND', 'User not found');
    return user;
  },

  async updateProfile(userId: number, updates: { name?: string; avatarUrl?: string | null; marketing?: boolean }) {
    await userRepository.updateProfile(userId, updates);
    return this.getProfile(userId);
  },

  async deleteAccount(userId: number) {
    await userRepository.softDelete(userId);
  }
};
