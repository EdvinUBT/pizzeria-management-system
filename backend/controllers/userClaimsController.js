const db = require('../config/db');

// Merr claims e nje perdoruesi
const getClaimsEPerdoruesit = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM user_claims WHERE user_id = ?',
            [req.params.userId]
        );
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Shto nje claim
const shtoClaim = async (req, res) => {
    try {
        const { user_id, claim_type, claim_value } = req.body;
        const [result] = await db.query(
            'INSERT INTO user_claims (user_id, claim_type, claim_value) VALUES (?, ?, ?)',
            [user_id, claim_type, claim_value]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Claim u shtua me sukses!',
            id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje claim
const perditesoClaim = async (req, res) => {
    try {
        const { claim_type, claim_value } = req.body;
        const [result] = await db.query(
            'UPDATE user_claims SET claim_type = ?, claim_value = ? WHERE id = ?',
            [claim_type, claim_value, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Claim nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Claim u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje claim
const fshiClaim = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM user_claims WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Claim nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Claim u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getClaimsEPerdoruesit, shtoClaim, perditesoClaim, fshiClaim };