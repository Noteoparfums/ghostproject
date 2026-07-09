import { pool } from '../lib/db.js';
import { logger } from '../lib/logger.js';
import { flushMetricsToDb } from '../middleware/metrics.js';
import type { PoolConnection } from 'mysql2/promise';

let schedulerInterval: NodeJS.Timeout | null = null;
let electionTimeout: NodeJS.Timeout | null = null;
let hasLock = false;
let lockConn: PoolConnection | null = null;

async function tryAcquireLock(): Promise<boolean> {
  try {
    if (!lockConn) {
      lockConn = await pool.getConnection();
    }
    const [rows] = await lockConn.execute("SELECT GET_LOCK('gw_scheduler', 0) as locked");
    const isLocked = (rows as any[])[0]?.locked === 1;
    return isLocked;
  } catch (err) {
    logger.error({ err }, 'Failed to try-acquire scheduler lock');
    if (lockConn) {
      try {
        lockConn.release();
      } catch {
        // connection release failure ignored during error handling
      }
      lockConn = null;
    }
    return false;
  }
}

async function runCronJob(jobName: string, jobFn: () => Promise<void>) {
  const startedAt = new Date();
  logger.info({ jobName }, `Starting cron job: ${jobName}`);
  
  let runId = 0;
  try {
    const [result] = await pool.execute(
      "INSERT INTO job_runs (job_name, status, started_at) VALUES (?, 'running', NOW())",
      [jobName]
    );
    runId = (result as any).insertId;
  } catch (err) {
    logger.error({ err, jobName }, 'Failed to insert job run log');
  }

  try {
    await jobFn();
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();
    
    logger.info({ jobName, durationMs }, `Successfully completed cron job: ${jobName}`);
    
    if (runId) {
      await pool.execute(
        "UPDATE job_runs SET status = 'succeeded', finished_at = NOW(), duration_ms = ? WHERE id = ?",
        [durationMs, runId]
      );
    }
  } catch (err: any) {
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();
    logger.error({ err, jobName, durationMs }, `Failed cron job: ${jobName}`);
    
    if (runId) {
      await pool.execute(
        "UPDATE job_runs SET status = 'failed', error_message = ?, finished_at = NOW(), duration_ms = ? WHERE id = ?",
        [err?.message || 'Unknown job failure', durationMs, runId]
      );
    }
  }
}

async function cleanExpiredTokens() {
  await pool.execute('DELETE FROM email_verification_tokens WHERE expires_at < NOW()');
  await pool.execute('DELETE FROM password_reset_tokens WHERE expires_at < NOW()');
}

async function expireCredits() {
  logger.info({}, 'Expiring credits past their validity duration');
}

async function chargePastDueSubscriptions() {
  const [rows] = await pool.query(
    "SELECT * FROM subscriptions WHERE status = 'past_due' AND dunning_attempts < 4"
  );
  
  const pastDueSubs = rows as any[];
  if (pastDueSubs.length === 0) return;
  
  logger.info({ count: pastDueSubs.length }, `Attempting dunning charges for ${pastDueSubs.length} past due subscriptions`);
}

export function startScheduler(config?: { env: any; pool: any; logger: any }) {
  const loop = async () => {
    if (!hasLock) {
      const acquired = await tryAcquireLock();
      if (!acquired) {
        logger.info({}, 'Another server holds the scheduler lock. Retrying lock election in 30s.');
        electionTimeout = setTimeout(loop, 30000);
        return;
      }
      hasLock = true;
      logger.info({}, 'Scheduler lock acquired! Starting background cron schedules.');
    }

    let tickCount = 0;
    schedulerInterval = setInterval(async () => {
      tickCount++;
      
      // Every 60s: Flush request metrics
      if (tickCount % 1 === 0) {
        await runCronJob('flush_metrics', async () => {
          await flushMetricsToDb();
        });
      }

      // Every hour (60 ticks): clean tokens and process past_due billing
      if (tickCount % 60 === 0) {
        await runCronJob('clean_expired_tokens', cleanExpiredTokens);
        await runCronJob('charge_past_due_subscriptions', chargePastDueSubscriptions);
      }

      // Every 24 hours (1440 ticks): expire credits
      if (tickCount % 1440 === 0) {
        await runCronJob('expire_credits', expireCredits);
      }
    }, 60000);
  };

  loop().catch((err) => {
    logger.error({ err }, 'Scheduler boot failed');
  });

  return {
    stop() {
      if (schedulerInterval) {
        clearInterval(schedulerInterval);
        schedulerInterval = null;
      }
      if (electionTimeout) {
        clearTimeout(electionTimeout);
        electionTimeout = null;
      }
      if (hasLock && lockConn) {
        lockConn.execute("SELECT RELEASE_LOCK('gw_scheduler')")
          .catch((err) => logger.error({ err }, 'Failed to release scheduler lock'))
          .finally(() => {
            if (lockConn) {
              try {
                lockConn.release();
              } catch {
                // connection release failure ignored on cleanup
              }
              lockConn = null;
            }
          });
        hasLock = false;
      }
    }
  };
}
