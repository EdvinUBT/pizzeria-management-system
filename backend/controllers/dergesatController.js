const dergesatService = require('../services/dergesatService');

const getDergesat = async (req, res) => {
    try {
        const te_dhena = await dergesatService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getDergesa = async (req, res) => {
    try {
        const te_dhena = await dergesatService.getById(req.params.id);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoDergese = async (req, res) => {
    try {
        const dergesa = await dergesatService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Dergesa u krijua me sukses!',
            dergese_id: dergesa.dergese_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoStatusin = async (req, res) => {
    try {
        await dergesatService.updateStatusi(req.params.id, req.body.statusi, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Statusi i dergeses u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiDergese = async (req, res) => {
    try {
        await dergesatService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Dergesa u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getDergesat, getDergesa, krijoDergese, perditesoStatusin, fshiDergese };