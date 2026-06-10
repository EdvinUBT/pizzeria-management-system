const porositeService = require('../services/porositeService');
const { sendNotification } = require('../utils/socketHelper');

const getPorosite = async (req, res) => {
    try {
        const te_dhena = await porositeService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getPorosia = async (req, res) => {
    try {
        const te_dhena = await porositeService.getById(req.params.id);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getPorositeEKlientit = async (req, res) => {
    try {
        const te_dhena = await porositeService.getByKlientId(req.params.klientId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoPorosi = async (req, res) => {
    try {
        const rezultati = await porositeService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Porosia u krijua me sukses!',
            porosi_id: rezultati.porosi_id,
            totali: rezultati.totali
        });

        // Njofto admin-et per porosi te re
        const io = req.app.get('io');
        io.to('admin_room').emit('porosi_e_re', {
            porosi_id: rezultati.porosi_id,
            totali: rezultati.totali
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoStatusin = async (req, res) => {
    try {
        await porositeService.updateStatusi(req.params.id, req.body.statusi, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Statusi i porosise u perditesua me sukses!' });

        // Merr klient_id nga porosia per ta njoftuar
        const porosia = await porositeService.getById(req.params.id);
        if (porosia && porosia.klient_id) {
            await sendNotification(req, porosia.klient_id, {
                type: 'statusi_porosise',
                title: 'Statusi i porosise u ndryshua',
                message: `Porosia #${req.params.id} tani eshte: ${req.body.statusi}`
            });
        }
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const anuloPorosi = async (req, res) => {
    try {
        await porositeService.anulo(req.params.id, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Porosia u anulua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiPorosi = async (req, res) => {
    try {
        await porositeService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Porosia u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const searchPorosite = async (req, res) => {
    try {
        const te_dhena = await porositeService.search(req.query);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getPorosite, getPorosia, getPorositeEKlientit, krijoPorosi, perditesoStatusin, anuloPorosi, fshiPorosi, searchPorosite };