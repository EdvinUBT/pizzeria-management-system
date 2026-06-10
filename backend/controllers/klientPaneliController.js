const klientPaneliService = require('../services/klientPaneliService');

const getProfilin = async (req, res) => {
    try {
        const te_dhena = await klientPaneliService.getProfilin(req.params.klientId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoProfilin = async (req, res) => {
    try {
        await klientPaneliService.perditesoProfilin(req.params.klientId, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Profili u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getPorositeEMia = async (req, res) => {
    try {
        const te_dhena = await klientPaneliService.getPorositeEMia(req.params.klientId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getDetajetEPorosise = async (req, res) => {
    try {
        const te_dhena = await klientPaneliService.getDetajetEPorosise(req.params.porosiId, req.params.klientId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoPorosi = async (req, res) => {
    try {
        const rezultati = await klientPaneliService.krijoPorosi(req.params.klientId, req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Porosia u krijua me sukses!',
            porosi_id: rezultati.porosi_id,
            totali: rezultati.totali,
            zbritja: rezultati.zbritja
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const anuloPorosi = async (req, res) => {
    try {
        await klientPaneliService.anuloPorosi(req.params.porosiId, req.params.klientId);
        res.json({ sukses: true, mesazhi: 'Porosia u anulua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoVleresim = async (req, res) => {
    try {
        const rezultati = await klientPaneliService.krijoVleresim(req.params.klientId, req.params.porosiId, req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Faleminderit per vleresimin!',
            vleresim_id: rezultati.vleresim_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getMenyteAktive = async (req, res) => {
    try {
        const te_dhena = await klientPaneliService.getMenyteAktive();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const verifikoKupon = async (req, res) => {
    try {
        const rezultati = await klientPaneliService.verifikoKupon(req.body.kodi, req.body.totali);
        res.json({
            sukses: true,
            mesazhi: 'Kuponi eshte i vlefshem!',
            ...rezultati
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getVleresimetProdukteve = async (req, res) => {
    try {
        const te_dhena = await klientPaneliService.getVleresimetProdukteve();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = {
    getProfilin, perditesoProfilin, getPorositeEMia, getDetajetEPorosise,
    krijoPorosi, anuloPorosi, krijoVleresim, getMenyteAktive, verifikoKupon, getVleresimetProdukteve
};