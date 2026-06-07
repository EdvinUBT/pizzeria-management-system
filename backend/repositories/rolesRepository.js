const db = require('../config/db');

const rolesRepository = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM roles ORDER BY id ASC');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
        return rows[0];
    },

    getByEmertimi: async (emertimi) => {
        const [rows] = await db.query('SELECT id FROM roles WHERE emertimi = ?', [emertimi]);
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO roles (emertimi, pershkrimi, normalized_name, created_by) VALUES (?, ?, ?, ?)',
            [data.emertimi, data.pershkrimi, data.normalized_name, data.created_by]
        );
        return { id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE roles SET emertimi = ?, pershkrimi = ?, normalized_name = ?, updated_by = ? WHERE id = ?',
            [data.emertimi, data.pershkrimi, data.normalized_name, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM roles WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = rolesRepository;