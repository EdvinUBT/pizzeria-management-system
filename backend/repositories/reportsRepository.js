const db = require('../config/db');

const reportsRepository = {
    getShitjetSipasKategorise: async (dataNga, dataDeri) => {
        let query = `
            SELECT k.emri_kategorise, 
                   COUNT(dp.detaj_id) as numri_porosive,
                   SUM(dp.sasia) as sasia_totale,
                   SUM(dp.nentotali) as shitjet_totale
            FROM detajet_porosise dp
            JOIN produktet p ON dp.produkt_id = p.produkt_id
            JOIN kategorite k ON p.kategori_id = k.kategori_id
            JOIN porosite po ON dp.porosi_id = po.porosi_id
            WHERE po.statusi != 'anuluar'
        `;
        const params = [];

        if (dataNga) { query += ` AND po.data_porosise >= ?`; params.push(dataNga); }
        if (dataDeri) { query += ` AND po.data_porosise <= ?`; params.push(dataDeri); }

        query += ` GROUP BY k.kategori_id, k.emri_kategorise ORDER BY shitjet_totale DESC`;
        const [rows] = await db.query(query, params);
        return rows;
    },

    getShitjetSipasProdukteve: async (dataNga, dataDeri, limit = 10) => {
        let query = `
            SELECT p.emri_produktit,
                   SUM(dp.sasia) as sasia_totale,
                   SUM(dp.nentotali) as shitjet_totale,
                   COUNT(DISTINCT dp.porosi_id) as numri_porosive
            FROM detajet_porosise dp
            JOIN produktet p ON dp.produkt_id = p.produkt_id
            JOIN porosite po ON dp.porosi_id = po.porosi_id
            WHERE po.statusi != 'anuluar'
        `;
        const params = [];

        if (dataNga) { query += ` AND po.data_porosise >= ?`; params.push(dataNga); }
        if (dataDeri) { query += ` AND po.data_porosise <= ?`; params.push(dataDeri); }

        query += ` GROUP BY p.produkt_id, p.emri_produktit ORDER BY shitjet_totale DESC LIMIT ?`;
        params.push(parseInt(limit));
        const [rows] = await db.query(query, params);
        return rows;
    },

    getShitjetDitore: async (dataNga, dataDeri) => {
        let query = `
            SELECT DATE(po.data_porosise) as data,
                   COUNT(po.porosi_id) as numri_porosive,
                   SUM(po.totali) as shitjet_totale
            FROM porosite po
            WHERE po.statusi != 'anuluar'
        `;
        const params = [];

        if (dataNga) { query += ` AND po.data_porosise >= ?`; params.push(dataNga); }
        if (dataDeri) { query += ` AND po.data_porosise <= ?`; params.push(dataDeri); }

        query += ` GROUP BY DATE(po.data_porosise) ORDER BY data ASC`;
        const [rows] = await db.query(query, params);
        return rows;
    },

    getShitjetMujore: async (dataNga, dataDeri) => {
        let query = `
            SELECT DATE_FORMAT(po.data_porosise, '%Y-%m') as muaji,
                   COUNT(po.porosi_id) as numri_porosive,
                   SUM(po.totali) as shitjet_totale
            FROM porosite po
            WHERE po.statusi != 'anuluar'
        `;
        const params = [];

        if (dataNga) { query += ` AND po.data_porosise >= ?`; params.push(dataNga); }
        if (dataDeri) { query += ` AND po.data_porosise <= ?`; params.push(dataDeri); }

        query += ` GROUP BY DATE_FORMAT(po.data_porosise, '%Y-%m') ORDER BY muaji ASC`;
        const [rows] = await db.query(query, params);
        return rows;
    },

    getStatuSetPorosive: async (dataNga, dataDeri) => {
        let query = `
            SELECT po.statusi,
                   COUNT(po.porosi_id) as numri,
                   SUM(po.totali) as totali
            FROM porosite po
            WHERE 1=1
        `;
        const params = [];

        if (dataNga) { query += ` AND po.data_porosise >= ?`; params.push(dataNga); }
        if (dataDeri) { query += ` AND po.data_porosise <= ?`; params.push(dataDeri); }

        query += ` GROUP BY po.statusi`;
        const [rows] = await db.query(query, params);
        return rows;
    },

    getMetodatPageses: async (dataNga, dataDeri) => {
        let query = `
            SELECT po.metoda_pageses,
                   COUNT(po.porosi_id) as numri,
                   SUM(po.totali) as totali
            FROM porosite po
            WHERE po.statusi != 'anuluar'
        `;
        const params = [];

        if (dataNga) { query += ` AND po.data_porosise >= ?`; params.push(dataNga); }
        if (dataDeri) { query += ` AND po.data_porosise <= ?`; params.push(dataDeri); }

        query += ` GROUP BY po.metoda_pageses`;
        const [rows] = await db.query(query, params);
        return rows;
    }
};

module.exports = reportsRepository;