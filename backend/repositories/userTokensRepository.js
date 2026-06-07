const db = require('../config/db');

const userTokensRepository = {
    getByUserId: async (userId) => {
        const [rows] = await db.query(
            'SELECT id, user_id, login_provider, token_name FROM user_tokens WHERE user_id = ?',
            [userId]
        );
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM user_tokens WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO user_tokens (user_id, login_provider, token_name, token_value, created_by) VALUES (?, ?, ?, ?, ?)',
            [data.user_id, data.login_provider, data.token_name, data.token_value, data.created_by]
        );
        return { id: result.insertId, ...data };
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM user_tokens WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    deleteAllByUserId: async (userId) => {
        await db.query('DELETE FROM user_tokens WHERE user_id = ?', [userId]);
    }
};

module.exports = userTokensRepository;