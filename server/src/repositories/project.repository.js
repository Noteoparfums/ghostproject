import { execute, query, queryOne } from '../lib/db.js';
import { paginated } from '@ghostwriter/shared';
export const projectRepository = {
    async create(userId, name, description, tx) {
        const result = await execute('INSERT INTO projects (user_id, name, description) VALUES (?, ?, ?) RETURNING id', [userId, name, description], tx);
        const id = result.rows[0].id;
        return this.findById(id, tx);
    },
    async findById(id, tx) {
        return queryOne('SELECT * FROM projects WHERE id = ?', [id], tx);
    },
    async update(id, updates, tx) {
        const fields = [];
        const params = [];
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
            }
            else {
                fields.push('archived_at = NULL');
            }
        }
        if (fields.length > 0) {
            params.push(id);
            await execute(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, params, tx);
        }
    },
    async delete(id, tx) {
        await execute('DELETE FROM projects WHERE id = ?', [id], tx);
    },
    async list(userId, status, page = 1, perPage = 20, tx) {
        const offset = (page - 1) * perPage;
        let sql = 'SELECT * FROM projects WHERE user_id = ?';
        const params = [userId];
        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }
        sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(perPage, offset);
        const rows = await query(sql, params, tx);
        // Get total count
        let countSql = 'SELECT COUNT(*) as count FROM projects WHERE user_id = ?';
        const countParams = [userId];
        if (status) {
            countSql += ' AND status = ?';
            countParams.push(status);
        }
        const countRow = await queryOne(countSql, countParams, tx);
        return paginated(rows, { page, per_page: perPage }, Number(countRow?.count ?? 0));
    }
};
//# sourceMappingURL=project.repository.js.map