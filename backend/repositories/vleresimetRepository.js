const db = require('../config/db');

const vleresimetRepository = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT v.*, k.emri, k.mbiemri
            FROM vleresimet v
            LEFT JOIN klientet k ON v.klient_id = k.klient_id
            ORDER BY v.data_vleresimit DESC
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM vleresimet WHERE vleresim_id = ?', [id]);
        return rows[0];
    },

    getByPorosiId: async (porosiId) => {
        const [rows] = await db.query(`
            SELECT v.*, k.emri, k.mbiemri
            FROM vleresimet v
            LEFT JOIN klientet k ON v.klient_id = k.klient_id
            WHERE v.porosi_id = ?
        `, [porosiId]);
        return rows;
    },

    getByKlientAndPorosi: async (klientId, porosiId) => {
        const [rows] = await db.query(
            'SELECT vleresim_id FROM vleresimet WHERE klient_id = ? AND porosi_id = ?',
            [klientId, porosiId]
        );
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO vleresimet (klient_id, porosi_id, yjet, komenti, created_by) VALUES (?, ?, ?, ?, ?)',
            [data.klient_id, data.porosi_id, data.yjet, data.komenti, data.created_by]
        );
        return { vleresim_id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE vleresimet SET yjet = ?, komenti = ?, updated_by = ? WHERE vleresim_id = ?',
            [data.yjet, data.komenti, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM vleresimet WHERE vleresim_id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = vleresimetRepository;