const vleresimetService = require('../services/vleresimetService');

const getVleresimet = async (req, res) => {
    try {
        const te_dhena = await vleresimetService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getVleresimetEPorosise = async (req, res) => {
    try {
        const te_dhena = await vleresimetService.getByPorosiId(req.params.porosiId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoVleresim = async (req, res) => {
    try {
        const vleresimi = await vleresimetService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Vleresimi u krijua me sukses!',
            vleresim_id: vleresimi.vleresim_id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoVleresim = async (req, res) => {
    try {
        await vleresimetService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Vleresimi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiVleresim = async (req, res) => {
    try {
        await vleresimetService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Vleresimi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getVleresimet, getVleresimetEPorosise, krijoVleresim, perditesoVleresim, fshiVleresim };