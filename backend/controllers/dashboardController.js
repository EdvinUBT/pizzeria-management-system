const db = require('../config/db');

const getDashboard = async (req, res) => {
    try {
        // Numri total i porosive
        const [totalPorosite] = await db.query('SELECT COUNT(*) AS total FROM porosite');

        // Numri i porosive sipas statusit
        const [porosiSipasStatusit] = await db.query(`
            SELECT statusi, COUNT(*) AS numri 
            FROM porosite 
            GROUP BY statusi
        `);

        // Totali i shitjeve (te gjitha porosite qe nuk jane anuluar)
        const [totaliShitjeve] = await db.query(`
            SELECT COALESCE(SUM(totali), 0) AS totali 
            FROM porosite 
            WHERE statusi != 'anuluar'
        `);

        // Shitjet e sotme
        const [shitjetSotme] = await db.query(`
            SELECT COALESCE(SUM(totali), 0) AS totali 
            FROM porosite 
            WHERE DATE(data_porosise) = CURDATE() AND statusi != 'anuluar'
        `);

        // Shitjet e ketij muaji
        const [shitjetMuajore] = await db.query(`
            SELECT COALESCE(SUM(totali), 0) AS totali 
            FROM porosite 
            WHERE MONTH(data_porosise) = MONTH(CURDATE()) 
            AND YEAR(data_porosise) = YEAR(CURDATE())
            AND statusi != 'anuluar'
        `);

        // Numri i klienteve
        const [totalKlientet] = await db.query('SELECT COUNT(*) AS total FROM klientet');

        // Numri i produkteve
        const [totalProduktet] = await db.query('SELECT COUNT(*) AS total FROM produktet');

        // Numri i punonjesve aktiv
        const [totalPunonjesit] = await db.query('SELECT COUNT(*) AS total FROM punonjesit WHERE aktiv = TRUE');

        // Top 5 produktet me te shitura
        const [topProduktet] = await db.query(`
            SELECT p.emri_produktit, SUM(dp.sasia) AS sasia_totale, SUM(dp.nentotali) AS shitjet
            FROM detajet_porosise dp
            LEFT JOIN produktet p ON dp.produkt_id = p.produkt_id
            LEFT JOIN porosite po ON dp.porosi_id = po.porosi_id
            WHERE po.statusi != 'anuluar'
            GROUP BY dp.produkt_id, p.emri_produktit
            ORDER BY sasia_totale DESC
            LIMIT 5
        `);

        // Porosite e fundit (5 te fundit)
        const [porositeEFundit] = await db.query(`
            SELECT p.porosi_id, p.data_porosise, p.statusi, p.totali,
                   k.emri, k.mbiemri
            FROM porosite p
            LEFT JOIN klientet k ON p.klient_id = k.klient_id
            ORDER BY p.data_porosise DESC
            LIMIT 5
        `);

        // Vleresimi mesatar
        const [vlereisimiMesatar] = await db.query(`
            SELECT COALESCE(AVG(yjet), 0) AS mesatarja 
            FROM vleresimet
        `);

        // Shitjet e 7 diteve te fundit
        const [shitjet7Dite] = await db.query(`
            SELECT DATE(data_porosise) AS data, 
                   COUNT(*) AS numri_porosive,
                   COALESCE(SUM(totali), 0) AS totali
            FROM porosite 
            WHERE data_porosise >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND statusi != 'anuluar'
            GROUP BY DATE(data_porosise)
            ORDER BY data ASC
        `);

        res.json({
            sukses: true,
            te_dhena: {
                totalPorosite: totalPorosite[0].total,
                porosiSipasStatusit,
                totaliShitjeve: totaliShitjeve[0].totali,
                shitjetSotme: shitjetSotme[0].totali,
                shitjetMuajore: shitjetMuajore[0].totali,
                totalKlientet: totalKlientet[0].total,
                totalProduktet: totalProduktet[0].total,
                totalPunonjesit: totalPunonjesit[0].total,
                topProduktet,
                porositeEFundit,
                vleresimiMesatar: parseFloat(vlereisimiMesatar[0].mesatarja).toFixed(1),
                shitjet7Dite
            }
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getDashboard };