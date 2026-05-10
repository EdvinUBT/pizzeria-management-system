const db = require('../config/db');

// Merr te gjitha produktet
const getProduktet = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, k.emri_kategorise 
            FROM produktet p
            LEFT JOIN kategorite k ON p.kategori_id = k.kategori_id
            ORDER BY p.produkt_id DESC
        `);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje produkt sipas ID
const getProdukti = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, k.emri_kategorise 
            FROM produktet p
            LEFT JOIN kategorite k ON p.kategori_id = k.kategori_id
            WHERE p.produkt_id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Produkti nuk u gjet!' });
        }
        res.json({ sukses: true, te_dhena: rows[0] });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr produktet sipas kategorise
const getProduktetSipasKategorise = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, k.emri_kategorise 
            FROM produktet p
            LEFT JOIN kategorite k ON p.kategori_id = k.kategori_id
            WHERE p.kategori_id = ?
            ORDER BY p.emri_produktit ASC
        `, [req.params.kategoriId]);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje produkt te ri
const krijoProdukt = async (req, res) => {
    try {
        const { kategori_id, emri_produktit, pershkrimi, cmimi_baze, foto_url, aktive, koha_pergatitjes_min } = req.body;
        const [result] = await db.query(
            'INSERT INTO produktet (kategori_id, emri_produktit, pershkrimi, cmimi_baze, foto_url, aktive, koha_pergatitjes_min) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [kategori_id, emri_produktit, pershkrimi, cmimi_baze, foto_url, aktive !== undefined ? aktive : true, koha_pergatitjes_min || 0]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Produkti u krijua me sukses!',
            produkt_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso nje produkt
const perditesoProdukt = async (req, res) => {
    try {
        const { kategori_id, emri_produktit, pershkrimi, cmimi_baze, foto_url, aktive, koha_pergatitjes_min } = req.body;
        const [result] = await db.query(
            'UPDATE produktet SET kategori_id = ?, emri_produktit = ?, pershkrimi = ?, cmimi_baze = ?, foto_url = ?, aktive = ?, koha_pergatitjes_min = ? WHERE produkt_id = ?',
            [kategori_id, emri_produktit, pershkrimi, cmimi_baze, foto_url, aktive, koha_pergatitjes_min, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Produkti nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Produkti u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje produkt
const fshiProdukt = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM produktet WHERE produkt_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Produkti nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Produkti u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getProduktet, getProdukti, getProduktetSipasKategorise, krijoProdukt, perditesoProdukt, fshiProdukt };