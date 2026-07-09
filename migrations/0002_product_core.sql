-- 0002: Product Core

CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  archived_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_projects_user ON projects (user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);

CREATE OR REPLACE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS brand_voices (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  name VARCHAR(160) NOT NULL,
  tone_sliders JSONB NULL,
  sample_texts TEXT NOT NULL,
  banned_words JSONB NULL,
  style_summary TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_brand_voices_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_brand_voices_user ON brand_voices (user_id);

CREATE OR REPLACE TRIGGER trg_brand_voices_updated_at
  BEFORE UPDATE ON brand_voices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS generations (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  project_id BIGINT NULL,
  brand_voice_id BIGINT NULL,
  funnel_type VARCHAR(25) NOT NULL CHECK (funnel_type IN ('vsl','lead_magnet','product_launch','webinar','ecom_pdp')),
  input_snapshot JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','complete','failed','cancelled')),
  credits_charged NUMERIC(6,2) NOT NULL DEFAULT 0,
  copy_score SMALLINT NULL,
  version INT NOT NULL DEFAULT 1,
  parent_generation_id BIGINT NULL,
  error_message VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_generations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_generations_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  CONSTRAINT fk_generations_voice FOREIGN KEY (brand_voice_id) REFERENCES brand_voices(id) ON DELETE SET NULL,
  CONSTRAINT fk_generations_parent FOREIGN KEY (parent_generation_id) REFERENCES generations(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_generations_user_created ON generations (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_generations_project ON generations (project_id);
CREATE INDEX IF NOT EXISTS idx_generations_brand_voice ON generations (brand_voice_id);
CREATE INDEX IF NOT EXISTS idx_generations_parent ON generations (parent_generation_id);
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations (status);

CREATE OR REPLACE TRIGGER trg_generations_updated_at
  BEFORE UPDATE ON generations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS generation_stages (
  id BIGSERIAL PRIMARY KEY,
  generation_id BIGINT NOT NULL,
  stage VARCHAR(20) NOT NULL CHECK (stage IN ('analysis','angles','framework','draft','polish')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','complete','failed')),
  output TEXT NULL,
  tokens_used INT NOT NULL DEFAULT 0,
  duration_ms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_generation_stages_gen FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE CASCADE,
  CONSTRAINT uq_generation_stages_gen_stage UNIQUE (generation_id, stage)
);

CREATE INDEX IF NOT EXISTS idx_generation_stages_gen ON generation_stages (generation_id);

CREATE OR REPLACE TRIGGER trg_generation_stages_updated_at
  BEFORE UPDATE ON generation_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS generation_assets (
  id BIGSERIAL PRIMARY KEY,
  generation_id BIGINT NOT NULL,
  asset_type VARCHAR(60) NOT NULL,
  content TEXT NOT NULL,
  variant CHAR(1) NULL,
  edited_content TEXT NULL,
  framework_note TEXT NULL,
  copy_score SMALLINT NULL,
  score_breakdown JSONB NULL,
  compliance_flags JSONB NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_generation_assets_gen FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_generation_assets_gen ON generation_assets (generation_id);

CREATE OR REPLACE TRIGGER trg_generation_assets_updated_at
  BEFORE UPDATE ON generation_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS templates (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(80) NOT NULL,
  description TEXT NULL,
  preview_image VARCHAR(500) NULL,
  funnel_type VARCHAR(25) NOT NULL CHECK (funnel_type IN ('vsl','lead_magnet','product_launch','webinar','ecom_pdp')),
  prompt_scaffold JSONB NOT NULL,
  is_premium SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_category ON templates (category);
CREATE INDEX IF NOT EXISTS idx_templates_funnel ON templates (funnel_type);

CREATE OR REPLACE TRIGGER trg_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS saved_copies (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  generation_asset_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  tags JSONB NULL,
  pinned SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_saved_copies_asset UNIQUE (generation_asset_id),
  CONSTRAINT fk_saved_copies_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_saved_copies_asset FOREIGN KEY (generation_asset_id) REFERENCES generation_assets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_saved_copies_user ON saved_copies (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_copies_asset ON saved_copies (generation_asset_id);

CREATE OR REPLACE TRIGGER trg_saved_copies_updated_at
  BEFORE UPDATE ON saved_copies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
