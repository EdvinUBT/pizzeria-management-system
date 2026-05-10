const db = require('../config/db');

// Merr te gjithe punonjesit
const getPunonjesit = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM punonjesit ORDER BY punonjes_id DESC');
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje punonjes sipas ID
const getPunonjesi = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM punonjesit WHERE punonjes_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Punonjesi nuk u gjet!' });
        }
        res.json({ sukses: true, te_dhena: rows[0] });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje punonjes te ri
const krijoPunonjes = async (req, res) => {
    try {
        const { emri, mbiemri, roli, telefoni, email, aktiv } = req.body;
        const [result] = await db.query(
            'INSERT INTO punonjesit (emri, mbiemri, roli, telefoni, email, aktiv) VALUES (?, ?, ?, ?, ?, ?)',
            [emri, mbiemri, roli, telefoni, email, aktiv !== undefined ? aktiv : true]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Punonjesi u krijua me sukses!',
            punonjes_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje punonjes
const perditesoPunonjes = async (req, res) => {
    try {
        const { emri, mbiemri, roli, telefoni, email, aktiv } = req.body;
        const [result] = await db.query(
            'UPDATE punonjesit SET emri = ?, mbiemri = ?, roli = ?, telefoni = ?, email = ?, aktiv = ? WHERE punonjes_id = ?',
            [emri, mbiemri, roli, telefoni, email, aktiv, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Punonjesi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Punonjesi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje punonjes
const fshiPunonjes = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM punonjesit WHERE punonjes_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Punonjesi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Punonjesi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getPunonjesit, getPunonjesi, krijoPunonjes, perditesoPunonjes, fshiPunonjes };