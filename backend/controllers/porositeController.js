const db = require('../config/db');

// Merr te gjitha porosite
const getPorosite = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, k.emri, k.mbiemri, k.email, k.telefoni
            FROM porosite p
            LEFT JOIN klientet k ON p.klient_id = k.klient_id
            ORDER BY p.data_porosise DESC
        `);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje porosi sipas ID me detajet
const getPorosia = async (req, res) => {
    try {
        const [porosi] = await db.query(`
            SELECT p.*, k.emri, k.mbiemri, k.email, k.telefoni
            FROM porosite p
            LEFT JOIN klientet k ON p.klient_id = k.klient_id
            WHERE p.porosi_id = ?
        `, [req.params.id]);

        if (porosi.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Porosia nuk u gjet!' });
        }

        // Merr detajet e porosise
        const [detajet] = await db.query(`
            SELECT dp.*, pr.emri_produktit
            FROM detajet_porosise dp
            LEFT JOIN produktet pr ON dp.produkt_id = pr.produkt_id
            WHERE dp.porosi_id = ?
        `, [req.params.id]);

        res.json({
            sukses: true,
            te_dhena: {
                ...porosi[0],
                detajet: detajet
            }
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr porosite e nje klienti
const getPorositeEKlientit = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM porosite 
            WHERE klient_id = ? 
            ORDER BY data_porosise DESC
        `, [req.params.klientId]);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje porosi te re
const krijoPorosi = async (req, res) => {
    try {
        const { klient_id, metoda_pageses, adresa_dergeses, shenimet, detajet } = req.body;

        // Krijo porosine
        const [result] = await db.query(
            'INSERT INTO porosite (klient_id, metoda_pageses, adresa_dergeses, shenimet) VALUES (?, ?, ?, ?)',
            [klient_id, metoda_pageses || 'cash', adresa_dergeses, shenimet]
        );

        const porosi_id = result.insertId;
        let totali = 0;

        // Shto detajet e porosise
        if (detajet && detajet.length > 0) {
            for (const detaj of detajet) {
                const nentotali = detaj.sasia * detaj.cmimi_njesi;
                totali += nentotali;

                await db.query(
                    'INSERT INTO detajet_porosise (porosi_id, produkt_id, sasia, cmimi_njesi, personalizimi, nentotali) VALUES (?, ?, ?, ?, ?, ?)',
                    [porosi_id, detaj.produkt_id, detaj.sasia, detaj.cmimi_njesi, detaj.personalizimi, nentotali]
                );
            }

            // Perditeso totalin e porosise
            await db.query('UPDATE porosite SET totali = ? WHERE porosi_id = ?', [totali, porosi_id]);
        }

        res.status(201).json({
            sukses: true,
            mesazhi: 'Porosia u krijua me sukses!',
            porosi_id: porosi_id,
            totali: totali
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso statusin e porosise
const perditesoStatusin = async (req, res) => {
    try {
        const { statusi } = req.body;
        const [result] = await db.query(
            'UPDATE porosite SET statusi = ? WHERE porosi_id = ?',
            [statusi, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Porosia nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Statusi i porosise u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Anulo nje porosi
const anuloPorosi = async (req, res) => {
    try {
        const [result] = await db.query(
            "UPDATE porosite SET statusi = 'anuluar' WHERE porosi_id = ?",
            [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Porosia nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Porosia u anulua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje porosi
const fshiPorosi = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM porosite WHERE porosi_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Porosia nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Porosia u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getPorosite, getPorosia, getPorositeEKlientit, krijoPorosi, perditesoStatusin, anuloPorosi, fshiPorosi };