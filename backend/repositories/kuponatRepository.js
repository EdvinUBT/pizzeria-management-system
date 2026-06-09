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
    },

    search: async (filters = {}) => {
        let query = `SELECT * FROM kuponat WHERE 1=1`;
        const params = [];

        if (filters.search) {
            query += ` AND kodi LIKE ?`;
            params.push(`%${filters.search}%`);
        }

        if (filters.aktiv !== undefined && filters.aktiv !== '') {
            query += ` AND aktiv = ?`;
            params.push(filters.aktiv);
        }

        if (filters.zbritja_min) {
            query += ` AND zbritja_perqind >= ?`;
            params.push(filters.zbritja_min);
        }

        if (filters.zbritja_max) {
            query += ` AND zbritja_perqind <= ?`;
            params.push(filters.zbritja_max);
        }

        if (filters.data_nga) {
            query += ` AND data_fillimit >= ?`;
            params.push(filters.data_nga);
        }

        if (filters.data_deri) {
            query += ` AND data_skadimit <= ?`;
            params.push(filters.data_deri);
        }

        if (filters.i_skaduar === 'true') {
            query += ` AND data_skadimit < CURDATE()`;
        } else if (filters.i_skaduar === 'false') {
            query += ` AND data_skadimit >= CURDATE()`;
        }

        const sortFields = {
            'kodi': 'kodi',
            'zbritja': 'zbritja_perqind',
            'data_fillimit': 'data_fillimit',
            'data_skadimit': 'data_skadimit'
        };
        const sortField = sortFields[filters.sort_by] || 'kupon_id';
        const sortOrder = filters.sort_order === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const [rows] = await db.query(query, params);
        return rows;
    }
};

module.exports = kuponatRepository;