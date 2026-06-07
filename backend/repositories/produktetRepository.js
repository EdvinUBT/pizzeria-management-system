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
    }
};

module.exports = produktetRepository;