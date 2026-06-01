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
//pshb ti e ki kur hin me url prej server e ki me u qase ne dashboard duhet /api/dashboard/
//edhe ky vjen thote kur eshte api/dashboard dhe qeky / thote verifikoj tokenat mandej verifikoja rolin e mandej shko merri senet
//po para se mu bo qeto sene tokenat jon rujt prej kur bon login 
//a e lexove qeta dhe a e u kuptove jo bash mire cka kem me ba kur tna vet qishtu a vec me ardhe me ja tregu qito sene?
module.exports = router;