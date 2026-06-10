const db = require('../config/db');

const produktetRepository = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT p.*, k.emri_kategorise 
            FROM produktet p
            LEFT JOIN kategorite k ON p.kategori_id = k.kategori_id
            ORDER BY p.produkt_id DESC
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT p.*, k.emri_kategorise 
            FROM produktet p
            LEFT JOIN kategorite k ON p.kategori_id = k.kategori_id
            WHERE p.produkt_id = ?
        `, [id]);
        return rows[0];
    },

    getByKategori: async (kategoriId) => {
        const [rows] = await db.query(`
            SELECT p.*, k.emri_kategorise 
            FROM produktet p
            LEFT JOIN kategorite k ON p.kategori_id = k.kategori_id
            WHERE p.kategori_id = ?
            ORDER BY p.emri_produktit ASC
        `, [kategoriId]);
        return rows;
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO produktet (kategori_id, emri_produktit, pershkrimi, cmimi_baze, foto_url, aktive, koha_pergatitjes_min, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [data.kategori_id, data.emri_produktit, data.pershkrimi, data.cmimi_baze, data.foto_url, data.aktive, data.koha_pergatitjes_min, data.created_by]
        );
        return { produkt_id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE produktet SET kategori_id = ?, emri_produktit = ?, pershkrimi = ?, cmimi_baze = ?, foto_url = ?, aktive = ?, koha_pergatitjes_min = ?, updated_by = ? WHERE produkt_id = ?',
            [data.kategori_id, data.emri_produktit, data.pershkrimi, data.cmimi_baze, data.foto_url, data.aktive, data.koha_pergatitjes_min, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM produktet WHERE produkt_id = ?', [id]);
        return result.affectedRows > 0;
    },

    search: async (filters = {}) => {
        let query = `
            SELECT p.*, k.emri_kategorise 
            FROM produktet p
            LEFT JOIN kategorite k ON p.kategori_id = k.kategori_id
            WHERE 1=1
        `;
        const params = [];

        if (filters.search) {
            query += ` AND (p.emri_produktit LIKE ? OR p.pershkrimi LIKE ?)`;
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        if (filters.kategori_id) {
            query += ` AND p.kategori_id = ?`;
            params.push(filters.kategori_id);
        }

        if (filters.cmimi_min) {
            query += ` AND p.cmimi_baze >= ?`;
            params.push(filters.cmimi_min);
        }

        if (filters.cmimi_max) {
            query += ` AND p.cmimi_baze <= ?`;
            params.push(filters.cmimi_max);
        }

        if (filters.aktive !== undefined && filters.aktive !== '') {
            query += ` AND p.aktive = ?`;
            params.push(filters.aktive);
        }

        const sortFields = {
            'emri': 'p.emri_produktit',
            'cmimi': 'p.cmimi_baze',
            'data': 'p.created_at',
            'kategoria': 'k.emri_kategorise'
        };
        const sortField = sortFields[filters.sort_by] || 'p.produkt_id';
        const sortOrder = filters.sort_order === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const [rows] = await db.query(query, params);
        return rows;
    }
};

module.exports = produktetRepository;