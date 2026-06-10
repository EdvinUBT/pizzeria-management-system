const rolesService = require('../services/rolesService');

const getRoles = async (req, res) => {
    try {
        const te_dhena = await rolesService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getRole = async (req, res) => {
    try {
        const te_dhena = await rolesService.getById(req.params.id);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoRole = async (req, res) => {
    try {
        const roli = await rolesService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Roli u krijua me sukses!',
            roleId: roli.id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoRole = async (req, res) => {
    try {
        await rolesService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Roli u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiRole = async (req, res) => {
    try {
        await rolesService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Roli u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getRoles, getRole, krijoRole, perditesoRole, fshiRole };