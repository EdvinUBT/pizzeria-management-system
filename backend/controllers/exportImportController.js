const exportHelper = require('../utils/exportHelper');
const produktetRepository = require('../repositories/produktetRepository');
const porositeRepository = require('../repositories/porositeRepository');
const klientetRepository = require('../repositories/klientetRepository');
const punonjesitRepository = require('../repositories/punonjesitRepository');
const kuponatRepository = require('../repositories/kuponatRepository');

const entities = {
    produktet: {
        repository: produktetRepository,
        columns: [
            { header: 'ID', key: 'produkt_id', width: 8 },
            { header: 'Emri', key: 'emri_produktit', width: 25 },
            { header: 'Kategoria', key: 'emri_kategorise', width: 15 },
            { header: 'Cmimi', key: 'cmimi_baze', width: 10 },
            { header: 'Pershkrimi', key: 'pershkrimi', width: 30 },
            { header: 'Aktive', key: 'aktive', width: 8 },
            { header: 'Koha Pergatitjes', key: 'koha_pergatitjes_min', width: 15 }
        ]
    },
    porosite: {
        repository: porositeRepository,
        columns: [
            { header: 'ID', key: 'porosi_id', width: 8 },
            { header: 'Emri Klientit', key: 'emri', width: 15 },
            { header: 'Mbiemri Klientit', key: 'mbiemri', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Totali', key: 'totali', width: 10 },
            { header: 'Statusi', key: 'statusi', width: 12 },
            { header: 'Metoda Pageses', key: 'metoda_pageses', width: 15 },
            { header: 'Data', key: 'data_porosise', width: 18 }
        ]
    },
    klientet: {
        repository: klientetRepository,
        columns: [
            { header: 'ID', key: 'klient_id', width: 8 },
            { header: 'Emri', key: 'emri', width: 15 },
            { header: 'Mbiemri', key: 'mbiemri', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Telefoni', key: 'telefoni', width: 15 },
            { header: 'Adresa', key: 'adresa', width: 25 },
            { header: 'Data Regjistrimit', key: 'data_regjistrimit', width: 18 }
        ]
    },
    punonjesit: {
        repository: punonjesitRepository,
        columns: [
            { header: 'ID', key: 'punonjes_id', width: 8 },
            { header: 'Emri', key: 'emri', width: 15 },
            { header: 'Mbiemri', key: 'mbiemri', width: 15 },
            { header: 'Roli', key: 'roli', width: 12 },
            { header: 'Telefoni', key: 'telefoni', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Aktiv', key: 'aktiv', width: 8 }
        ]
    },
    kuponat: {
        repository: kuponatRepository,
        columns: [
            { header: 'ID', key: 'kupon_id', width: 8 },
            { header: 'Kodi', key: 'kodi', width: 15 },
            { header: 'Zbritja %', key: 'zbritja_perqind', width: 10 },
            { header: 'Zbritja Max', key: 'zbritja_max', width: 12 },
            { header: 'Porosi Min', key: 'porosi_min', width: 12 },
            { header: 'Perdorimet', key: 'perdorimet_aktuale', width: 12 },
            { header: 'Perdorimet Max', key: 'perdorimet_max', width: 14 },
            { header: 'Data Fillimit', key: 'data_fillimit', width: 15 },
            { header: 'Data Skadimit', key: 'data_skadimit', width: 15 },
            { header: 'Aktiv', key: 'aktiv', width: 8 }
        ]
    }
};

const exportData = async (req, res) => {
    try {
        const { entity } = req.params;
        const { format } = req.query;

        if (!entities[entity]) {
            return res.status(400).json({ sukses: false, mesazhi: 'Entiteti nuk ekziston' });
        }

        const config = entities[entity];
        const data = await config.repository.getAll();

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=${entity}.json`);
            return res.send(exportHelper.toJSON(data));
        }

        if (format === 'csv') {
            const csv = exportHelper.toCSV(data, config.columns);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=${entity}.csv`);
            return res.send(csv);
        }

        if (format === 'excel') {
            const buffer = await exportHelper.toExcel(data, config.columns, entity);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${entity}.xlsx`);
            return res.send(Buffer.from(buffer));
        }

        return res.status(400).json({ sukses: false, mesazhi: 'Formati duhet te jete: json, csv ose excel' });
    } catch (error) {
        console.error('Gabim ne eksportim:', error);
        res.status(500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const importData = async (req, res) => {
    try {
        const { entity } = req.params;
        const { format } = req.query;

        if (!entities[entity]) {
            return res.status(400).json({ sukses: false, mesazhi: 'Entiteti nuk ekziston' });
        }

        let importedData = [];

        if (format === 'json') {
            importedData = req.body;
            if (!Array.isArray(importedData)) {
                return res.status(400).json({ sukses: false, mesazhi: 'Formati JSON duhet te jete nje array' });
            }
        } else if (format === 'csv') {
            const csvString = req.body.toString();
            importedData = exportHelper.parseCSV(csvString);
        } else if (format === 'excel') {
            importedData = await exportHelper.parseExcel(req.body);
        } else {
            return res.status(400).json({ sukses: false, mesazhi: 'Formati duhet te jete: json, csv ose excel' });
        }

        let created = 0;
        let errors = [];

        for (let i = 0; i < importedData.length; i++) {
            try {
                await entities[entity].repository.create({
                    ...importedData[i],
                    created_by: req.user?.id
                });
                created++;
            } catch (err) {
                errors.push(`Rreshti ${i + 1}: ${err.message || 'Gabim'}`);
            }
        }

        res.json({
            sukses: true,
            mesazhi: `${created} rekorde u importuan me sukses`,
            gabimet: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Gabim ne importim:', error);
        res.status(500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { exportData, importData };