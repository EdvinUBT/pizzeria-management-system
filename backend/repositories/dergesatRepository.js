const db = require('../config/db');

const dergesatRepository = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT d.*, p.totali, p.statusi AS statusi_porosise, 
                   pu.emri AS emri_shoferit, pu.mbiemri AS mbiemri_shoferit,
                   k.emri AS emri_klientit, k.mbiemri AS mbiemri_klientit
            FROM dergesat d
            LEFT JOIN porosite p ON d.porosi_id = p.porosi_id
            LEFT JOIN punonjesit pu ON d.punonjes_id = pu.punonjes_id
            LEFT JOIN klientet k ON p.klient_id = k.klient_id
            ORDER BY d.dergese_id DESC
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT d.*, p.totali, p.statusi AS statusi_porosise,
                   pu.emri AS emri_shoferit, pu.mbiemri AS mbiemri_shoferit,
                   k.emri AS emri_klientit, k.mbiemri AS mbiemri_klientit
            FROM dergesat d
            LEFT JOIN porosite p ON d.porosi_id = p.porosi_id
            LEFT JOIN punonjesit pu ON d.punonjes_id = pu.punonjes_id
            LEFT JOIN klientet k ON p.klient_id = k.klient_id
            WHERE d.dergese_id = ?
        `, [id]);
        return rows[0];
    },

    getPorosiId: async (dergeseId) => {
        const [rows] = await db.query('SELECT porosi_id FROM dergesat WHERE dergese_id = ?', [dergeseId]);
        return rows[0]?.porosi_id;
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO dergesat (porosi_id, punonjes_id, koha_nisjes, adresa, created_by) VALUES (?, ?, NOW(), ?, ?)',
            [data.porosi_id, data.punonjes_id, data.adresa, data.created_by]
        );
        return { dergese_id: result.insertId };
    },

    updateStatusi: async (id, statusi, userId) => {
        let query = 'UPDATE dergesat SET statusi = ?, updated_by = ?';
        let params = [statusi, userId];

        if (statusi === 'dorezuar') {
            query += ', koha_dergeses = NOW()';
        }

        query += ' WHERE dergese_id = ?';
        params.push(id);

        const [result] = await db.query(query, params);
        return result.affectedRows > 0;
    },

    updatePorosiStatusi: async (porosiId, statusi) => {
        await db.query('UPDATE porosite SET statusi = ? WHERE porosi_id = ?', [statusi, porosiId]);
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM dergesat WHERE dergese_id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = dergesatRepository;