const db = require('../config/db');

const userRolesRepository = {
    getByUserId: async (userId) => {
        const [rows] = await db.query(`
            SELECT ur.id, ur.user_id, ur.role_id, r.emertimi, r.pershkrimi
            FROM user_roles ur
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = ?
        `, [userId]);
        return rows;
    },

    getByUserAndRole: async (userId, roleId) => {
        const [rows] = await db.query(
            'SELECT id FROM user_roles WHERE user_id = ? AND role_id = ?',
            [userId, roleId]
        );
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO user_roles (user_id, role_id, created_by) VALUES (?, ?, ?)',
            [data.user_id, data.role_id, data.created_by]
        );
        return { id: result.insertId, ...data };
    },

    delete: async (userId, roleId) => {
        const [result] = await db.query(
            'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?',
            [userId, roleId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = userRolesRepository;