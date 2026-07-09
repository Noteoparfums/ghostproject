import { z } from 'zod';
export declare const projectIdParam: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export declare const createProjectBody: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
}, {
    name: string;
    description?: string | undefined;
}>;
export type CreateProjectInput = z.infer<typeof createProjectBody>;
export declare const patchProjectBody: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["active", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "active" | "archived" | undefined;
    name?: string | undefined;
    description?: string | undefined;
}, {
    status?: "active" | "archived" | undefined;
    name?: string | undefined;
    description?: string | undefined;
}>, {
    status?: "active" | "archived" | undefined;
    name?: string | undefined;
    description?: string | undefined;
}, {
    status?: "active" | "archived" | undefined;
    name?: string | undefined;
    description?: string | undefined;
}>;
export type PatchProjectInput = z.infer<typeof patchProjectBody>;
export declare const listProjectsQuery: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    per_page: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["active", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    per_page: number;
    status?: "active" | "archived" | undefined;
}, {
    page?: number | undefined;
    status?: "active" | "archived" | undefined;
    per_page?: number | undefined;
}>;
//# sourceMappingURL=projects.d.ts.map