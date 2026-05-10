const db = require('../config/db');

// Merr perberesit e nje produkti
const getPerberesitEProduktit = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT pp.*, p.emri_perberesit, p.njesia_matese, p.cmimi_shtese, p.alergjene
            FROM produkt_perberesit pp
            LEFT JOIN perberesit p ON pp.perberes_id = p.perberes_id
            WHERE pp.produkt_id = ?
        `, [req.params.produktId]);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Shto perberes ne produkt
const shtoPerberesNeProdukt = async (req, res) => {
    try {
        const { perberes_id, sasia_standarde, eshte_opsionale } = req.body;
        const [result] = await db.query(
            'INSERT INTO produkt_perberesit (produkt_id, perberes_id, sasia_standarde, eshte_opsionale) VALUES (?, ?, ?, ?)',
            [req.params.produktId, perberes_id, sasia_standarde || 0, eshte_opsionale || false]
        );
        res.status(201).json({
            sukses: true,
            mesazhi: 'Perberesi u shtua ne produkt me sukses!',
            produkt_perberes_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso sasine e perberesit ne produkt
const perditesoPerberesNeProdukt = async (req, res) => {
    try {
        const { sasia_standarde, eshte_opsionale } = req.body;
        const [result] = await db.query(
            'UPDATE produkt_perberesit SET sasia_standarde = ?, eshte_opsionale = ? WHERE produkt_perberes_id = ?',
            [sasia_standarde, eshte_opsionale, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Lidhja nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Perberesi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Hiq perberes nga produkti
const hiqPerberesNgaProdukti = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM produkt_perberesit WHERE produkt_id = ? AND perberes_id = ?',
            [req.params.produktId, req.params.perberesId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Lidhja nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Perberesi u hoq nga produkti me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getPerberesitEProduktit, shtoPerberesNeProdukt, perditesoPerberesNeProdukt, hiqPerberesNgaProdukti };