const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// GET /api/dashboard - Merr statistikat (vetem admin/menaxher)
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getDashboard);

module.exports = router;