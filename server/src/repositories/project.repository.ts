import { execute, query, queryOne, type TransactionConnection } from '../lib/db.js';
import type { ProjectStatus, Paginated } from '@ghostwriter/shared';
import { paginated } from '@ghostwriter/shared';

export interface ProjectRow {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  archived_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export const projectRepository = {
  async create(userId: number, name: string, description: string, tx?: TransactionConnection): Promise<ProjectRow> {
    const result = await execute<{ id: number }>(
      'INSERT INTO projects (user_id, name, description) VALUES (?, ?, ?) RETURNING id',
      [userId, name, description],
      tx
    );
    const id = result.rows[0]!.id;
    return this.findById(id, tx) as Promise<ProjectRow>;
  },

  async findById(id: number, tx?: TransactionConnection): Promise<ProjectRow | null> {
    return queryOne<ProjectRow>('SELECT * FROM projects WHERE id = ?', [id], tx);
  },

  async update(id: number, updates: { name?: string; description?: string; status?: ProjectStatus }, tx?: TransactionConnection): Promise<void> {
    const fields: string[] = [];
    const params: any[] = [];
    if (updates.name !== undefined) {
      fields.push('name = ?');
      params.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      params.push(updates.description);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      params.push(updates.status);
      if (updates.status === 'archived') {
        fields.push('archived_at = NOW()');
      } else {
        fields.push('archived_at = NULL');
      }
    }
    if (fields.length > 0) {
      params.push(id);
      await execute(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, params, tx);
    }
  },

  async delete(id: number, tx?: TransactionConnection): Promise<void> {
    await execute('DELETE FROM projects WHERE id = ?', [id], tx);
  },

  async list(userId: number, status?: ProjectStatus, page = 1, perPage = 20, tx?: TransactionConnection): Promise<Paginated<ProjectRow>> {
    const offset = (page - 1) * perPage;
    let sql = 'SELECT * FROM projects WHERE user_id = ?';
    const params: any[] = [userId];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(perPage, offset);

    const rows = await query<ProjectRow>(sql, params, tx);

    // Get total count
    let countSql = 'SELECT COUNT(*) as count FROM projects WHERE user_id = ?';
    const countParams: any[] = [userId];
    if (status) {
      countSql += ' AND status = ?';
      countParams.push(status);
    }
    const countRow = await queryOne<{ count: number }>(countSql, countParams, tx);

    return paginated(rows, { page, per_page: perPage }, Number(countRow?.count ?? 0));
  }
};
