const db = require('../config/db');

const perberesitRepository = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM perberesit ORDER BY emri_perberesit ASC');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM perberesit WHERE perberes_id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO perberesit (emri_perberesit, njesia_matese, sasia_stok, cmimi_shtese, alergjene, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [data.emri_perberesit, data.njesia_matese, data.sasia_stok, data.cmimi_shtese, data.alergjene, data.created_by]
        );
        return { perberes_id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE perberesit SET emri_perberesit = ?, njesia_matese = ?, sasia_stok = ?, cmimi_shtese = ?, alergjene = ?, updated_by = ? WHERE perberes_id = ?',
            [data.emri_perberesit, data.njesia_matese, data.sasia_stok, data.cmimi_shtese, data.alergjene, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM perberesit WHERE perberes_id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = perberesitRepository;