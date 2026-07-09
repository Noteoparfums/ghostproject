import { type TransactionConnection } from '../lib/db.js';
export interface SystemHealthStats {
    total_requests: number;
    total_errors: number;
    avg_latency_p50: number;
    avg_latency_p95: number;
    avg_latency_p99: number;
    active_db_connections: number;
    idle_db_connections: number;
}
export declare const analyticsRepository: {
    getSystemHealth(tx?: TransactionConnection): Promise<SystemHealthStats>;
    getRecentErrorDigests(limit?: number, tx?: TransactionConnection): Promise<any[]>;
    getJobRuns(limit?: number, tx?: TransactionConnection): Promise<any[]>;
};
//# sourceMappingURL=analytics.repository.d.ts.map