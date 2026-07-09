-- 0002: Product Core

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  status ENUM('active','archived') NOT NULL DEFAULT 'active',
  archived_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_projects_user (user_id),
  KEY idx_projects_status (status),
  CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS brand_voices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  tone_sliders JSON NULL,
  sample_texts TEXT NOT NULL,
  banned_words JSON NULL,
  style_summary TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_brand_voices_user (user_id),
  CONSTRAINT fk_brand_voices_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS generations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  project_id BIGINT UNSIGNED NULL,
  brand_voice_id BIGINT UNSIGNED NULL,
  funnel_type ENUM('vsl','lead_magnet','product_launch','webinar','ecom_pdp') NOT NULL,
  input_snapshot JSON NOT NULL,
  status ENUM('queued','running','complete','failed','cancelled') NOT NULL DEFAULT 'queued',
  credits_charged DECIMAL(6,2) NOT NULL DEFAULT 0,
  copy_score TINYINT UNSIGNED NULL,
  version INT NOT NULL DEFAULT 1,
  parent_generation_id BIGINT UNSIGNED NULL,
  error_message VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_generations_user_created (user_id, created_at),
  KEY idx_generations_project (project_id),
  KEY idx_generations_brand_voice (brand_voice_id),
  KEY idx_generations_parent (parent_generation_id),
  KEY idx_generations_status (status),
  CONSTRAINT fk_generations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_generations_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  CONSTRAINT fk_generations_voice FOREIGN KEY (brand_voice_id) REFERENCES brand_voices(id) ON DELETE SET NULL,
  CONSTRAINT fk_generations_parent FOREIGN KEY (parent_generation_id) REFERENCES generations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS generation_stages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  generation_id BIGINT UNSIGNED NOT NULL,
  stage ENUM('analysis','angles','framework','draft','polish') NOT NULL,
  status ENUM('pending','running','complete','failed') NOT NULL DEFAULT 'pending',
  output MEDIUMTEXT NULL,
  tokens_used INT NOT NULL DEFAULT 0,
  duration_ms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_generation_stages_gen (generation_id),
  CONSTRAINT fk_generation_stages_gen FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS generation_assets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  generation_id BIGINT UNSIGNED NOT NULL,
  asset_type VARCHAR(60) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  variant CHAR(1) NULL,
  edited_content MEDIUMTEXT NULL,
  framework_note TEXT NULL,
  copy_score TINYINT UNSIGNED NULL,
  score_breakdown JSON NULL,
  compliance_flags JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_generation_assets_gen (generation_id),
  CONSTRAINT fk_generation_assets_gen FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS templates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(80) NOT NULL,
  description TEXT NULL,
  preview_image VARCHAR(500) NULL,
  funnel_type ENUM('vsl','lead_magnet','product_launch','webinar','ecom_pdp') NOT NULL,
  prompt_scaffold JSON NOT NULL,
  is_premium TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_templates_category (category),
  KEY idx_templates_funnel (funnel_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS saved_copies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  generation_asset_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  tags JSON NULL,
  pinned TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_saved_copies_user (user_id),
  KEY idx_saved_copies_asset (generation_asset_id),
  CONSTRAINT fk_saved_copies_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_saved_copies_asset FOREIGN KEY (generation_asset_id) REFERENCES generation_assets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
