const db = require('../config/db');

const klientetRepository = {
    getAll: async () => {
        const [rows] = await db.query('SELECT klient_id, emri, mbiemri, email, telefoni, adresa, data_regjistrimit FROM klientet ORDER BY klient_id DESC');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT klient_id, emri, mbiemri, email, telefoni, adresa, data_regjistrimit FROM klientet WHERE klient_id = ?', [id]);
        return rows[0];
    },

    getByEmail: async (email) => {
        const [rows] = await db.query('SELECT klient_id FROM klientet WHERE email = ?', [email]);
        return rows[0];
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO klientet (emri, mbiemri, email, telefoni, adresa, fjalekalimi_hash, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.emri, data.mbiemri, data.email, data.telefoni, data.adresa, data.fjalekalimi_hash, data.created_by]
        );
        return { klient_id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE klientet SET emri = ?, mbiemri = ?, email = ?, telefoni = ?, adresa = ?, updated_by = ? WHERE klient_id = ?',
            [data.emri, data.mbiemri, data.email, data.telefoni, data.adresa, data.updated_by, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM klientet WHERE klient_id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = klientetRepository;