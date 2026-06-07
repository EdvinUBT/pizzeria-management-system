const db = require('../config/db');

const dashboardRepository = {
    getTotalPorosite: async () => {
        const [rows] = await db.query('SELECT COUNT(*) AS total FROM porosite');
        return rows[0].total;
    },

    getPorosiSipasStatusit: async () => {
        const [rows] = await db.query('SELECT statusi, COUNT(*) AS numri FROM porosite GROUP BY statusi');
        return rows;
    },

    getTotaliShitjeve: async () => {
        const [rows] = await db.query("SELECT COALESCE(SUM(totali), 0) AS totali FROM porosite WHERE statusi != 'anuluar'");
        return rows[0].totali;
    },

    getShitjetSotme: async () => {
        const [rows] = await db.query("SELECT COALESCE(SUM(totali), 0) AS totali FROM porosite WHERE DATE(data_porosise) = CURDATE() AND statusi != 'anuluar'");
        return rows[0].totali;
    },

    getShitjetMuajore: async () => {
        const [rows] = await db.query("SELECT COALESCE(SUM(totali), 0) AS totali FROM porosite WHERE MONTH(data_porosise) = MONTH(CURDATE()) AND YEAR(data_porosise) = YEAR(CURDATE()) AND statusi != 'anuluar'");
        return rows[0].totali;
    },

    getTotalKlientet: async () => {
        const [rows] = await db.query('SELECT COUNT(*) AS total FROM klientet');
        return rows[0].total;
    },

    getTotalProduktet: async () => {
        const [rows] = await db.query('SELECT COUNT(*) AS total FROM produktet');
        return rows[0].total;
    },

    getTotalPunonjesit: async () => {
        const [rows] = await db.query('SELECT COUNT(*) AS total FROM punonjesit WHERE aktiv = TRUE');
        return rows[0].total;
    },

    getTopProduktet: async () => {
        const [rows] = await db.query(`
            SELECT p.emri_produktit, SUM(dp.sasia) AS sasia_totale, SUM(dp.nentotali) AS shitjet
            FROM detajet_porosise dp
            LEFT JOIN produktet p ON dp.produkt_id = p.produkt_id
            LEFT JOIN porosite po ON dp.porosi_id = po.porosi_id
            WHERE po.statusi != 'anuluar'
            GROUP BY dp.produkt_id, p.emri_produktit
            ORDER BY sasia_totale DESC
            LIMIT 5
        `);
        return rows;
    },

    getPorositeEFundit: async () => {
        const [rows] = await db.query(`
            SELECT p.porosi_id, p.data_porosise, p.statusi, p.totali, k.emri, k.mbiemri
            FROM porosite p
            LEFT JOIN klientet k ON p.klient_id = k.klient_id
            ORDER BY p.data_porosise DESC
            LIMIT 5
        `);
        return rows;
    },

    getVleresimiMesatar: async () => {
        const [rows] = await db.query('SELECT COALESCE(AVG(yjet), 0) AS mesatarja FROM vleresimet');
        return parseFloat(rows[0].mesatarja).toFixed(1);
    },

    getShitjet7Dite: async () => {
        const [rows] = await db.query(`
            SELECT DATE(data_porosise) AS data, COUNT(*) AS numri_porosive, COALESCE(SUM(totali), 0) AS totali
            FROM porosite
            WHERE data_porosise >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND statusi != 'anuluar'
            GROUP BY DATE(data_porosise)
            ORDER BY data ASC
        `);
        return rows;
    }
};

module.exports = dashboardRepository;