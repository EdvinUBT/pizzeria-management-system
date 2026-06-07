const db = require('../config/db');

const produktPerberesitRepository = {
    getByProduktId: async (produktId) => {
        const [rows] = await db.query(`
            SELECT pp.*, p.emri_perberesit, p.njesia_matese, p.cmimi_shtese, p.alergjene
            FROM produkt_perberesit pp
            LEFT JOIN perberesit p ON pp.perberes_id = p.perberes_id
            WHERE pp.produkt_id = ?
        `, [produktId]);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM produkt_perberesit WHERE produkt_perberes_id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO produkt_perberesit (produkt_id, perberes_id, sasia_standarde, eshte_opsionale, created_by) VALUES (?, ?, ?, ?, ?)',
            [data.produkt_id, data.perberes_id, data.sasia_standarde, data.eshte_opsionale, data.created_by]
        );
        return { produkt_perberes_id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE produkt_perberesit SET sasia_standarde = ?, eshte_opsionale = ?, updated_by = ? WHERE produkt_perberes_id = ?',
            [data.sasia_standarde, data.eshte_opsionale, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (produktId, perberesId) => {
        const [result] = await db.query(
            'DELETE FROM produkt_perberesit WHERE produkt_id = ? AND perberes_id = ?',
            [produktId, perberesId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = produktPerberesitRepository;