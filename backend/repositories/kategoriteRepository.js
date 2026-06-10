const db = require('../config/db');

const kategoriteRepository = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM kategorite ORDER BY renditja ASC');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM kategorite WHERE kategori_id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO kategorite (emri_kategorise, pershkrimi, renditja, aktive, created_by) VALUES (?, ?, ?, ?, ?)',
            [data.emri_kategorise, data.pershkrimi, data.renditja, data.aktive, data.created_by]
        );
        return { kategori_id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE kategorite SET emri_kategorise = ?, pershkrimi = ?, renditja = ?, aktive = ?, updated_by = ? WHERE kategori_id = ?',
            [data.emri_kategorise, data.pershkrimi, data.renditja, data.aktive, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM kategorite WHERE kategori_id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = kategoriteRepository;