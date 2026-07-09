import type { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            routeGroup?: string;
        }
    }
}
export declare function recordMetric(routeGroup: string, durationMs: number, isError: boolean): void;
export declare function metricsMiddleware(): (req: Request, res: Response, next: NextFunction) => void;
export declare function flushMetricsToDb(): Promise<void>;
//# sourceMappingURL=metrics.d.ts.map