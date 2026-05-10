const db = require('../config/db');

// Merr te gjitha kategorite
const getKategorite = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM kategorite ORDER BY renditja ASC');
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje kategori sipas ID
const getKategoria = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM kategorite WHERE kategori_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Kategoria nuk u gjet!' });
        }
        res.json({ sukses: true, te_dhena: rows[0] });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje kategori te re
const krijoKategori = async (req, res) => {
    try {
        const { emri_kategorise, pershkrimi, renditja, aktive } = req.body;
        const [result] = await db.query(
            'INSERT INTO kategorite (emri_kategorise, pershkrimi, renditja, aktive) VALUES (?, ?, ?, ?)',
            [emri_kategorise, pershkrimi, renditja || 0, aktive !== undefined ? aktive : true]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Kategoria u krijua me sukses!',
            kategori_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje kategori
const perditesoKategori = async (req, res) => {
    try {
        const { emri_kategorise, pershkrimi, renditja, aktive } = req.body;
        const [result] = await db.query(
            'UPDATE kategorite SET emri_kategorise = ?, pershkrimi = ?, renditja = ?, aktive = ? WHERE kategori_id = ?',
            [emri_kategorise, pershkrimi, renditja, aktive, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Kategoria nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Kategoria u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje kategori
const fshiKategori = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM kategorite WHERE kategori_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Kategoria nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Kategoria u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getKategorite, getKategoria, krijoKategori, perditesoKategori, fshiKategori };