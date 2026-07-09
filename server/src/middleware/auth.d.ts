import type { Request, Response, NextFunction } from 'express';
import { type AccessPayload } from '../lib/jwt.js';
declare global {
    namespace Express {
        interface Request {
            user?: AccessPayload;
        }
    }
}
export declare function requireAuth(req: Request, _res: Response, next: NextFunction): void;
export declare function optionalAuth(req: Request, _res: Response, next: NextFunction): void;
export declare const requireAdmin: (typeof requireAuth)[];
//# sourceMappingURL=auth.d.ts.map