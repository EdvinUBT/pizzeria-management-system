const produktetService = require('../services/produktetService');

// Merr te gjitha produktet
const getProduktet = async (req, res) => {
    try {
        const te_dhena = await produktetService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

// Merr nje produkt sipas ID
const getProdukti = async (req, res) => {
    try {
        const te_dhena = await produktetService.getById(req.params.id);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

// Merr produktet sipas kategorise
const getProduktetSipasKategorise = async (req, res) => {
    try {
        const te_dhena = await produktetService.getByKategori(req.params.kategoriId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

// Krijo nje produkt te ri
const krijoProdukt = async (req, res) => {
    try {
        const produkti = await produktetService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Produkti u krijua me sukses!',
            produkt_id: produkti.produkt_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

// Perditeso nje produkt
const perditesoProdukt = async (req, res) => {
    try {
        await produktetService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Produkti u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

// Fshi nje produkt
const fshiProdukt = async (req, res) => {
    try {
        await produktetService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Produkti u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getProduktet, getProdukti, getProduktetSipasKategorise, krijoProdukt, perditesoProdukt, fshiProdukt };