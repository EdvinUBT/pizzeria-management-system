const kategoriteService = require('../services/kategoriteService');

// Merr te gjitha kategorite
const getKategorite = async (req, res) => {
    try {
        const te_dhena = await kategoriteService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

// Merr nje kategori sipas ID
const getKategoria = async (req, res) => {
    try {
        const te_dhena = await kategoriteService.getById(req.params.id);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

// Krijo nje kategori te re
const krijoKategori = async (req, res) => {
    try {
        const kategoria = await kategoriteService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Kategoria u krijua me sukses!',
            kategori_id: kategoria.kategori_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

// Perditeso nje kategori
const perditesoKategori = async (req, res) => {
    try {
        await kategoriteService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Kategoria u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

// Fshi nje kategori
const fshiKategori = async (req, res) => {
    try {
        await kategoriteService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Kategoria u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getKategorite, getKategoria, krijoKategori, perditesoKategori, fshiKategori };