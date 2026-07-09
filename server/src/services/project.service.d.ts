import type { ProjectStatus } from '@ghostwriter/shared';
export declare const projectService: {
    create(userId: number, name: string, description: string): Promise<import("../repositories/project.repository.js").ProjectRow>;
    getById(id: number, userId: number): Promise<import("../repositories/project.repository.js").ProjectRow>;
    update(id: number, userId: number, updates: {
        name?: string;
        description?: string;
        status?: ProjectStatus;
    }): Promise<import("../repositories/project.repository.js").ProjectRow>;
    delete(id: number, userId: number): Promise<void>;
    list(userId: number, status?: ProjectStatus, page?: number, perPage?: number): Promise<import("@ghostwriter/shared").Paginated<import("../repositories/project.repository.js").ProjectRow>>;
};
//# sourceMappingURL=project.service.d.ts.map