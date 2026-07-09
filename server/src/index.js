import './config/env.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { pool } from './lib/db.js';
import { app } from './app.js';
import { startScheduler } from './jobs/scheduler.js';
import { sseRegistry } from './lib/sse.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function assertMigrationsCurrent() {
    const migrationsDir = path.resolve(__dirname, '../../migrations');
    if (!fs.existsSync(migrationsDir))
        return;
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
    try {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM schema_migrations');
        const appliedCount = rows[0]?.count ?? 0;
        if (appliedCount < files.length) {
            const errMsg = `Refusing to boot: database has pending migrations (applied ${appliedCount}/${files.length}). Run npm run migrate first.`;
            if (env.NODE_ENV === 'production') {
                logger.error({ appliedCount, totalMigrations: files.length }, errMsg);
                process.exit(1);
            }
            else {
                logger.warn({ appliedCount, totalMigrations: files.length }, `!!! ${errMsg}`);
            }
        }
        else {
            logger.info({ appliedCount }, 'Database migrations check passed.');
        }
    }
    catch (err) {
        const errMsg = 'Refusing to boot: migrations table check failed. Run migrations first.';
        if (env.NODE_ENV === 'production') {
            logger.error({ err }, errMsg);
            process.exit(1);
        }
        else {
            logger.warn({ err }, `!!! ${errMsg}`);
        }
    }
}
async function assertDemoLedgerConsistency() {
    try {
        const [users] = await pool.query('SELECT id FROM users WHERE email = ?', ['demo@ghostwriter.os']);
        const demoUser = users[0];
        if (demoUser) {
            const [rows] = await pool.query('SELECT COALESCE(SUM(delta), 0) AS bal FROM credit_ledger WHERE user_id = ?', [demoUser.id]);
            const bal = Number(rows[0]?.bal ?? 0);
            logger.info({ userId: demoUser.id, balance: bal }, 'Startup invariant check: demo user ledger balance consistent.');
        }
    }
    catch (err) {
        logger.warn({ err }, 'Startup invariant check: demo user ledger balance check failed.');
    }
}
function registerGracefulShutdown(server, scheduler) {
    let isShuttingDown = false;
    const shutdown = async (signal) => {
        if (isShuttingDown)
            return;
        isShuttingDown = true;
        logger.info({ signal }, `Received ${signal}. Starting graceful shutdown...`);
        const timeout = setTimeout(() => {
            logger.error({}, 'Graceful shutdown timed out. Forcing hard exit.');
            process.exit(1);
        }, 15000);
        server.close(() => {
            logger.info({}, 'HTTP server closed.');
        });
        try {
            logger.info({}, 'Ending open SSE streams...');
            sseRegistry.broadcastError('SERVER_RESTART');
            const activeIds = sseRegistry.getIds();
            if (activeIds.length > 0) {
                logger.info({ count: activeIds.length }, `Processing refunds for ${activeIds.length} in-flight generations...`);
                for (const genId of activeIds) {
                    try {
                        const [rows] = await pool.query('SELECT user_id, credits_charged FROM generations WHERE id = ?', [genId]);
                        const gen = rows[0];
                        if (gen) {
                            const cost = Number(gen.credits_charged);
                            const userId = gen.user_id;
                            const conn = await pool.getConnection();
                            try {
                                await conn.beginTransaction();
                                await conn.query('UPDATE generations SET status = "failed", error_message = "Server restart" WHERE id = ?', [genId]);
                                if (cost > 0) {
                                    const [ledgerRows] = await conn.execute('SELECT COALESCE(SUM(delta), 0) AS bal FROM credit_ledger WHERE user_id = ? FOR UPDATE', [userId]);
                                    const current = Number(ledgerRows[0]?.bal ?? 0);
                                    const after = current + cost;
                                    await conn.execute('INSERT INTO credit_ledger (user_id, delta, balance_after, source, generation_id, note) VALUES (?, ?, ?, "refund", ?, ?)', [userId, cost, after, genId, 'Refund for in-flight generation aborted by server restart']);
                                }
                                await conn.commit();
                            }
                            catch (txErr) {
                                await conn.rollback();
                                logger.error({ genId, err: txErr }, 'Failed transaction refund for in-flight generation.');
                            }
                            finally {
                                conn.release();
                            }
                        }
                    }
                    catch (genErr) {
                        logger.error({ genId, err: genErr }, 'Failed to refund in-flight generation.');
                    }
                }
            }
            logger.info({}, 'Stopping background job scheduler...');
            scheduler.stop();
            logger.info({}, 'Ending database connection pool...');
            await pool.end();
            logger.info({}, 'Graceful shutdown completed successfully.');
            clearTimeout(timeout);
            process.exit(0);
        }
        catch (err) {
            logger.error({ err }, 'Error during graceful shutdown.');
            process.exit(1);
        }
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
async function main() {
    logger.info({ version: env.APP_VERSION, nodeEnv: env.NODE_ENV }, 'Ghostwriter OS Server booting');
    // Verify migrations are up-to-date
    await assertMigrationsCurrent();
    // Startup consistency check for dev/staging
    if (env.NODE_ENV !== 'production') {
        await assertDemoLedgerConsistency();
    }
    // Bind app and listen
    const server = app.listen(env.PORT, '0.0.0.0', () => {
        logger.info({ port: env.PORT }, `HTTP Server listening on port ${env.PORT}`);
    });
    // Start elected job scheduler
    const scheduler = startScheduler({ env, pool, logger });
    // Register graceful SIGTERM/SIGINT shutdown handler
    registerGracefulShutdown(server, scheduler);
}
main().catch((err) => {
    logger.error({ err }, 'Unhandled crash during boot sequence.');
    process.exit(1);
});
//# sourceMappingURL=index.js.map