const kuponatService = require('../services/kuponatService');

const getKuponat = async (req, res) => {
    try {
        const te_dhena = await kuponatService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getKuponiMeKod = async (req, res) => {
    try {
        const te_dhena = await kuponatService.getByKod(req.params.kodi);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoKupon = async (req, res) => {
    try {
        const kuponi = await kuponatService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Kuponi u krijua me sukses!',
            kupon_id: kuponi.kupon_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoKupon = async (req, res) => {
    try {
        await kuponatService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Kuponi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const aplikoKupon = async (req, res) => {
    try {
        const rezultati = await kuponatService.apliko(req.body.kodi, req.body.porosi_id);
        res.json({
            sukses: true,
            mesazhi: 'Kuponi u aplikua me sukses!',
            zbritja: rezultati.zbritja,
            totali_ri: rezultati.totali_ri
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiKupon = async (req, res) => {
    try {
        await kuponatService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Kuponi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const searchKuponat = async (req, res) => {
    try {
        const te_dhena = await kuponatService.search(req.query);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getKuponat, getKuponiMeKod, krijoKupon, perditesoKupon, aplikoKupon, fshiKupon, searchKuponat };