import { query, queryOne, pool } from '../lib/db.js';
export const brandVoiceRepository = {
    async create(data, tx) {
        const executor = tx || pool;
        const [result] = await executor.execute('INSERT INTO brand_voices (user_id, name, tone_sliders, sample_texts, banned_words, style_summary) VALUES (?, ?, ?, ?, ?, ?)', [
            data.userId,
            data.name,
            JSON.stringify(data.toneSliders),
            data.sampleTexts,
            JSON.stringify(data.bannedWords),
            data.styleSummary
        ]);
        const id = result.insertId;
        return this.findById(id, tx);
    },
    async findById(id, tx) {
        return queryOne('SELECT * FROM brand_voices WHERE id = ?', [id], tx);
    },
    async update(id, updates, tx) {
        const executor = tx || pool;
        const fields = [];
        const params = [];
        if (updates.name !== undefined) {
            fields.push('name = ?');
            params.push(updates.name);
        }
        if (updates.toneSliders !== undefined) {
            fields.push('tone_sliders = ?');
            params.push(JSON.stringify(updates.toneSliders));
        }
        if (updates.sampleTexts !== undefined) {
            fields.push('sample_texts = ?');
            params.push(updates.sampleTexts);
        }
        if (updates.bannedWords !== undefined) {
            fields.push('banned_words = ?');
            params.push(JSON.stringify(updates.bannedWords));
        }
        if (updates.styleSummary !== undefined) {
            fields.push('style_summary = ?');
            params.push(updates.styleSummary);
        }
        if (fields.length > 0) {
            params.push(id);
            await executor.execute(`UPDATE brand_voices SET ${fields.join(', ')} WHERE id = ?`, params);
        }
    },
    async delete(id, tx) {
        const executor = tx || pool;
        await executor.execute('DELETE FROM brand_voices WHERE id = ?', [id]);
    },
    async list(userId, tx) {
        return query('SELECT * FROM brand_voices WHERE user_id = ? ORDER BY created_at DESC', [userId], tx);
    }
};
//# sourceMappingURL=brand_voice.repository.js.map