import { type TransactionConnection } from '../lib/db.js';
import type { ProjectStatus, Paginated } from '@ghostwriter/shared';
export interface ProjectRow {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    status: ProjectStatus;
    archived_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
export declare const projectRepository: {
    create(userId: number, name: string, description: string, tx?: TransactionConnection): Promise<ProjectRow>;
    findById(id: number, tx?: TransactionConnection): Promise<ProjectRow | null>;
    update(id: number, updates: {
        name?: string;
        description?: string;
        status?: ProjectStatus;
    }, tx?: TransactionConnection): Promise<void>;
    delete(id: number, tx?: TransactionConnection): Promise<void>;
    list(userId: number, status?: ProjectStatus, page?: number, perPage?: number, tx?: TransactionConnection): Promise<Paginated<ProjectRow>>;
};
//# sourceMappingURL=project.repository.d.ts.map