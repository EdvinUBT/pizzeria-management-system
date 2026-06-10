const perberesitService = require('../services/perberesitService');

const getPerberesit = async (req, res) => {
    try {
        const te_dhena = await perberesitService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getPerberesi = async (req, res) => {
    try {
        const te_dhena = await perberesitService.getById(req.params.id);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoPerberes = async (req, res) => {
    try {
        const perberesi = await perberesitService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Perberesi u krijua me sukses!',
            perberes_id: perberesi.perberes_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoPerberes = async (req, res) => {
    try {
        await perberesitService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Perberesi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiPerberes = async (req, res) => {
    try {
        await perberesitService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Perberesi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getPerberesit, getPerberesi, krijoPerberes, perditesoPerberes, fshiPerberes };