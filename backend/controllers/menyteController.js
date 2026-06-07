const menyteService = require('../services/menyteService');

const getMenyte = async (req, res) => {
    try {
        const te_dhena = await menyteService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getMenuja = async (req, res) => {
    try {
        const te_dhena = await menyteService.getById(req.params.id);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoMeny = async (req, res) => {
    try {
        const menyja = await menyteService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Menyja u krijua me sukses!',
            meny_id: menyja.meny_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoMeny = async (req, res) => {
    try {
        await menyteService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Menyja u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const shtoProduktNeMeny = async (req, res) => {
    try {
        const rezultati = await menyteService.shtoProdukt(req.params.id, req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Produkti u shtua ne meny me sukses!',
            meny_produkt_id: rezultati.meny_produkt_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const hiqProduktNgaMenyja = async (req, res) => {
    try {
        await menyteService.hiqProdukt(req.params.id, req.params.produktId);
        res.json({ sukses: true, mesazhi: 'Produkti u hoq nga menyja me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiMeny = async (req, res) => {
    try {
        await menyteService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Menyja u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getMenyte, getMenuja, krijoMeny, perditesoMeny, shtoProduktNeMeny, hiqProduktNgaMenyja, fshiMeny };