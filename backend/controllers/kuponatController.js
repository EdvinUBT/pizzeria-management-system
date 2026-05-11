const db = require('../config/db');

// Merr te gjitha kuponat
const getKuponat = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM kuponat ORDER BY kupon_id DESC');
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje kupon sipas kodit
const getKuponiMeKod = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM kuponat WHERE kodi = ? AND aktiv = TRUE AND data_skadimit >= CURDATE() AND perdorimet_aktuale < perdorimet_max',
            [req.params.kodi]
        );
        if (rows.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Kuponi nuk u gjet ose ka skaduar!' });
        }
        res.json({ sukses: true, te_dhena: rows[0] });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje kupon te ri
const krijoKupon = async (req, res) => {
    try {
        const { kodi, zbritja_perqind, zbritja_max, porosi_min, data_fillimit, data_skadimit, perdorimet_max } = req.body;

        const [existing] = await db.query('SELECT kupon_id FROM kuponat WHERE kodi = ?', [kodi]);
        if (existing.length > 0) {
            return res.status(400).json({ sukses: false, mesazhi: 'Ky kod kuponi ekziston tashme!' });
        }

        const [result] = await db.query(
            'INSERT INTO kuponat (kodi, zbritja_perqind, zbritja_max, porosi_min, data_fillimit, data_skadimit, perdorimet_max) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [kodi, zbritja_perqind, zbritja_max, porosi_min || 0, data_fillimit, data_skadimit, perdorimet_max || 1]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Kuponi u krijua me sukses!',
            kupon_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje kupon
const perditesoKupon = async (req, res) => {
    try {
        const { kodi, zbritja_perqind, zbritja_max, porosi_min, data_fillimit, data_skadimit, perdorimet_max, aktiv } = req.body;
        const [result] = await db.query(
            'UPDATE kuponat SET kodi = ?, zbritja_perqind = ?, zbritja_max = ?, porosi_min = ?, data_fillimit = ?, data_skadimit = ?, perdorimet_max = ?, aktiv = ? WHERE kupon_id = ?',
            [kodi, zbritja_perqind, zbritja_max, porosi_min, data_fillimit, data_skadimit, perdorimet_max, aktiv, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Kuponi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Kuponi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Apliko kupon ne porosi
const aplikoKupon = async (req, res) => {
    try {
        const { kodi, porosi_id } = req.body;

        // Gjej kuponin
        const [kuponat] = await db.query(
            'SELECT * FROM kuponat WHERE kodi = ? AND aktiv = TRUE AND data_skadimit >= CURDATE() AND perdorimet_aktuale < perdorimet_max',
            [kodi]
        );

        if (kuponat.length === 0) {
            return res.status(400).json({ sukses: false, mesazhi: 'Kuponi nuk eshte i vlefshem!' });
        }

        const kupon = kuponat[0];

        // Merr totalin e porosise
        const [porosi] = await db.query('SELECT totali FROM porosite WHERE porosi_id = ?', [porosi_id]);
        if (porosi.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Porosia nuk u gjet!' });
        }

        // Kontrollo minimumin e porosise
        if (porosi[0].totali < kupon.porosi_min) {
            return res.status(400).json({ sukses: false, mesazhi: `Porosi minimale per kete kupon: ${kupon.porosi_min} EUR` });
        }

        // Llogarit zbritjen
        let zbritja = (porosi[0].totali * kupon.zbritja_perqind) / 100;
        if (kupon.zbritja_max && zbritja > kupon.zbritja_max) {
            zbritja = kupon.zbritja_max;
        }

        const totaliRi = porosi[0].totali - zbritja;

        // Perditeso porosine dhe kuponin
        await db.query('UPDATE porosite SET totali = ? WHERE porosi_id = ?', [totaliRi, porosi_id]);
        await db.query('UPDATE kuponat SET perdorimet_aktuale = perdorimet_aktuale + 1 WHERE kupon_id = ?', [kupon.kupon_id]);

        res.json({
            sukses: true,
            mesazhi: 'Kuponi u aplikua me sukses!',
            zbritja: zbritja,
            totali_ri: totaliRi
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje kupon
const fshiKupon = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM kuponat WHERE kupon_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Kuponi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Kuponi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getKuponat, getKuponiMeKod, krijoKupon, perditesoKupon, aplikoKupon, fshiKupon };