const db = require('../config/db');

// Merr te gjitha menyte
const getMenyte = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menyte ORDER BY meny_id DESC');
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje meny sipas ID me produktet
const getMenuja = async (req, res) => {
    try {
        const [meny] = await db.query('SELECT * FROM menyte WHERE meny_id = ?', [req.params.id]);

        if (meny.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Menyja nuk u gjet!' });
        }

        // Merr produktet e menys
        const [produktet] = await db.query(`
            SELECT mp.*, p.emri_produktit, p.pershkrimi, p.cmimi_baze, p.foto_url
            FROM meny_produktet mp
            LEFT JOIN produktet p ON mp.produkt_id = p.produkt_id
            WHERE mp.meny_id = ?
            ORDER BY mp.renditja ASC
        `, [req.params.id]);

        res.json({
            sukses: true,
            te_dhena: {
                ...meny[0],
                produktet: produktet
            }
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje meny te re
const krijoMeny = async (req, res) => {
    try {
        const { emri_menys, pershkrimi, data_fillimit, data_mbarimit, aktive } = req.body;
        const [result] = await db.query(
            'INSERT INTO menyte (emri_menys, pershkrimi, data_fillimit, data_mbarimit, aktive) VALUES (?, ?, ?, ?, ?)',
            [emri_menys, pershkrimi, data_fillimit, data_mbarimit, aktive !== undefined ? aktive : true]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Menyja u krijua me sukses!',
            meny_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje meny
const perditesoMeny = async (req, res) => {
    try {
        const { emri_menys, pershkrimi, data_fillimit, data_mbarimit, aktive } = req.body;
        const [result] = await db.query(
            'UPDATE menyte SET emri_menys = ?, pershkrimi = ?, data_fillimit = ?, data_mbarimit = ?, aktive = ? WHERE meny_id = ?',
            [emri_menys, pershkrimi, data_fillimit, data_mbarimit, aktive, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Menyja nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Menyja u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Shto produkt ne meny
const shtoProduktNeMeny = async (req, res) => {
    try {
        const { produkt_id, cmimi_special, renditja } = req.body;
        const [result] = await db.query(
            'INSERT INTO meny_produktet (meny_id, produkt_id, cmimi_special, renditja) VALUES (?, ?, ?, ?)',
            [req.params.id, produkt_id, cmimi_special, renditja || 0]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Produkti u shtua ne meny me sukses!',
            meny_produkt_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Hiq produkt nga menyja
const hiqProduktNgaMenyja = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM meny_produktet WHERE meny_id = ? AND produkt_id = ?',
            [req.params.id, req.params.produktId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Produkti nuk u gjet ne kete meny!' });
        }
        res.json({ sukses: true, mesazhi: 'Produkti u hoq nga menyja me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje meny
const fshiMeny = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM menyte WHERE meny_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Menyja nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Menyja u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getMenyte, getMenuja, krijoMeny, perditesoMeny, shtoProduktNeMeny, hiqProduktNgaMenyja, fshiMeny };