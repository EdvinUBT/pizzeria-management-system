const db = require('../config/db');

// Merr profilin e klientit
const getProfilin = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT klient_id, emri, mbiemri, email, telefoni, adresa, data_regjistrimit FROM klientet WHERE klient_id = ?',
            [req.params.klientId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Klienti nuk u gjet!' });
        }
        res.json({ sukses: true, te_dhena: rows[0] });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Perditeso profilin
const perditesoProfilin = async (req, res) => {
    try {
        const { emri, mbiemri, telefoni, adresa } = req.body;
        const [result] = await db.query(
            'UPDATE klientet SET emri = ?, mbiemri = ?, telefoni = ?, adresa = ? WHERE klient_id = ?',
            [emri, mbiemri, telefoni, adresa, req.params.klientId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Klienti nuk u gjet!' });
        }
        res.json({ sukses: true, mesazhi: 'Profili u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr porosite e klientit me detaje
const getPorositeEMia = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, 
                (SELECT COUNT(*) FROM vleresimet v WHERE v.porosi_id = p.porosi_id AND v.klient_id = p.klient_id) AS ka_vleresim
            FROM porosite p
            WHERE p.klient_id = ?
            ORDER BY p.data_porosise DESC
        `, [req.params.klientId]);
        res.json({ sukses: true, te_dhena: rows });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr detajet e nje porosie
const getDetajetEPorosise = async (req, res) => {
    try {
        const [porosi] = await db.query(`
            SELECT p.* FROM porosite p
            WHERE p.porosi_id = ? AND p.klient_id = ?
        `, [req.params.porosiId, req.params.klientId]);

        if (porosi.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Porosia nuk u gjet!' });
        }

        const [detajet] = await db.query(`
            SELECT dp.*, pr.emri_produktit, pr.foto_url
            FROM detajet_porosise dp
            LEFT JOIN produktet pr ON dp.produkt_id = pr.produkt_id
            WHERE dp.porosi_id = ?
        `, [req.params.porosiId]);

        // Merr dergesen nese ekziston
        const [dergesa] = await db.query(`
            SELECT d.*, pun.emri AS shofer_emri, pun.mbiemri AS shofer_mbiemri, pun.telefoni AS shofer_telefoni
            FROM dergesat d
            LEFT JOIN punonjesit pun ON d.punonjes_id = pun.punonjes_id
            WHERE d.porosi_id = ?
        `, [req.params.porosiId]);

        res.json({
            sukses: true,
            te_dhena: {
                ...porosi[0],
                detajet: detajet,
                dergesa: dergesa.length > 0 ? dergesa[0] : null
            }
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo porosi te re nga klienti
const krijoPorosi = async (req, res) => {
    try {
        const { metoda_pageses, adresa_dergeses, shenimet, detajet, kupon_kodi } = req.body;
        const klient_id = req.params.klientId;

        // Krijo porosine
        const [result] = await db.query(
            'INSERT INTO porosite (klient_id, metoda_pageses, adresa_dergeses, shenimet) VALUES (?, ?, ?, ?)',
            [klient_id, metoda_pageses || 'cash', adresa_dergeses, shenimet]
        );

        const porosi_id = result.insertId;
        let totali = 0;

        // Shto detajet
        if (detajet && detajet.length > 0) {
            for (const detaj of detajet) {
                // Perdor cmimin e derguar (mund te jete cmim oferte), ose merr nga databaza
                let cmimi = detaj.cmimi_njesi;
                if (!cmimi) {
                    const [produkt] = await db.query('SELECT cmimi_baze FROM produktet WHERE produkt_id = ?', [detaj.produkt_id]);
                    cmimi = produkt.length > 0 ? produkt[0].cmimi_baze : 0;
                }
                const nentotali = detaj.sasia * cmimi;
                totali += nentotali;

                await db.query(
                    'INSERT INTO detajet_porosise (porosi_id, produkt_id, sasia, cmimi_njesi, personalizimi, nentotali) VALUES (?, ?, ?, ?, ?, ?)',
                    [porosi_id, detaj.produkt_id, detaj.sasia, cmimi, detaj.personalizimi || null, nentotali]
                );
            }
        }

        // Apliko kuponin nese ekziston
        let zbritja = 0;
        if (kupon_kodi) {
            const [kuponat] = await db.query(
                'SELECT * FROM kuponat WHERE kodi = ? AND aktiv = TRUE AND data_fillimit <= CURDATE() AND data_skadimit >= CURDATE() AND perdorimet_aktuale < perdorimet_max',
                [kupon_kodi]
            );

            if (kuponat.length > 0) {
                const kupon = kuponat[0];
                if (totali >= kupon.porosi_min) {
                    zbritja = (totali * kupon.zbritja_perqind) / 100;
                    if (kupon.zbritja_max && zbritja > kupon.zbritja_max) {
                        zbritja = parseFloat(kupon.zbritja_max);
                    }
                    await db.query('UPDATE kuponat SET perdorimet_aktuale = perdorimet_aktuale + 1 WHERE kupon_id = ?', [kupon.kupon_id]);
                }
            }
        }

        const totaliPerfundimtar = totali - zbritja;
        await db.query('UPDATE porosite SET totali = ? WHERE porosi_id = ?', [totaliPerfundimtar, porosi_id]);

        res.status(201).json({
            sukses: true,
            mesazhi: 'Porosia u krijua me sukses!',
            porosi_id: porosi_id,
            totali: totaliPerfundimtar,
            zbritja: zbritja
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Anulo porosi (vetem nese eshte ne_pritje)
const anuloPorosi = async (req, res) => {
    try {
        const [porosi] = await db.query(
            'SELECT statusi FROM porosite WHERE porosi_id = ? AND klient_id = ?',
            [req.params.porosiId, req.params.klientId]
        );

        if (porosi.length === 0) {
            return res.status(404).json({ sukses: false, mesazhi: 'Porosia nuk u gjet!' });
        }

        if (porosi[0].statusi !== 'ne_pritje') {
            return res.status(400).json({ sukses: false, mesazhi: 'Vetem porosite ne pritje mund te anulohen!' });
        }

        await db.query(
            "UPDATE porosite SET statusi = 'anuluar' WHERE porosi_id = ?",
            [req.params.porosiId]
        );

        res.json({ sukses: true, mesazhi: 'Porosia u anulua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Krijo vleresim per porosi
const krijoVleresim = async (req, res) => {
    try {
        const { yjet, komenti } = req.body;
        const klient_id = req.params.klientId;
        const porosi_id = req.params.porosiId;

        // Kontrollo nese porosia i perket klientit dhe eshte dorezuar
        const [porosi] = await db.query(
            "SELECT porosi_id FROM porosite WHERE porosi_id = ? AND klient_id = ? AND statusi = 'dorezuar'",
            [porosi_id, klient_id]
        );

        if (porosi.length === 0) {
            return res.status(400).json({ sukses: false, mesazhi: 'Vetem porosite e dorezuara mund te vleresohen!' });
        }

        // Kontrollo nese ka vleresim tashme
        const [existing] = await db.query(
            'SELECT vleresim_id FROM vleresimet WHERE klient_id = ? AND porosi_id = ?',
            [klient_id, porosi_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ sukses: false, mesazhi: 'Kjo porosi eshte vleresuar tashme!' });
        }

        const [result] = await db.query(
            'INSERT INTO vleresimet (klient_id, porosi_id, yjet, komenti) VALUES (?, ?, ?, ?)',
            [klient_id, porosi_id, yjet, komenti]
        );

        res.status(201).json({
            sukses: true,
            mesazhi: 'Faleminderit per vleresimin!',
            vleresim_id: result.insertId
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr menyne aktive me produktet
const getMenyteAktive = async (req, res) => {
    try {
        const [menyte] = await db.query(`
            SELECT m.*, 
                (SELECT COUNT(*) FROM meny_produktet mp WHERE mp.meny_id = m.meny_id) AS numri_produkteve
            FROM menyte m
            WHERE m.aktive = TRUE AND (m.data_mbarimit IS NULL OR m.data_mbarimit >= CURDATE())
            ORDER BY m.meny_id DESC
        `);

        // Per secilen meny, merr produktet
        for (let meny of menyte) {
            const [produktet] = await db.query(`
                SELECT mp.*, p.emri_produktit, p.pershkrimi, p.cmimi_baze, p.foto_url, p.koha_pergatitjes_min,
                    k.emri_kategorise
                FROM meny_produktet mp
                LEFT JOIN produktet p ON mp.produkt_id = p.produkt_id
                LEFT JOIN kategorite k ON p.kategori_id = k.kategori_id
                WHERE mp.meny_id = ? AND p.aktive = TRUE
                ORDER BY mp.renditja ASC
            `, [meny.meny_id]);
            meny.produktet = produktet;
        }

        res.json({ sukses: true, te_dhena: menyte });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Verifiko kuponin (pa e aplikuar)
const verifikoKupon = async (req, res) => {
    try {
        const { kodi, totali } = req.body;

        const [kuponat] = await db.query(
            'SELECT * FROM kuponat WHERE kodi = ? AND aktiv = TRUE AND data_fillimit <= CURDATE() AND data_skadimit >= CURDATE() AND perdorimet_aktuale < perdorimet_max',
            [kodi]
        );

        if (kuponat.length === 0) {
            return res.status(400).json({ sukses: false, mesazhi: 'Kuponi nuk eshte i vlefshem!' });
        }

        const kupon = kuponat[0];

        if (totali < kupon.porosi_min) {
            return res.status(400).json({
                sukses: false,
                mesazhi: `Porosi minimale per kete kupon: ${kupon.porosi_min} EUR`
            });
        }

        let zbritja = (totali * kupon.zbritja_perqind) / 100;
        if (kupon.zbritja_max && zbritja > kupon.zbritja_max) {
            zbritja = parseFloat(kupon.zbritja_max);
        }

        res.json({
            sukses: true,
            mesazhi: 'Kuponi eshte i vlefshem!',
            zbritja_perqind: kupon.zbritja_perqind,
            zbritja: zbritja,
            totali_ri: totali - zbritja
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

// Merr vleresimet per produktet
const getVleresimetProdukteve = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT dp.produkt_id, 
                ROUND(AVG(v.yjet), 1) AS mesatarja_yjeve,
                COUNT(v.vleresim_id) AS numri_vleresimeve
            FROM vleresimet v
            INNER JOIN detajet_porosise dp ON dp.porosi_id = v.porosi_id
            GROUP BY dp.produkt_id
        `);

        // Merr komentet e fundit per secilin produkt
        const [komentet] = await db.query(`
            SELECT dp.produkt_id, v.yjet, v.komenti, v.data_vleresimit, k.emri
            FROM vleresimet v
            INNER JOIN detajet_porosise dp ON dp.porosi_id = v.porosi_id
            INNER JOIN klientet k ON v.klient_id = k.klient_id
            WHERE v.komenti IS NOT NULL AND v.komenti != ''
            ORDER BY v.data_vleresimit DESC
        `);

        // Grupo komentet sipas produktit
        const komenteSipasProduktit = {};
        for (const k of komentet) {
            if (!komenteSipasProduktit[k.produkt_id]) {
                komenteSipasProduktit[k.produkt_id] = [];
            }
            if (komenteSipasProduktit[k.produkt_id].length < 3) {
                komenteSipasProduktit[k.produkt_id].push(k);
            }
        }

        const rezultati = {};
        for (const r of rows) {
            rezultati[r.produkt_id] = {
                mesatarja: r.mesatarja_yjeve,
                numri: r.numri_vleresimeve,
                komentet: komenteSipasProduktit[r.produkt_id] || []
            };
        }

        res.json({ sukses: true, te_dhena: rezultati });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: 'Gabim ne server' });
    }
};

module.exports = {
    getProfilin,
    perditesoProfilin,
    getPorositeEMia,
    getDetajetEPorosise,
    krijoPorosi,
    anuloPorosi,
    krijoVleresim,
    getMenyteAktive,
    verifikoKupon,
    getVleresimetProdukteve
};