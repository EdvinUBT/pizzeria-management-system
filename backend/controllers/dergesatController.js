const db = require('../config/db');

// Merr te gjitha dergesat
const getDergesat = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT d.*, p.totali, p.statusi AS statusi_porosise, 
                   pu.emri AS emri_shoferit, pu.mbiemri AS mbiemri_shoferit,
                   k.emri AS emri_klientit, k.mbiemri AS mbiemri_klientit
            FROM dergesat d
            LEFT JOIN porosite p ON d.porosi_id = p.porosi_id
            LEFT JOIN punonjesit pu ON d.punonjes_id = pu.punonjes_id
            LEFT JOIN klientet k ON p.klient_id = k.klient_id
            ORDER BY d.dergese_id DESC
        `);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr nje dergese sipas ID
const getDergesa = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT d.*, p.totali, p.statusi AS statusi_porosise,
                   pu.emri AS emri_shoferit, pu.mbiemri AS mbiemri_shoferit,
                   k.emri AS emri_klientit, k.mbiemri AS mbiemri_klientit
            FROM dergesat d
            LEFT JOIN porosite p ON d.porosi_id = p.porosi_id
            LEFT JOIN punonjesit pu ON d.punonjes_id = pu.punonjes_id
            LEFT JOIN klientet k ON p.klient_id = k.klient_id
            WHERE d.dergese_id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Dergesa nuk u gjet!' });
        }
        res.json({ sukses: true, te_dhena: rows[0] });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo nje dergese te re
const krijoDergese = async (req, res) => {
    try {
        const { porosi_id, punonjes_id, adresa } = req.body;
        const [result] = await db.query(
            'INSERT INTO dergesat (porosi_id, punonjes_id, koha_nisjes, adresa) VALUES (?, ?, NOW(), ?)',
            [porosi_id, punonjes_id, adresa]
        );

        // Perditeso statusin e porosise ne "ne_dergim"
        await db.query("UPDATE porosite SET statusi = 'ne_dergim' WHERE porosi_id = ?", [porosi_id]);

        res.status(201).json({
            sukses: true,
            mesazhi: 'Dergesa u krijua me sukses!',
            dergese_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso statusin e dergeses
const perditesoStatusin = async (req, res) => {
    try {
        const { statusi } = req.body;
        let query = 'UPDATE dergesat SET statusi = ?';
        let params = [statusi];

        // Nese statusi eshte "dorezuar", vendos kohen e dergeses
        if (statusi === 'dorezuar') {
            query += ', koha_dergeses = NOW()';
        }

        query += ' WHERE dergese_id = ?';
        params.push(req.params.id);

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Dergesa nuk u gjet!' });
        }

        // Nese dergesa u dorezua, perditeso edhe statusin e porosise
        if (statusi === 'dorezuar') {
            const [dergesa] = await db.query('SELECT porosi_id FROM dergesat WHERE dergese_id = ?', [req.params.id]);
            if (dergesa.length > 0) {
                await db.query("UPDATE porosite SET statusi = 'dorezuar' WHERE porosi_id = ?", [dergesa[0].porosi_id]);
            }
        }

        res.json({ sukses: true, mesazhi: 'Statusi i dergeses u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Fshi nje dergese
const fshiDergese = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM dergesat WHERE dergese_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Dergesa nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Dergesa u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = { getDergesat, getDergesa, krijoDergese, perditesoStatusin, fshiDergese };