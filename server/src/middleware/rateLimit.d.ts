import type { Request, Response, NextFunction } from 'express';
export declare function createLimiter(limit: number, windowMs: number, keyFn: (req: Request) => string): (req: Request, res: Response, next: NextFunction) => void;
export declare const rateLimits: {
    global: (req: Request, res: Response, next: NextFunction) => void;
    auth: (req: Request, res: Response, next: NextFunction) => void;
    billing: (req: Request, res: Response, next: NextFunction) => void;
    webhooks: (req: Request, res: Response, next: NextFunction) => void;
    analytics: (req: Request, res: Response, next: NextFunction) => void;
    contact: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=rateLimit.d.ts.map