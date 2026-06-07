const db = require('../config/db');

const porositeRepository = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT p.*, k.emri, k.mbiemri, k.email, k.telefoni
            FROM porosite p
            LEFT JOIN klientet k ON p.klient_id = k.klient_id
            ORDER BY p.data_porosise DESC
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT p.*, k.emri, k.mbiemri, k.email, k.telefoni
            FROM porosite p
            LEFT JOIN klientet k ON p.klient_id = k.klient_id
            WHERE p.porosi_id = ?
        `, [id]);
        return rows[0];
    },

    getDetajet: async (porosiId) => {
        const [rows] = await db.query(`
            SELECT dp.*, pr.emri_produktit
            FROM detajet_porosise dp
            LEFT JOIN produktet pr ON dp.produkt_id = pr.produkt_id
            WHERE dp.porosi_id = ?
        `, [porosiId]);
        return rows;
    },

    getByKlientId: async (klientId) => {
        const [rows] = await db.query(
            'SELECT * FROM porosite WHERE klient_id = ? ORDER BY data_porosise DESC',
            [klientId]
        );
        return rows;
    },

    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO porosite (klient_id, metoda_pageses, adresa_dergeses, shenimet, created_by) VALUES (?, ?, ?, ?, ?)',
            [data.klient_id, data.metoda_pageses, data.adresa_dergeses, data.shenimet, data.created_by]
        );
        return { porosi_id: result.insertId };
    },

    createDetaj: async (data) => {
        await db.query(
            'INSERT INTO detajet_porosise (porosi_id, produkt_id, sasia, cmimi_njesi, personalizimi, nentotali, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.porosi_id, data.produkt_id, data.sasia, data.cmimi_njesi, data.personalizimi, data.nentotali, data.created_by]
        );
    },

    updateTotali: async (porosiId, totali) => {
        await db.query('UPDATE porosite SET totali = ? WHERE porosi_id = ?', [totali, porosiId]);
    },

    updateStatusi: async (id, statusi, userId) => {
        const [result] = await db.query(
            'UPDATE porosite SET statusi = ?, updated_by = ? WHERE porosi_id = ?',
            [statusi, userId, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM porosite WHERE porosi_id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = porositeRepository;