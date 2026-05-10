const db = require('../config/db');

// Merr te gjitha vleresimet
const getVleresimet = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT v.*, k.emri, k.mbiemri
            FROM vleresimet v
            LEFT JOIN klientet k ON v.klient_id = k.klient_id
            ORDER BY v.data_vleresimit DESC
        `);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr vleresimet e nje porosie
const getVleresimetEPorosise = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT v.*, k.emri, k.mbiemri
            FROM vleresimet v
            LEFT JOIN klientet k ON v.klient_id = k.klient_id
            WHERE v.porosi_id = ?
        `, [req.params.porosiId]);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje vleresim te ri
const krijoVleresim = async (req, res) => {
    try {
        const { klient_id, porosi_id, yjet, komenti } = req.body;

        // Kontrollo nese vleresimi ekziston per kete porosi
        const [existing] = await db.query(
            'SELECT vleresim_id FROM vleresimet WHERE klient_id = ? AND porosi_id = ?',
            [klient_id, porosi_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ sukses: false, mesazhi: 'Kjo porosi eshte vleresuar tashme!' });
        }

        const [result] = await db.query(
            'INSERT INTO vleresimet (klient_id, porosi_id, yjet, komenti) VALUES (?, ?, ?, ?)',
            [klient_id, porosi_id, yjet, komenti]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Vleresimi u krijua me sukses!',
            vleresim_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje vleresim
const perditesoVleresim = async (req, res) => {
    try {
        const { yjet, komenti } = req.body;
        const [result] = await db.query(
            'UPDATE vleresimet SET yjet = ?, komenti = ? WHERE vleresim_id = ?',
            [yjet, komenti, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Vleresimi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Vleresimi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje vleresim
const fshiVleresim = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM vleresimet WHERE vleresim_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Vleresimi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Vleresimi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getVleresimet, getVleresimetEPorosise, krijoVleresim, perditesoVleresim, fshiVleresim };