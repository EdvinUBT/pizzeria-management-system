const express = require('express');
const router = express.Router();
const { exportData, importData } = require('../controllers/exportImportController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Export/Import
 *   description: Eksportimi dhe importimi i te dhenave
 */

/**
 * @swagger
 * /api/export/{entity}:
 *   get:
 *     summary: Eksporto te dhenat
 *     tags: [Export/Import]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *           enum: [produktet, porosite, klientet, punonjesit, kuponat]
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [json, csv, excel]
 *     responses:
 *       200:
 *         description: Fajlli i eksportuar
 */
router.get('/export/:entity', verifyToken, verifyRole('admin', 'menaxher'), exportData);

/**
 * @swagger
 * /api/import/{entity}:
 *   post:
 *     summary: Importo te dhena
 *     tags: [Export/Import]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *           enum: [produktet, porosite, klientet, punonjesit, kuponat]
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [json, csv, excel]
 *     responses:
 *       200:
 *         description: Te dhenat u importuan
 */
router.post('/import/:entity', verifyToken, verifyRole('admin'), importData);

module.exports = router;