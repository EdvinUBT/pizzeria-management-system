const userRolesService = require('../services/userRolesService');

const getRoletEPerdoruesit = async (req, res) => {
    try {
        const te_dhena = await userRolesService.getByUserId(req.params.userId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const caktoRol = async (req, res) => {
    try {
        const rezultati = await userRolesService.caktoRol(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Roli u caktua me sukses!',
            id: rezultati.id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const hiqRol = async (req, res) => {
    try {
        await userRolesService.hiqRol(req.params.userId, req.params.roleId);
        res.json({ sukses: true, mesazhi: 'Roli u hoq me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getRoletEPerdoruesit, caktoRol, hiqRol };