import { query, queryOne, pool, type TransactionConnection } from '../lib/db.js';

export interface BrandVoiceRow {
  id: number;
  user_id: number;
  name: string;
  tone_sliders: any;
  sample_texts: string;
  banned_words: any;
  style_summary: string | null;
  created_at: Date;
  updated_at: Date;
}

export const brandVoiceRepository = {
  async create(data: {
    userId: number;
    name: string;
    toneSliders: any;
    sampleTexts: string;
    bannedWords: any;
    styleSummary: string;
  }, tx?: TransactionConnection): Promise<BrandVoiceRow> {
    const executor = tx || pool;
    const [result] = await executor.execute(
      'INSERT INTO brand_voices (user_id, name, tone_sliders, sample_texts, banned_words, style_summary) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.userId,
        data.name,
        JSON.stringify(data.toneSliders),
        data.sampleTexts,
        JSON.stringify(data.bannedWords),
        data.styleSummary
      ]
    );
    const id = (result as any).insertId;
    return this.findById(id, tx) as Promise<BrandVoiceRow>;
  },

  async findById(id: number, tx?: TransactionConnection): Promise<BrandVoiceRow | null> {
    return queryOne<BrandVoiceRow>('SELECT * FROM brand_voices WHERE id = ?', [id], tx);
  },

  async update(id: number, updates: {
    name?: string;
    toneSliders?: any;
    sampleTexts?: string;
    bannedWords?: any;
    styleSummary?: string;
  }, tx?: TransactionConnection): Promise<void> {
    const executor = tx || pool;
    const fields: string[] = [];
    const params: any[] = [];
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

  async delete(id: number, tx?: TransactionConnection): Promise<void> {
    const executor = tx || pool;
    await executor.execute('DELETE FROM brand_voices WHERE id = ?', [id]);
  },

  async list(userId: number, tx?: TransactionConnection): Promise<BrandVoiceRow[]> {
    return query<BrandVoiceRow>('SELECT * FROM brand_voices WHERE user_id = ? ORDER BY created_at DESC', [userId], tx);
  }
};
