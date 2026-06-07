const db = require('../config/db');

const adresatRepository = {
    getByKlientId: async (klientId) => {
        const [rows] = await db.query(
            'SELECT * FROM adresat WHERE klient_id = ? ORDER BY eshte_default DESC',
            [klientId]
        );
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM adresat WHERE adrese_id = ?', [id]);
        return rows[0];
    },

    resetDefault: async (klientId) => {
        await db.query('UPDATE adresat SET eshte_default = FALSE WHERE klient_id = ?', [klientId]);
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO adresat (klient_id, emertimi, adresa, qyteti, kodi_postar, eshte_default, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.klient_id, data.emertimi, data.adresa, data.qyteti, data.kodi_postar, data.eshte_default, data.created_by]
        );
        return { adrese_id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE adresat SET emertimi = ?, adresa = ?, qyteti = ?, kodi_postar = ?, eshte_default = ?, updated_by = ? WHERE adrese_id = ?',
            [data.emertimi, data.adresa, data.qyteti, data.kodi_postar, data.eshte_default, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM adresat WHERE adrese_id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = adresatRepository;