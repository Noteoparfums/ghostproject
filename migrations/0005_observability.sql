-- 0005: Observability & Background Jobs

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_type ENUM('user', 'admin', 'system', 'webhook') NOT NULL,
  actor_id BIGINT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(100) NULL,
  target_id BIGINT UNSIGNED NULL,
  properties JSON NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_audit_logs_actor (actor_type, actor_id),
  KEY idx_audit_logs_action (action),
  KEY idx_audit_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS job_runs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_name VARCHAR(120) NOT NULL,
  status ENUM('running', 'succeeded', 'failed') NOT NULL DEFAULT 'running',
  logs TEXT NULL,
  stats JSON NULL,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at TIMESTAMP NULL,
  duration_ms INT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_job_runs_name (job_name),
  KEY idx_job_runs_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS request_metrics (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  route_group VARCHAR(120) NOT NULL,
  count INT UNSIGNED NOT NULL DEFAULT 0,
  error_count INT UNSIGNED NOT NULL DEFAULT 0,
  latency_p50 INT UNSIGNED NOT NULL DEFAULT 0,
  latency_p95 INT UNSIGNED NOT NULL DEFAULT 0,
  latency_p99 INT UNSIGNED NOT NULL DEFAULT 0,
  pool_active INT UNSIGNED NOT NULL DEFAULT 0,
  pool_idle INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_request_metrics_route (route_group),
  KEY idx_request_metrics_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS error_digests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  frame_hash CHAR(64) NOT NULL,
  message VARCHAR(500) NOT NULL,
  stack TEXT NULL,
  first_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  count INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_error_digests_hash (frame_hash),
  KEY idx_error_digests_last (last_seen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
