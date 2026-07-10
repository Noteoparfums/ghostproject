import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { appUrl, env } from './config/env.js';
import { requestId } from './middleware/requestId.js';
import { requestLogger } from './middleware/requestLogger.js';
import { metricsMiddleware } from './middleware/metrics.js';
import { maintenanceGate } from './middleware/maintenance.js';
import { rateLimits } from './middleware/rateLimit.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './lib/errors.js';

export const app = express();

app.set('trust proxy', 1);

// 1. UUID or X-Request-Id middleware
app.use(requestId);

// 2. Helmet-equivalent security headers
function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'; object-src 'none';");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  next();
}
app.use(securityHeaders);

// 3. Locked to frontend origin CORS
app.use(cors({ origin: appUrl, credentials: true }));

// 4. Raw body parser for webhooks signature verification (limit to 256kb)
app.use('/api/webhooks', express.raw({ type: 'application/json', limit: '256kb' }));

// 5. JSON parser for everything else (limit to 1mb)
app.use(express.json({ limit: '1mb' }));

app.use(cookieParser());

// 6. Request Logger
app.use(requestLogger);

// 7. In-memory Metrics Ring Buffer
app.use(metricsMiddleware());

// 8. Maintenance Gate
app.use(maintenanceGate);

// 9. Sane global rate limit default bucket
app.use('/api', rateLimits.global);

// 10. Mount API Router
app.use('/api', apiRouter);

// 11. Serve static client + SPA fallback (never shadows /api)
function serveSpa(app: Express) {
  if (env.NODE_ENV === 'production') {
    const clientDist = path.resolve(process.cwd(), '../client/dist');
    app.use(express.static(clientDist));
    
    app.get('*', (req: Request, res: Response) => {
      // Exclude /api, robots, sitemap from falling through
      if (req.path.startsWith('/api') || req.path === '/robots.txt' || req.path === '/sitemap.xml') {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `Cannot ${req.method} ${req.path}`,
            request_id: req.id
          }
        });
      }
      return res.sendFile(path.join(clientDist, 'index.html'));
    });
  }
}
serveSpa(app);

// 12. Not found handler for unknown /api paths
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('NOT_FOUND', `Cannot ${req.method} ${req.path}`));
});

// 13. Central error handler (LAST in chain)
app.use(errorHandler);
