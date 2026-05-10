const db = require('../config/db');

// Merr te gjithe perberesit
const getPerberesit = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM perberesit ORDER BY emri_perberesit ASC');
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje perberes sipas ID
const getPerberesi = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM perberesit WHERE perberes_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Perberesi nuk u gjet!' });
        }
        res.json({ sukses: true, te_dhena: rows[0] });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje perberes te ri
const krijoPerberes = async (req, res) => {
    try {
        const { emri_perberesit, njesia_matese, sasia_stok, cmimi_shtese, alergjene } = req.body;
        const [result] = await db.query(
            'INSERT INTO perberesit (emri_perberesit, njesia_matese, sasia_stok, cmimi_shtese, alergjene) VALUES (?, ?, ?, ?, ?)',
            [emri_perberesit, njesia_matese, sasia_stok || 0, cmimi_shtese || 0, alergjene]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Perberesi u krijua me sukses!',
            perberes_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje perberes
const perditesoPerberes = async (req, res) => {
    try {
        const { emri_perberesit, njesia_matese, sasia_stok, cmimi_shtese, alergjene } = req.body;
        const [result] = await db.query(
            'UPDATE perberesit SET emri_perberesit = ?, njesia_matese = ?, sasia_stok = ?, cmimi_shtese = ?, alergjene = ? WHERE perberes_id = ?',
            [emri_perberesit, njesia_matese, sasia_stok, cmimi_shtese, alergjene, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Perberesi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Perberesi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje perberes
const fshiPerberes = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM perberesit WHERE perberes_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Perberesi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Perberesi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getPerberesit, getPerberesi, krijoPerberes, perditesoPerberes, fshiPerberes };