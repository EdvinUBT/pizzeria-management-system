const express = require('express');
const router = express.Router();
const { getFullReport, exportReport } = require('../controllers/reportsController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Raporte dinamike
 */

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Merr raportin e plote
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: data_nga
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: data_deri
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Raporti i plote
 */
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getFullReport);

/**
 * @swagger
 * /api/reports/export:
 *   get:
 *     summary: Eksporto raportin
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: data_nga
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: data_deri
 *         schema:
 *           type: string
 *           format: date
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
router.get('/export', verifyToken, verifyRole('admin', 'menaxher'), exportReport);

module.exports = router;