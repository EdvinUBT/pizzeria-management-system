const db = require('../config/db');

const userClaimsRepository = {
    getByUserId: async (userId) => {
        const [rows] = await db.query('SELECT * FROM user_claims WHERE user_id = ?', [userId]);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM user_claims WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO user_claims (user_id, claim_type, claim_value, created_by) VALUES (?, ?, ?, ?)',
            [data.user_id, data.claim_type, data.claim_value, data.created_by]
        );
        return { id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE user_claims SET claim_type = ?, claim_value = ?, updated_by = ? WHERE id = ?',
            [data.claim_type, data.claim_value, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM user_claims WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = userClaimsRepository;