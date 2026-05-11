const db = require('../config/db');

// Merr te gjitha rolet
const getRoles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM roles ORDER BY id ASC');
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje rol sipas ID
const getRole = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM roles WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Roli nuk u gjet!' });
        }
        res.json({ sukses: true, te_dhena: rows[0] });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje rol te ri
const krijoRole = async (req, res) => {
    try {
        const { emertimi, pershkrimi } = req.body;
        const normalized_name = emertimi.toUpperCase();

        const [existing] = await db.query('SELECT id FROM roles WHERE emertimi = ?', [emertimi]);
        if (existing.length > 0) {
            return res.status(400).json({ sukses: false, mesazhi: 'Ky rol ekziston tashme!' });
        }

        const [result] = await db.query(
            'INSERT INTO roles (emertimi, pershkrimi, normalized_name) VALUES (?, ?, ?)',
            [emertimi, pershkrimi, normalized_name]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Roli u krijua me sukses!',
            roleId: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje rol
const perditesoRole = async (req, res) => {
    try {
        const { emertimi, pershkrimi } = req.body;
        const normalized_name = emertimi.toUpperCase();

        const [result] = await db.query(
            'UPDATE roles SET emertimi = ?, pershkrimi = ?, normalized_name = ? WHERE id = ?',
            [emertimi, pershkrimi, normalized_name, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Roli nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Roli u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje rol
const fshiRole = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM roles WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Roli nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Roli u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getRoles, getRole, krijoRole, perditesoRole, fshiRole };