import { execute, query, queryOne } from '../lib/db.js';
import { paginated } from '@ghostwriter/shared';
export const generationRepository = {
    async create(data, tx) {
        const result = await execute(`INSERT INTO generations 
      (user_id, project_id, brand_voice_id, funnel_type, input_snapshot, status, credits_charged, parent_generation_id) 
      VALUES (?, ?, ?, ?, ?, 'queued', ?, ?) RETURNING id`, [
            data.userId,
            data.projectId || null,
            data.brandVoiceId || null,
            data.funnelType,
            JSON.stringify(data.inputSnapshot),
            data.creditsCharged,
            data.parentGenerationId || null
        ], tx);
        const id = result.rows[0].id;
        return this.findById(id, tx);
    },
    async findById(id, tx) {
        return queryOne('SELECT * FROM generations WHERE id = ?', [id], tx);
    },
    async findOwned(id, userId, tx) {
        return queryOne('SELECT * FROM generations WHERE id = ? AND user_id = ?', [id, userId], tx);
    },
    async update(id, updates, tx) {
        const fields = [];
        const params = [];
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
    async setStatus(tx, id, status) {
        await execute('UPDATE generations SET status = ? WHERE id = ?', [status, id], tx);
    },
    async listByUser(userId, page = 1, perPage = 20, tx) {
        const offset = (page - 1) * perPage;
        const rows = await query('SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?', [userId, perPage, offset], tx);
        const countRow = await queryOne('SELECT COUNT(*) as count FROM generations WHERE user_id = ?', [userId], tx);
        return paginated(rows, { page, per_page: perPage }, Number(countRow?.count ?? 0));
    }
};
export const generationAssetRepository = {
    async create(data, tx) {
        const result = await execute(`INSERT INTO generation_assets 
      (generation_id, asset_type, content, variant, edited_content, framework_note, copy_score, score_breakdown, compliance_flags) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`, [
            data.generationId,
            data.assetType,
            data.content,
            data.variant || null,
            data.editedContent || null,
            data.frameworkNote || null,
            data.copyScore || null,
            data.scoreBreakdown ? JSON.stringify(data.scoreBreakdown) : null,
            data.complianceFlags ? JSON.stringify(data.complianceFlags) : null
        ], tx);
        return result.rows[0].id;
    },
    async findById(id, tx) {
        return queryOne(`SELECT ga.*, g.user_id, g.project_id, CASE WHEN sc.id IS NOT NULL THEN 1 ELSE 0 END as is_favorited
       FROM generation_assets ga
       JOIN generations g ON ga.generation_id = g.id
       LEFT JOIN saved_copies sc ON ga.id = sc.generation_asset_id
       WHERE ga.id = ?`, [id], tx);
    },
    async listByGeneration(generationId, tx) {
        return query(`SELECT ga.*, g.user_id, g.project_id, CASE WHEN sc.id IS NOT NULL THEN 1 ELSE 0 END as is_favorited
       FROM generation_assets ga
       JOIN generations g ON ga.generation_id = g.id
       LEFT JOIN saved_copies sc ON ga.id = sc.generation_asset_id
       WHERE ga.generation_id = ?
       ORDER BY ga.created_at ASC`, [generationId], tx);
    },
    async listByProject(projectId, tx) {
        return query(`SELECT ga.*, g.user_id, g.project_id, CASE WHEN sc.id IS NOT NULL THEN 1 ELSE 0 END as is_favorited
       FROM generation_assets ga
       JOIN generations g ON ga.generation_id = g.id
       LEFT JOIN saved_copies sc ON ga.id = sc.generation_asset_id
       WHERE g.project_id = ?
       ORDER BY ga.created_at DESC`, [projectId], tx);
    },
    async update(id, updates, tx) {
        const fields = [];
        const params = [];
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
    async updateContent(id, content, tx) {
        await this.update(id, { editedContent: content }, tx);
    },
    async toggleFavorite(id, isFavorited, tx) {
        const asset = await this.findById(id, tx);
        if (!asset)
            return;
        if (isFavorited) {
            await execute(`INSERT INTO saved_copies (user_id, generation_asset_id, title)
         VALUES (?, ?, ?)
         ON CONFLICT (generation_asset_id) DO NOTHING`, [asset.user_id, id, `Saved Copy #${id}`], tx);
        }
        else {
            await execute('DELETE FROM saved_copies WHERE generation_asset_id = ? AND user_id = ?', [id, asset.user_id], tx);
        }
    }
};
export const generationStageRepository = {
    async upsert(data, tx) {
        await execute(`INSERT INTO generation_stages 
      (generation_id, stage, status, output, tokens_used, duration_ms) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT (generation_id, stage) DO UPDATE SET
        status = EXCLUDED.status,
        output = COALESCE(EXCLUDED.output, generation_stages.output),
        tokens_used = EXCLUDED.tokens_used,
        duration_ms = EXCLUDED.duration_ms`, [
            data.generationId,
            data.stage,
            data.status,
            data.output || null,
            data.tokensUsed || 0,
            data.durationMs || 0
        ], tx);
    },
    async listByGeneration(generationId, tx) {
        return query('SELECT * FROM generation_stages WHERE generation_id = ? ORDER BY id ASC', [generationId], tx);
    }
};
export const generatedAssetRepository = generationAssetRepository;
//# sourceMappingURL=generation.repository.js.map