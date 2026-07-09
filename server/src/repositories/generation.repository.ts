import { execute, query, queryOne, type TransactionConnection } from '../lib/db.js';
import type { GenerationStatus, Paginated } from '@ghostwriter/shared';
import { paginated } from '@ghostwriter/shared';

export interface GenerationRow {
  id: number;
  user_id: number;
  project_id: number | null;
  brand_voice_id: number | null;
  funnel_type: 'vsl' | 'lead_magnet' | 'product_launch' | 'webinar' | 'ecom_pdp';
  input_snapshot: any; // parsed JSON
  status: GenerationStatus;
  credits_charged: string; // DECIMAL mapped as string
  copy_score: number | null;
  version: number;
  parent_generation_id: number | null;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface GenerationAssetRow {
  id: number;
  generation_id: number;
  asset_type: string;
  content: string;
  variant: string | null; // CHAR(1)
  edited_content: string | null;
  framework_note: string | null;
  copy_score: number | null;
  score_breakdown: any; // parsed JSON
  compliance_flags: any; // parsed JSON
  created_at: Date;
  updated_at: Date;
  user_id: number;
  project_id: number | null;
  is_favorited: number;
}

export interface GenerationStageRow {
  id: number;
  generation_id: number;
  stage: 'analysis' | 'angles' | 'framework' | 'draft' | 'polish';
  status: 'pending' | 'running' | 'complete' | 'failed';
  output: string | null;
  tokens_used: number;
  duration_ms: number;
  created_at: Date;
  updated_at: Date;
}

export const generationRepository = {
  async create(data: {
    userId: number;
    projectId?: number | null;
    brandVoiceId?: number | null;
    funnelType: 'vsl' | 'lead_magnet' | 'product_launch' | 'webinar' | 'ecom_pdp';
    inputSnapshot: any;
    creditsCharged: number;
    parentGenerationId?: number | null;
  }, tx?: TransactionConnection): Promise<GenerationRow> {
    const result = await execute<{ id: number }>(
      `INSERT INTO generations 
      (user_id, project_id, brand_voice_id, funnel_type, input_snapshot, status, credits_charged, parent_generation_id) 
      VALUES (?, ?, ?, ?, ?, 'queued', ?, ?) RETURNING id`,
      [
        data.userId,
        data.projectId || null,
        data.brandVoiceId || null,
        data.funnelType,
        JSON.stringify(data.inputSnapshot),
        data.creditsCharged,
        data.parentGenerationId || null
      ],
      tx
    );
    const id = result.rows[0]!.id;
    return this.findById(id, tx) as Promise<GenerationRow>;
  },

  async findById(id: number, tx?: TransactionConnection): Promise<GenerationRow | null> {
    return queryOne<GenerationRow>('SELECT * FROM generations WHERE id = ?', [id], tx);
  },

  async findOwned(id: number, userId: number, tx?: TransactionConnection): Promise<GenerationRow | null> {
    return queryOne<GenerationRow>('SELECT * FROM generations WHERE id = ? AND user_id = ?', [id, userId], tx);
  },

  async update(id: number, updates: {
    status?: GenerationStatus;
    copyScore?: number | null;
    errorMessage?: string | null;
    version?: number;
  }, tx?: TransactionConnection): Promise<void> {
    const fields: string[] = [];
    const params: any[] = [];

    if (updates.status !== undefined) {
      fields.push('status = ?');
      params.push(updates.status);
    }
    if (updates.copyScore !== undefined) {
      fields.push('copy_score = ?');
      params.push(updates.copyScore);
    }
    if (updates.errorMessage !== undefined) {
      fields.push('error_message = ?');
      params.push(updates.errorMessage);
    }
    if (updates.version !== undefined) {
      fields.push('version = ?');
      params.push(updates.version);
    }

    if (fields.length > 0) {
      params.push(id);
      await execute(`UPDATE generations SET ${fields.join(', ')} WHERE id = ?`, params, tx);
    }
  },

  async setStatus(tx: TransactionConnection, id: number, status: GenerationStatus): Promise<void> {
    await execute('UPDATE generations SET status = ? WHERE id = ?', [status, id], tx);
  },

  async listByUser(userId: number, page = 1, perPage = 20, tx?: TransactionConnection): Promise<Paginated<GenerationRow>> {
    const offset = (page - 1) * perPage;
    const rows = await query<GenerationRow>(
      'SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, perPage, offset],
      tx
    );
    const countRow = await queryOne<{ count: number }>('SELECT COUNT(*) as count FROM generations WHERE user_id = ?', [userId], tx);
    
    return paginated(rows, { page, per_page: perPage }, Number(countRow?.count ?? 0));
  }
};

export const generationAssetRepository = {
  async create(data: {
    generationId: number;
    assetType: string;
    content: string;
    variant?: string | null;
    editedContent?: string | null;
    frameworkNote?: string | null;
    copyScore?: number | null;
    scoreBreakdown?: any;
    complianceFlags?: any;
  }, tx?: TransactionConnection): Promise<number> {
    const result = await execute<{ id: number }>(
      `INSERT INTO generation_assets 
      (generation_id, asset_type, content, variant, edited_content, framework_note, copy_score, score_breakdown, compliance_flags) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      [
        data.generationId,
        data.assetType,
        data.content,
        data.variant || null,
        data.editedContent || null,
        data.frameworkNote || null,
        data.copyScore || null,
        data.scoreBreakdown ? JSON.stringify(data.scoreBreakdown) : null,
        data.complianceFlags ? JSON.stringify(data.complianceFlags) : null
      ],
      tx
    );
    return result.rows[0]!.id;
  },

  async findById(id: number, tx?: TransactionConnection): Promise<GenerationAssetRow | null> {
    return queryOne<GenerationAssetRow>(
      `SELECT ga.*, g.user_id, g.project_id, CASE WHEN sc.id IS NOT NULL THEN 1 ELSE 0 END as is_favorited
       FROM generation_assets ga
       JOIN generations g ON ga.generation_id = g.id
       LEFT JOIN saved_copies sc ON ga.id = sc.generation_asset_id
       WHERE ga.id = ?`,
      [id],
      tx
    );
  },

  async listByGeneration(generationId: number, tx?: TransactionConnection): Promise<GenerationAssetRow[]> {
    return query<GenerationAssetRow>(
      `SELECT ga.*, g.user_id, g.project_id, CASE WHEN sc.id IS NOT NULL THEN 1 ELSE 0 END as is_favorited
       FROM generation_assets ga
       JOIN generations g ON ga.generation_id = g.id
       LEFT JOIN saved_copies sc ON ga.id = sc.generation_asset_id
       WHERE ga.generation_id = ?
       ORDER BY ga.created_at ASC`,
      [generationId],
      tx
    );
  },

  async listByProject(projectId: number, tx?: TransactionConnection): Promise<GenerationAssetRow[]> {
    return query<GenerationAssetRow>(
      `SELECT ga.*, g.user_id, g.project_id, CASE WHEN sc.id IS NOT NULL THEN 1 ELSE 0 END as is_favorited
       FROM generation_assets ga
       JOIN generations g ON ga.generation_id = g.id
       LEFT JOIN saved_copies sc ON ga.id = sc.generation_asset_id
       WHERE g.project_id = ?
       ORDER BY ga.created_at DESC`,
      [projectId],
      tx
    );
  },

  async update(id: number, updates: {
    editedContent?: string | null;
    copyScore?: number | null;
    scoreBreakdown?: any;
    complianceFlags?: any;
  }, tx?: TransactionConnection): Promise<void> {
    const fields: string[] = [];
    const params: any[] = [];

    if (updates.editedContent !== undefined) {
      fields.push('edited_content = ?');
      params.push(updates.editedContent);
    }
    if (updates.copyScore !== undefined) {
      fields.push('copy_score = ?');
      params.push(updates.copyScore);
    }
    if (updates.scoreBreakdown !== undefined) {
      fields.push('score_breakdown = ?');
      params.push(updates.scoreBreakdown ? JSON.stringify(updates.scoreBreakdown) : null);
    }
    if (updates.complianceFlags !== undefined) {
      fields.push('compliance_flags = ?');
      params.push(updates.complianceFlags ? JSON.stringify(updates.complianceFlags) : null);
    }

    if (fields.length > 0) {
      params.push(id);
      await execute(`UPDATE generation_assets SET ${fields.join(', ')} WHERE id = ?`, params, tx);
    }
  },

  async updateContent(id: number, content: string, tx?: TransactionConnection): Promise<void> {
    await this.update(id, { editedContent: content }, tx);
  },

  async toggleFavorite(id: number, isFavorited: boolean, tx?: TransactionConnection): Promise<void> {
    const asset = await this.findById(id, tx);
    if (!asset) return;

    if (isFavorited) {
      await execute(
        `INSERT INTO saved_copies (user_id, generation_asset_id, title)
         VALUES (?, ?, ?)
         ON CONFLICT (generation_asset_id) DO NOTHING`,
        [asset.user_id, id, `Saved Copy #${id}`],
        tx
      );
    } else {
      await execute(
        'DELETE FROM saved_copies WHERE generation_asset_id = ? AND user_id = ?',
        [id, asset.user_id],
        tx
      );
    }
  }
};

export const generationStageRepository = {
  async upsert(data: {
    generationId: number;
    stage: 'analysis' | 'angles' | 'framework' | 'draft' | 'polish';
    status: 'pending' | 'running' | 'complete' | 'failed';
    output?: string | null;
    tokensUsed?: number;
    durationMs?: number;
  }, tx?: TransactionConnection): Promise<void> {
    await execute(
      `INSERT INTO generation_stages 
      (generation_id, stage, status, output, tokens_used, duration_ms) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT (generation_id, stage) DO UPDATE SET
        status = EXCLUDED.status,
        output = COALESCE(EXCLUDED.output, generation_stages.output),
        tokens_used = EXCLUDED.tokens_used,
        duration_ms = EXCLUDED.duration_ms`,
      [
        data.generationId,
        data.stage,
        data.status,
        data.output || null,
        data.tokensUsed || 0,
        data.durationMs || 0
      ],
      tx
    );
  },

  async listByGeneration(generationId: number, tx?: TransactionConnection): Promise<GenerationStageRow[]> {
    return query<GenerationStageRow>('SELECT * FROM generation_stages WHERE generation_id = ? ORDER BY id ASC', [generationId], tx);
  }
};

export const generatedAssetRepository = generationAssetRepository;
