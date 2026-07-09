import { query, queryOne, type TransactionConnection } from '../lib/db.js';

export interface SystemHealthStats {
  total_requests: number;
  total_errors: number;
  avg_latency_p50: number;
  avg_latency_p95: number;
  avg_latency_p99: number;
  active_db_connections: number;
  idle_db_connections: number;
}

export const analyticsRepository = {
  async getSystemHealth(tx?: TransactionConnection): Promise<SystemHealthStats> {
    const stats = await queryOne<any>(
      `SELECT 
        COALESCE(SUM(count), 0) as total_requests,
        COALESCE(SUM(error_count), 0) as total_errors,
        COALESCE(AVG(latency_p50), 0) as avg_latency_p50,
        COALESCE(AVG(latency_p95), 0) as avg_latency_p95,
        COALESCE(AVG(latency_p99), 0) as avg_latency_p99,
        COALESCE(MAX(pool_active), 0) as active_db_connections,
        COALESCE(MAX(pool_idle), 0) as idle_db_connections
       FROM request_metrics
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
      [],
      tx
    );

    return {
      total_requests: Number(stats?.total_requests ?? 0),
      total_errors: Number(stats?.total_errors ?? 0),
      avg_latency_p50: Math.round(Number(stats?.avg_latency_p50 ?? 0)),
      avg_latency_p95: Math.round(Number(stats?.avg_latency_p95 ?? 0)),
      avg_latency_p99: Math.round(Number(stats?.avg_latency_p99 ?? 0)),
      active_db_connections: Number(stats?.active_db_connections ?? 0),
      idle_db_connections: Number(stats?.idle_db_connections ?? 0)
    };
  },

  async getRecentErrorDigests(limit = 10, tx?: TransactionConnection): Promise<any[]> {
    return query(
      'SELECT * FROM error_digests ORDER BY last_seen DESC LIMIT ?',
      [limit],
      tx
    );
  },

  async getJobRuns(limit = 10, tx?: TransactionConnection): Promise<any[]> {
    return query(
      'SELECT * FROM job_runs ORDER BY started_at DESC LIMIT ?',
      [limit],
      tx
    );
  }
};
