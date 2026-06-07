const klientetService = require('../services/klientetService');

const getKlientet = async (req, res) => {
    try {
        const te_dhena = await klientetService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getKlienti = async (req, res) => {
    try {
        const te_dhena = await klientetService.getById(req.params.id);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoKlient = async (req, res) => {
    try {
        const klienti = await klientetService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Klienti u krijua me sukses!',
            klient_id: klienti.klient_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoKlient = async (req, res) => {
    try {
        await klientetService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Klienti u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiKlient = async (req, res) => {
    try {
        await klientetService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Klienti u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getKlientet, getKlienti, krijoKlient, perditesoKlient, fshiKlient };