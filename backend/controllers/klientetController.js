const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Merr te gjithe klientet
const getKlientet = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT klient_id, emri, mbiemri, email, telefoni, adresa, data_regjistrimit FROM klientet ORDER BY klient_id DESC');
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje klient sipas ID
const getKlienti = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT klient_id, emri, mbiemri, email, telefoni, adresa, data_regjistrimit FROM klientet WHERE klient_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Klienti nuk u gjet!' });
        }
        res.json({ sukses: true, te_dhena: rows[0] });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje klient te ri
const krijoKlient = async (req, res) => {
    try {
        const { emri, mbiemri, email, telefoni, adresa, fjalekalimi } = req.body;

        // Kontrollo nese email ekziston
        const [existing] = await db.query('SELECT klient_id FROM klientet WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ sukses: false, mesazhi: 'Ky email eshte i regjistruar tashme!' });
        }

        // Enkripto fjalekalimin
        const salt = await bcrypt.genSalt(10);
        const fjalekalimi_hash = await bcrypt.hash(fjalekalimi, salt);

        const [result] = await db.query(
            'INSERT INTO klientet (emri, mbiemri, email, telefoni, adresa, fjalekalimi_hash) VALUES (?, ?, ?, ?, ?, ?)',
            [emri, mbiemri, email, telefoni, adresa, fjalekalimi_hash]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Klienti u krijua me sukses!',
            klient_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje klient
const perditesoKlient = async (req, res) => {
    try {
        const { emri, mbiemri, email, telefoni, adresa } = req.body;
        const [result] = await db.query(
            'UPDATE klientet SET emri = ?, mbiemri = ?, email = ?, telefoni = ?, adresa = ? WHERE klient_id = ?',
            [emri, mbiemri, email, telefoni, adresa, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Klienti nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Klienti u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje klient
const fshiKlient = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM klientet WHERE klient_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Klienti nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Klienti u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getKlientet, getKlienti, krijoKlient, perditesoKlient, fshiKlient };