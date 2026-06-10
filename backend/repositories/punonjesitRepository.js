const db = require('../config/db');

const punonjesitRepository = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM punonjesit ORDER BY punonjes_id DESC');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM punonjesit WHERE punonjes_id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO punonjesit (emri, mbiemri, roli, telefoni, email, aktiv, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.emri, data.mbiemri, data.roli, data.telefoni, data.email, data.aktiv, data.created_by]
        );
        return { punonjes_id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE punonjesit SET emri = ?, mbiemri = ?, roli = ?, telefoni = ?, email = ?, aktiv = ?, updated_by = ? WHERE punonjes_id = ?',
            [data.emri, data.mbiemri, data.roli, data.telefoni, data.email, data.aktiv, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM punonjesit WHERE punonjes_id = ?', [id]);
        return result.affectedRows > 0;
    },

    search: async (filters = {}) => {
        let query = `SELECT * FROM punonjesit WHERE 1=1`;
        const params = [];

        if (filters.search) {
            query += ` AND (emri LIKE ? OR mbiemri LIKE ? OR email LIKE ? OR telefoni LIKE ?)`;
            params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
        }

        if (filters.roli) {
            query += ` AND roli = ?`;
            params.push(filters.roli);
        }

        if (filters.aktiv !== undefined && filters.aktiv !== '') {
            query += ` AND aktiv = ?`;
            params.push(filters.aktiv);
        }

        const sortFields = {
            'emri': 'emri',
            'mbiemri': 'mbiemri',
            'roli': 'roli',
            'email': 'email'
        };
        const sortField = sortFields[filters.sort_by] || 'punonjes_id';
        const sortOrder = filters.sort_order === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const [rows] = await db.query(query, params);
        return rows;
    }
};

module.exports = punonjesitRepository;