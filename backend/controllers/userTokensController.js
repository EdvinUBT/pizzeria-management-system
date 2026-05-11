const db = require('../config/db');

// Merr tokenat e nje perdoruesi
const getTokenatEPerdoruesit = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, user_id, login_provider, token_name FROM user_tokens WHERE user_id = ?',
            [req.params.userId]
        );
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Shto nje token
const shtoToken = async (req, res) => {
    try {
        const { user_id, login_provider, token_name, token_value } = req.body;
        const [result] = await db.query(
            'INSERT INTO user_tokens (user_id, login_provider, token_name, token_value) VALUES (?, ?, ?, ?)',
            [user_id, login_provider, token_name, token_value]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Tokeni u shtua me sukses!',
            id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje token
const fshiToken = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM user_tokens WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Tokeni nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Tokeni u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi te gjitha tokenat e nje perdoruesi
const fshiTeGjithaTokenat = async (req, res) => {
    try {
        await db.query('DELETE FROM user_tokens WHERE user_id = ?', [req.params.userId]);
        res.json({ sukses: true, mesazhi: 'Te gjitha tokenat u fshine me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getTokenatEPerdoruesit, shtoToken, fshiToken, fshiTeGjithaTokenat };