const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Statistikat e sistemit
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Merr statistikat e sistemit (shitjet, porosite, top produktet)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistikat e picerise
 *       401:
 *         description: Tokeni mungon
 *       403:
 *         description: Vetem admin/menaxher ka qasje
 */
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getDashboard);

module.exports = router;