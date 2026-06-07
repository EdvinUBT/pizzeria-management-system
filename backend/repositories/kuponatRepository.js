const db = require('../config/db');

const kuponatRepository = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM kuponat ORDER BY kupon_id DESC');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM kuponat WHERE kupon_id = ?', [id]);
        return rows[0];
    },

    getByKod: async (kodi) => {
        const [rows] = await db.query(
            'SELECT * FROM kuponat WHERE kodi = ? AND aktiv = TRUE AND data_skadimit >= CURDATE() AND perdorimet_aktuale < perdorimet_max',
            [kodi]
        );
        return rows[0];
    },

    getByKodOnly: async (kodi) => {
        const [rows] = await db.query('SELECT kupon_id FROM kuponat WHERE kodi = ?', [kodi]);
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO kuponat (kodi, zbritja_perqind, zbritja_max, porosi_min, data_fillimit, data_skadimit, perdorimet_max, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [data.kodi, data.zbritja_perqind, data.zbritja_max, data.porosi_min, data.data_fillimit, data.data_skadimit, data.perdorimet_max, data.created_by]
        );
        return { kupon_id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE kuponat SET kodi = ?, zbritja_perqind = ?, zbritja_max = ?, porosi_min = ?, data_fillimit = ?, data_skadimit = ?, perdorimet_max = ?, aktiv = ?, updated_by = ? WHERE kupon_id = ?',
            [data.kodi, data.zbritja_perqind, data.zbritja_max, data.porosi_min, data.data_fillimit, data.data_skadimit, data.perdorimet_max, data.aktiv, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    getPorosiTotali: async (porosiId) => {
        const [rows] = await db.query('SELECT totali FROM porosite WHERE porosi_id = ?', [porosiId]);
        return rows[0];
    },

    updatePorosiTotali: async (porosiId, totali) => {
        await db.query('UPDATE porosite SET totali = ? WHERE porosi_id = ?', [totali, porosiId]);
    },

    incrementPerdorimet: async (kuponId) => {
        await db.query('UPDATE kuponat SET perdorimet_aktuale = perdorimet_aktuale + 1 WHERE kupon_id = ?', [kuponId]);
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM kuponat WHERE kupon_id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = kuponatRepository;