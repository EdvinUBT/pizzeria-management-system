const userClaimsService = require('../services/userClaimsService');

const getClaimsEPerdoruesit = async (req, res) => {
    try {
        const te_dhena = await userClaimsService.getByUserId(req.params.userId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const shtoClaim = async (req, res) => {
    try {
        const claim = await userClaimsService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Claim u shtua me sukses!',
            id: claim.id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoClaim = async (req, res) => {
    try {
        await userClaimsService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Claim u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiClaim = async (req, res) => {
    try {
        await userClaimsService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Claim u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getClaimsEPerdoruesit, shtoClaim, perditesoClaim, fshiClaim };