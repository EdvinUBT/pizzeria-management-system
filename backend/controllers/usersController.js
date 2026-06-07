const usersService = require('../services/usersService');

const getUsers = async (req, res) => {
    try {
        const te_dhena = await usersService.getAll();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const getUser = async (req, res) => {
    try {
        const te_dhena = await usersService.getById(req.params.id);
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const krijoUser = async (req, res) => {
    try {
        const user = await usersService.create(req.body, req.user?.id);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Perdoruesi u krijua me sukses!',
            userId: user.id
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const perditesoUser = async (req, res) => {
    try {
        await usersService.update(req.params.id, req.body, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Perdoruesi u perditesua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const ndryshStatusin = async (req, res) => {
    try {
        await usersService.ndryshStatusin(req.params.id, req.body.statusi, req.user?.id);
        res.json({ sukses: true, mesazhi: 'Statusi u ndryshua me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const fshiUser = async (req, res) => {
    try {
        await usersService.delete(req.params.id);
        res.json({ sukses: true, mesazhi: 'Perdoruesi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getUsers, getUser, krijoUser, perditesoUser, ndryshStatusin, fshiUser };