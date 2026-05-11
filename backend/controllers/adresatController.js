const db = require('../config/db');

// Merr adresat e nje klienti
const getAdresatEKlientit = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM adresat WHERE klient_id = ? ORDER BY eshte_default DESC',
            [req.params.klientId]
        );
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Shto nje adrese te re
const shtoAdrese = async (req, res) => {
    try {
        const { klient_id, emertimi, adresa, qyteti, kodi_postar, eshte_default } = req.body;

        // Nese eshte default, hiq default nga adresat e tjera
        if (eshte_default) {
            await db.query(
                'UPDATE adresat SET eshte_default = FALSE WHERE klient_id = ?',
                [klient_id]
            );
        }

        const [result] = await db.query(
            'INSERT INTO adresat (klient_id, emertimi, adresa, qyteti, kodi_postar, eshte_default) VALUES (?, ?, ?, ?, ?, ?)',
            [klient_id, emertimi, adresa, qyteti, kodi_postar, eshte_default || false]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Adresa u shtua me sukses!',
            adrese_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje adrese
const perditesoAdrese = async (req, res) => {
    try {
        const { emertimi, adresa, qyteti, kodi_postar, eshte_default } = req.body;

        // Nese eshte default, hiq default nga adresat e tjera
        if (eshte_default) {
            const [current] = await db.query('SELECT klient_id FROM adresat WHERE adrese_id = ?', [req.params.id]);
            if (current.length > 0) {
                await db.query(
                    'UPDATE adresat SET eshte_default = FALSE WHERE klient_id = ?',
                    [current[0].klient_id]
                );
            }
        }

        const [result] = await db.query(
            'UPDATE adresat SET emertimi = ?, adresa = ?, qyteti = ?, kodi_postar = ?, eshte_default = ? WHERE adrese_id = ?',
            [emertimi, adresa, qyteti, kodi_postar, eshte_default, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Adresa nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Adresa u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje adrese
const fshiAdrese = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM adresat WHERE adrese_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Adresa nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Adresa u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getAdresatEKlientit, shtoAdrese, perditesoAdrese, fshiAdrese };