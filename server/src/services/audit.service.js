import { auditRepository } from '../repositories/audit.repository.js';
export const auditService = {
    async log(data, tx) {
        await auditRepository.log(data, tx);
    }
};
//# sourceMappingURL=audit.service.js.map