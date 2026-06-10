const punonjesitService = require('../services/punonjesitService');

const getPunonjesit = async (req, res) => {
    try {
        const te_dhena = await punonjesitService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getPunonjesi = async (req, res) => {
    try {
        const te_dhena = await punonjesitService.getById(req.params.id);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoPunonjes = async (req, res) => {
    try {
        const punonjesi = await punonjesitService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Punonjesi u krijua me sukses!',
            punonjes_id: punonjesi.punonjes_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoPunonjes = async (req, res) => {
    try {
        await punonjesitService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Punonjesi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiPunonjes = async (req, res) => {
    try {
        await punonjesitService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Punonjesi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const searchPunonjesit = async (req, res) => {
    try {
        const te_dhena = await punonjesitService.search(req.query);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getPunonjesit, getPunonjesi, krijoPunonjes, perditesoPunonjes, fshiPunonjes, searchPunonjesit };