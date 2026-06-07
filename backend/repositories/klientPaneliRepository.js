const db = require('../config/db');

const klientPaneliRepository = {
    getProfilin: async (klientId) => {
        const [rows] = await db.query(
            'SELECT klient_id, emri, mbiemri, email, telefoni, adresa, data_regjistrimit FROM klientet WHERE klient_id = ?',
            [klientId]
        );
        return rows[0];
    },

    perditesoProfilin: async (klientId, data) => {
        const [result] = await db.query(
            'UPDATE klientet SET emri = ?, mbiemri = ?, telefoni = ?, adresa = ?, updated_by = ? WHERE klient_id = ?',
            [data.emri, data.mbiemri, data.telefoni, data.adresa, data.updated_by, klientId]
        );
        return result.affectedRows > 0;
    },

    getPorositeEKlientit: async (klientId) => {
        const [rows] = await db.query(`
            SELECT p.*, 
                (SELECT COUNT(*) FROM vleresimet v WHERE v.porosi_id = p.porosi_id AND v.klient_id = p.klient_id) AS ka_vleresim
            FROM porosite p
            WHERE p.klient_id = ?
            ORDER BY p.data_porosise DESC
        `, [klientId]);
        return rows;
    },

    getPorosia: async (porosiId, klientId) => {
        const [rows] = await db.query(
            'SELECT p.* FROM porosite p WHERE p.porosi_id = ? AND p.klient_id = ?',
            [porosiId, klientId]
        );
        return rows[0];
    },

    getDetajetEPorosise: async (porosiId) => {
        const [rows] = await db.query(`
            SELECT dp.*, pr.emri_produktit, pr.foto_url
            FROM detajet_porosise dp
            LEFT JOIN produktet pr ON dp.produkt_id = pr.produkt_id
            WHERE dp.porosi_id = ?
        `, [porosiId]);
        return rows;
    },

    getDergesa: async (porosiId) => {
        const [rows] = await db.query(`
            SELECT d.*, pun.emri AS shofer_emri, pun.mbiemri AS shofer_mbiemri, pun.telefoni AS shofer_telefoni
            FROM dergesat d
            LEFT JOIN punonjesit pun ON d.punonjes_id = pun.punonjes_id
            WHERE d.porosi_id = ?
        `, [porosiId]);
        return rows[0] || null;
    },

    krijoPorosi: async (data) => {
        const [result] = await db.query(
            'INSERT INTO porosite (klient_id, metoda_pageses, adresa_dergeses, shenimet, created_by) VALUES (?, ?, ?, ?, ?)',
            [data.klient_id, data.metoda_pageses, data.adresa_dergeses, data.shenimet, data.created_by]
        );
        return { porosi_id: result.insertId };
    },

    krijoDetaj: async (data) => {
        await db.query(
            'INSERT INTO detajet_porosise (porosi_id, produkt_id, sasia, cmimi_njesi, personalizimi, nentotali, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.porosi_id, data.produkt_id, data.sasia, data.cmimi_njesi, data.personalizimi, data.nentotali, data.created_by]
        );
    },

    getCmimiProduktit: async (produktId) => {
        const [rows] = await db.query('SELECT cmimi_baze FROM produktet WHERE produkt_id = ?', [produktId]);
        return rows[0]?.cmimi_baze || 0;
    },

    updateTotali: async (porosiId, totali) => {
        await db.query('UPDATE porosite SET totali = ? WHERE porosi_id = ?', [totali, porosiId]);
    },

    getKuponValid: async (kodi) => {
        const [rows] = await db.query(
            'SELECT * FROM kuponat WHERE kodi = ? AND aktiv = TRUE AND data_fillimit <= CURDATE() AND data_skadimit >= CURDATE() AND perdorimet_aktuale < perdorimet_max',
            [kodi]
        );
        return rows[0];
    },

    incrementKupon: async (kuponId) => {
        await db.query('UPDATE kuponat SET perdorimet_aktuale = perdorimet_aktuale + 1 WHERE kupon_id = ?', [kuponId]);
    },

    anuloPorosiStatus: async (porosiId) => {
        await db.query("UPDATE porosite SET statusi = 'anuluar' WHERE porosi_id = ?", [porosiId]);
    },

    getPorosiDorezuar: async (porosiId, klientId) => {
        const [rows] = await db.query(
            "SELECT porosi_id FROM porosite WHERE porosi_id = ? AND klient_id = ? AND statusi = 'dorezuar'",
            [porosiId, klientId]
        );
        return rows[0];
    },

    getVleresimEkzistues: async (klientId, porosiId) => {
        const [rows] = await db.query(
            'SELECT vleresim_id FROM vleresimet WHERE klient_id = ? AND porosi_id = ?',
            [klientId, porosiId]
        );
        return rows[0];
    },

    krijoVleresim: async (data) => {
        const [result] = await db.query(
            'INSERT INTO vleresimet (klient_id, porosi_id, yjet, komenti, created_by) VALUES (?, ?, ?, ?, ?)',
            [data.klient_id, data.porosi_id, data.yjet, data.komenti, data.created_by]
        );
        return { vleresim_id: result.insertId };
    },

    getMenyteAktive: async () => {
        const [rows] = await db.query(`
            SELECT m.*, 
                (SELECT COUNT(*) FROM meny_produktet mp WHERE mp.meny_id = m.meny_id) AS numri_produkteve
            FROM menyte m
            WHERE m.aktive = TRUE AND (m.data_mbarimit IS NULL OR m.data_mbarimit >= CURDATE())
            ORDER BY m.meny_id DESC
        `);
        return rows;
    },

    getProduktetEMenys: async (menyId) => {
        const [rows] = await db.query(`
            SELECT mp.*, p.emri_produktit, p.pershkrimi, p.cmimi_baze, p.foto_url, p.koha_pergatitjes_min,
                k.emri_kategorise
            FROM meny_produktet mp
            LEFT JOIN produktet p ON mp.produkt_id = p.produkt_id
            LEFT JOIN kategorite k ON p.kategori_id = k.kategori_id
            WHERE mp.meny_id = ? AND p.aktive = TRUE
            ORDER BY mp.renditja ASC
        `, [menyId]);
        return rows;
    },

    getVleresimetProdukteve: async () => {
        const [rows] = await db.query(`
            SELECT dp.produkt_id, 
                ROUND(AVG(v.yjet), 1) AS mesatarja_yjeve,
                COUNT(v.vleresim_id) AS numri_vleresimeve
            FROM vleresimet v
            INNER JOIN detajet_porosise dp ON dp.porosi_id = v.porosi_id
            GROUP BY dp.produkt_id
        `);
        return rows;
    },

    getKomentetProdukteve: async () => {
        const [rows] = await db.query(`
            SELECT dp.produkt_id, v.yjet, v.komenti, v.data_vleresimit, k.emri
            FROM vleresimet v
            INNER JOIN detajet_porosise dp ON dp.porosi_id = v.porosi_id
            INNER JOIN klientet k ON v.klient_id = k.klient_id
            WHERE v.komenti IS NOT NULL AND v.komenti != ''
            ORDER BY v.data_vleresimit DESC
        `);
        return rows;
    }
};

module.exports = klientPaneliRepository;