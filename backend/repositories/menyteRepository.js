const db = require('../config/db');

const menyteRepository = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM menyte ORDER BY meny_id DESC');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM menyte WHERE meny_id = ?', [id]);
        return rows[0];
    },

    getProduktet: async (menyId) => {
        const [rows] = await db.query(`
            SELECT mp.*, p.emri_produktit, p.pershkrimi, p.cmimi_baze, p.foto_url
            FROM meny_produktet mp
            LEFT JOIN produktet p ON mp.produkt_id = p.produkt_id
            WHERE mp.meny_id = ?
            ORDER BY mp.renditja ASC
        `, [menyId]);
        return rows;
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO menyte (emri_menys, pershkrimi, data_fillimit, data_mbarimit, aktive, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [data.emri_menys, data.pershkrimi, data.data_fillimit, data.data_mbarimit, data.aktive, data.created_by]
        );
        return { meny_id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE menyte SET emri_menys = ?, pershkrimi = ?, data_fillimit = ?, data_mbarimit = ?, aktive = ?, updated_by = ? WHERE meny_id = ?',
            [data.emri_menys, data.pershkrimi, data.data_fillimit, data.data_mbarimit, data.aktive, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    shtoProdukt: async (data) => {
        const [result] = await db.query(
            'INSERT INTO meny_produktet (meny_id, produkt_id, cmimi_special, renditja, created_by) VALUES (?, ?, ?, ?, ?)',
            [data.meny_id, data.produkt_id, data.cmimi_special, data.renditja, data.created_by]
        );
        return { meny_produkt_id: result.insertId };
    },

    hiqProdukt: async (menyId, produktId) => {
        const [result] = await db.query(
            'DELETE FROM meny_produktet WHERE meny_id = ? AND produkt_id = ?',
            [menyId, produktId]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM menyte WHERE meny_id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = menyteRepository;