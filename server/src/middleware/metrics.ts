import type { Request, Response, NextFunction } from 'express';
import { pool } from '../lib/db.js';

declare global {
  namespace Express {
    interface Request {
      routeGroup?: string;
    }
  }
}

interface MetricEntry {
  durationMs: number;
  isError: boolean;
  timestamp: number;
}

const metricsBuffer: Map<string, MetricEntry[]> = new Map();
const MAX_BUFFER_SIZE = 5000;

export function recordMetric(routeGroup: string, durationMs: number, isError: boolean) {
  let entries = metricsBuffer.get(routeGroup);
  if (!entries) {
    entries = [];
    metricsBuffer.set(routeGroup, entries);
  }

  entries.push({ durationMs, isError, timestamp: Date.now() });

  if (entries.length > MAX_BUFFER_SIZE) {
    entries.shift();
  }
}

export function metricsMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;

      // Use express matched route path, or fallback to raw path
      const routeGroup = req.route?.path || req.path;
      req.routeGroup = routeGroup;
      const isError = res.statusCode >= 500;

      recordMetric(routeGroup, durationMs, isError);
    });

    next();
  };
}

function getPercentile(values: number[], pct: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((pct / 100) * sorted.length) - 1;
  return Math.round(sorted[index] ?? 0);
}

export async function flushMetricsToDb() {
  try {
    // Read pool stats safely
    const poolActive = (pool as any)._allConnections?.length - (pool as any)._freeConnections?.length || 0;
    const poolIdle = (pool as any)._freeConnections?.length || 0;

    for (const [routeGroup, entries] of metricsBuffer.entries()) {
      if (entries.length === 0) continue;

      const now = Date.now();
      const recent = entries.filter((e) => now - e.timestamp < 60 * 1000);
      metricsBuffer.set(routeGroup, recent);

      if (recent.length === 0) continue;

      const count = recent.length;
      const errorCount = recent.filter((e) => e.isError).length;
      const durations = recent.map((e) => e.durationMs);

      const p50 = getPercentile(durations, 50);
      const p95 = getPercentile(durations, 95);
      const p99 = getPercentile(durations, 99);

      await pool.execute(
        `INSERT INTO request_metrics (route_group, count, error_count, latency_p50, latency_p95, latency_p99, pool_active, pool_idle)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [routeGroup, count, errorCount, p50, p95, p99, poolActive, poolIdle]
      );
    }
  } catch (err) {
    console.error('Failed to flush metrics to DB:', err);
  }
}
