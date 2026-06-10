const userTokensService = require('../services/userTokensService');

const getTokenatEPerdoruesit = async (req, res) => {
    try {
        const te_dhena = await userTokensService.getByUserId(req.params.userId);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const shtoToken = async (req, res) => {
    try {
        const token = await userTokensService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Tokeni u shtua me sukses!',
            id: token.id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiToken = async (req, res) => {
    try {
        await userTokensService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Tokeni u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiTeGjithaTokenat = async (req, res) => {
    try {
        await userTokensService.deleteAllByUserId(req.params.userId);
        res.json({ sukses: true, mesazhi: 'Te gjitha tokenat u fshine me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getTokenatEPerdoruesit, shtoToken, fshiToken, fshiTeGjithaTokenat };