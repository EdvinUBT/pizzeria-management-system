const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const rezultati = await authService.register(req.body);
        res.status(201).json({
            sukses: true,
            mesazhi: 'Regjistrimi u krye me sukses!',
            userId: rezultati.userId
        });
    } catch (error) {
        console.error('Gabim gjate regjistrimit:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server gjate regjistrimit' });
    }
};

const login = async (req, res) => {
    try {
        const rezultati = await authService.login(req.body.email, req.body.password);

        res.cookie('accessToken', rezultati.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', rezultati.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            sukses: true,
            mesazhi: 'Login u krye me sukses!',
            perdoruesi: rezultati.perdoruesi
        });
    } catch (error) {
        console.error('Gabim gjate login:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server gjate login' });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const rezultati = await authService.refreshAccessToken(req.cookies.refreshToken);

        res.cookie('accessToken', rezultati.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', rezultati.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth'
        });

        res.json({ sukses: true, mesazhi: 'Tokenat u rifreskuan me sukses!' });
    } catch (error) {
        console.error('Gabim gjate refresh token:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const logout = async (req, res) => {
    try {
        await authService.logout(req.cookies.refreshToken);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ sukses: true, mesazhi: 'Logout u krye me sukses!' });
    } catch (error) {
        console.error('Gabim gjate logout:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const logoutAll = async (req, res) => {
    try {
        await authService.logoutAll(req.user.id);
        res.json({ sukses: true, mesazhi: 'Logout nga te gjitha pajisjet u krye me sukses!' });
    } catch (error) {
        console.error('Gabim gjate logout all:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { register, login, refreshAccessToken, logout, logoutAll };