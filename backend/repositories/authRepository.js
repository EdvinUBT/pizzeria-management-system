const db = require('../config/db');

const authRepository = {
    getUserByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    getUserById: async (id) => {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    createUser: async (data) => {
        const [result] = await db.query(
            'INSERT INTO users (emri, mbiemri, email, password_hash, phone_number) VALUES (?, ?, ?, ?, ?)',
            [data.emri, data.mbiemri, data.email, data.password_hash, data.phone_number]
        );
        return { id: result.insertId };
    },

    getRoleByEmertimi: async (emertimi) => {
        const [rows] = await db.query('SELECT id FROM roles WHERE emertimi = ?', [emertimi]);
        return rows[0];
    },

    assignRole: async (userId, roleId) => {
        await db.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);
    },

    createKlient: async (data) => {
        await db.query(
            'INSERT INTO klientet (emri, mbiemri, email, telefoni, fjalekalimi_hash) VALUES (?, ?, ?, ?, ?)',
            [data.emri, data.mbiemri, data.email, data.telefoni, data.fjalekalimi_hash]
        );
    },

    getKlientByEmail: async (email) => {
        const [rows] = await db.query('SELECT klient_id FROM klientet WHERE email = ?', [email]);
        return rows[0];
    },

    getUserRoles: async (userId) => {
        const [rows] = await db.query(
            `SELECT r.emertimi FROM roles r
             INNER JOIN user_roles ur ON r.id = ur.role_id
             WHERE ur.user_id = ?`,
            [userId]
        );
        return rows.map(r => r.emertimi);
    },

    incrementFailedAttempts: async (userId) => {
        await db.query('UPDATE users SET access_failed_count = access_failed_count + 1 WHERE id = ?', [userId]);
    },

    resetFailedAttempts: async (userId) => {
        await db.query('UPDATE users SET access_failed_count = 0 WHERE id = ?', [userId]);
    },

    saveRefreshToken: async (userId, token, expires) => {
        await db.query(
            'INSERT INTO refresh_tokens (user_id, token, expires) VALUES (?, ?, ?)',
            [userId, token, expires]
        );
    },

    getValidRefreshToken: async (token) => {
        const [rows] = await db.query(
            'SELECT * FROM refresh_tokens WHERE token = ? AND revoked IS NULL AND expires > NOW()',
            [token]
        );
        return rows[0];
    },

    revokeRefreshToken: async (token) => {
        await db.query('UPDATE refresh_tokens SET revoked = NOW() WHERE token = ?', [token]);
    },

    revokeAllRefreshTokens: async (userId) => {
        await db.query('UPDATE refresh_tokens SET revoked = NOW() WHERE user_id = ? AND revoked IS NULL', [userId]);
    }
};

module.exports = authRepository;