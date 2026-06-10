const db = require('../config/db');

const usersRepository = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT u.id, u.emri, u.mbiemri, u.email, u.phone_number, 
                   u.email_confirmed, u.lockout_enabled, u.access_failed_count,
                   u.data_krijimit, u.statusi,
                   GROUP_CONCAT(r.emertimi) AS rolet
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            GROUP BY u.id
            ORDER BY u.id DESC
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT u.id, u.emri, u.mbiemri, u.email, u.phone_number,
                   u.email_confirmed, u.lockout_enabled, u.access_failed_count,
                   u.data_krijimit, u.statusi,
                   GROUP_CONCAT(r.emertimi) AS rolet
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.id = ?
            GROUP BY u.id
        `, [id]);
        return rows[0];
    },

    getByEmail: async (email) => {
        const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO users (emri, mbiemri, email, password_hash, phone_number, statusi, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.emri, data.mbiemri, data.email, data.password_hash, data.phone_number, data.statusi, data.created_by]
        );
        return { id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE users SET emri = ?, mbiemri = ?, email = ?, phone_number = ?, statusi = ?, updated_by = ? WHERE id = ?',
            [data.emri, data.mbiemri, data.email, data.phone_number, data.statusi, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    updateStatusi: async (id, statusi, userId) => {
        const [result] = await db.query(
            'UPDATE users SET statusi = ?, updated_by = ? WHERE id = ?',
            [statusi, userId, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = usersRepository;