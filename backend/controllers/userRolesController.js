const db = require('../config/db');

// Merr rolet e nje perdoruesi
const getRoletEPerdoruesit = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ur.id, ur.user_id, ur.role_id, r.emertimi, r.pershkrimi
            FROM user_roles ur
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = ?
        `, [req.params.userId]);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Cakto nje rol perdoruesit
const caktoRol = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;

        // Kontrollo nese lidhja ekziston
        const [existing] = await db.query(
            'SELECT id FROM user_roles WHERE user_id = ? AND role_id = ?',
            [user_id, role_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ sukses: false, mesazhi: 'Perdoruesi e ka tashme kete rol!' });
        }

        const [result] = await db.query(
            'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
            [user_id, role_id]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Roli u caktua me sukses!',
            id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Hiq nje rol nga perdoruesi
const hiqRol = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?',
            [req.params.userId, req.params.roleId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Lidhja nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Roli u hoq me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getRoletEPerdoruesit, caktoRol, hiqRol };