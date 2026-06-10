const dashboardService = require('../services/dashboardService');

const getDashboard = async (req, res) => {
    try {
        const te_dhena = await dashboardService.getDashboard();
        res.json({ sukses: true, te_dhena });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(error.status || 500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getDashboard };