import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
export declare const validate: (schemas: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map