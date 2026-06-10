const adresatService = require('../services/adresatService');

const getAdresatEKlientit = async (req, res) => {
    try {
        const te_dhena = await adresatService.getByKlientId(req.params.klientId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const shtoAdrese = async (req, res) => {
    try {
        const adresa = await adresatService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Adresa u shtua me sukses!',
            adrese_id: adresa.adrese_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoAdrese = async (req, res) => {
    try {
        await adresatService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Adresa u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiAdrese = async (req, res) => {
    try {
        await adresatService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Adresa u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getAdresatEKlientit, shtoAdrese, perditesoAdrese, fshiAdrese };