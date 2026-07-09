-- 0005: Observability & Background Jobs

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_type VARCHAR(20) NOT NULL CHECK (actor_type IN ('user', 'admin', 'system', 'webhook')),
  actor_id BIGINT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(100) NULL,
  target_id BIGINT NULL,
  properties JSONB NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs (actor_type, actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs (created_at);

CREATE TABLE IF NOT EXISTS job_runs (
  id BIGSERIAL PRIMARY KEY,
  job_name VARCHAR(120) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'succeeded', 'failed')),
  logs TEXT NULL,
  stats JSONB NULL,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at TIMESTAMP NULL,
  duration_ms INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_runs_name ON job_runs (job_name);
CREATE INDEX IF NOT EXISTS idx_job_runs_status ON job_runs (status);

CREATE OR REPLACE TRIGGER trg_job_runs_updated_at
  BEFORE UPDATE ON job_runs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS request_metrics (
  id BIGSERIAL PRIMARY KEY,
  route_group VARCHAR(120) NOT NULL,
  count INT NOT NULL DEFAULT 0,
  error_count INT NOT NULL DEFAULT 0,
  latency_p50 INT NOT NULL DEFAULT 0,
  latency_p95 INT NOT NULL DEFAULT 0,
  latency_p99 INT NOT NULL DEFAULT 0,
  pool_active INT NOT NULL DEFAULT 0,
  pool_idle INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_request_metrics_route ON request_metrics (route_group);
CREATE INDEX IF NOT EXISTS idx_request_metrics_created ON request_metrics (created_at);

CREATE TABLE IF NOT EXISTS error_digests (
  id BIGSERIAL PRIMARY KEY,
  frame_hash CHAR(64) NOT NULL,
  message VARCHAR(500) NOT NULL,
  stack TEXT NULL,
  first_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_error_digests_hash UNIQUE (frame_hash)
);

CREATE INDEX IF NOT EXISTS idx_error_digests_last ON error_digests (last_seen);

CREATE OR REPLACE TRIGGER trg_error_digests_updated_at
  BEFORE UPDATE ON error_digests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
