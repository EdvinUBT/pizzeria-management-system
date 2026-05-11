const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Merr te gjithe perdoruesit
const getUsers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.id, u.emri, u.mbiemri, u.email, u.phone_number, 
                   u.email_confirmed, u.lockout_enabled, u.access_failed_count,
                   u.data_krijimit, u.statusi,
                   GROUP_CONCAT(r.emertimi) AS rolet
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            GROUP BY u.id
            ORDER BY u.id DESC
        `);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje perdorues sipas ID
const getUser = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.id, u.emri, u.mbiemri, u.email, u.phone_number,
                   u.email_confirmed, u.lockout_enabled, u.access_failed_count,
                   u.data_krijimit, u.statusi,
                   GROUP_CONCAT(r.emertimi) AS rolet
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.id = ?
            GROUP BY u.id
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Perdoruesi nuk u gjet!' });
        }
        res.json({ sukses: true, te_dhena: rows[0] });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje perdorues te ri
const krijoUser = async (req, res) => {
    try {
        const { emri, mbiemri, email, password, phone_number, statusi } = req.body;

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ sukses: false, mesazhi: 'Ky email eshte i regjistruar tashme!' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO users (emri, mbiemri, email, password_hash, phone_number, statusi) VALUES (?, ?, ?, ?, ?, ?)',
            [emri, mbiemri, email, password_hash, phone_number, statusi || 'aktiv']
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Perdoruesi u krijua me sukses!',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje perdorues
const perditesoUser = async (req, res) => {
    try {
        const { emri, mbiemri, email, phone_number, statusi } = req.body;
        const [result] = await db.query(
            'UPDATE users SET emri = ?, mbiemri = ?, email = ?, phone_number = ?, statusi = ? WHERE id = ?',
            [emri, mbiemri, email, phone_number, statusi, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Perdoruesi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Perdoruesi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Aktivizo/Deaktivizo perdoruesin
const ndryshStatusin = async (req, res) => {
    try {
        const { statusi } = req.body;
        const [result] = await db.query(
            'UPDATE users SET statusi = ? WHERE id = ?',
            [statusi, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Perdoruesi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Statusi u ndryshua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje perdorues
const fshiUser = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Perdoruesi nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Perdoruesi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getUsers, getUser, krijoUser, perditesoUser, ndryshStatusin, fshiUser };