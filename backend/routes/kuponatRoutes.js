const express = require('express');
const router = express.Router();
const { getKuponat, getKuponiMeKod, krijoKupon, perditesoKupon, aplikoKupon, fshiKupon } = require('../controllers/kuponatController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateKupon } = require('../middleware/validateMiddleware');

/**
 * @swagger
 * tags:
 *   name: Kuponat
 *   description: Menaxhimi i kuponave te zbritjes
 */

/**
 * @swagger
 * /api/kuponat:
 *   get:
 *     summary: Merr te gjitha kuponat
 *     tags: [Kuponat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e kuponave
 */
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getKuponat);

/**
 * @swagger
 * /api/kuponat/kodi/{kodi}:
 *   get:
 *     summary: Merr nje kupon sipas kodit
 *     tags: [Kuponat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kodi
 *         required: true
 *         schema:
 *           type: string
 *         description: Kodi i kuponit
 *     responses:
 *       200:
 *         description: Te dhenat e kuponit
 *       404:
 *         description: Kuponi nuk u gjet
 */
router.get('/kodi/:kodi', verifyToken, getKuponiMeKod);

/**
 * @swagger
 * /api/kuponat:
 *   post:
 *     summary: Krijo nje kupon te ri
 *     tags: [Kuponat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kodi
 *               - zbritja_perqind
 *             properties:
 *               kodi:
 *                 type: string
 *                 example: PIZZA20
 *               zbritja_perqind:
 *                 type: number
 *                 example: 20
 *               zbritja_max:
 *                 type: number
 *                 example: 10.00
 *               porosi_min:
 *                 type: number
 *                 example: 15.00
 *               data_fillimit:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-01"
 *               data_skadimit:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *               perdorimet_max:
 *                 type: integer
 *                 example: 100
 *               aktiv:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Kuponi u krijua me sukses
 */
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), validateKupon, krijoKupon);

/**
 * @swagger
 * /api/kuponat/apliko:
 *   post:
 *     summary: Apliko nje kupon ne porosi
 *     tags: [Kuponat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kodi
 *               - totali
 *             properties:
 *               kodi:
 *                 type: string
 *                 example: PIZZA20
 *               totali:
 *                 type: number
 *                 example: 25.00
 *     responses:
 *       200:
 *         description: Kuponi u aplikua, kthen totalin e ri me zbritje
 *       400:
 *         description: Kuponi i pavlefshem ose i skaduar
 */
router.post('/apliko', verifyToken, aplikoKupon);

/**
 * @swagger
 * /api/kuponat/{id}:
 *   put:
 *     summary: Perditeso nje kupon
 *     tags: [Kuponat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e kuponit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kodi:
 *                 type: string
 *               zbritja_perqind:
 *                 type: number
 *               zbritja_max:
 *                 type: number
 *               porosi_min:
 *                 type: number
 *               data_fillimit:
 *                 type: string
 *                 format: date
 *               data_skadimit:
 *                 type: string
 *                 format: date
 *               perdorimet_max:
 *                 type: integer
 *               aktiv:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Kuponi u perditesua
 *       404:
 *         description: Kuponi nuk u gjet
 */
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), validateKupon, perditesoKupon);

/**
 * @swagger
 * /api/kuponat/{id}:
 *   delete:
 *     summary: Fshi nje kupon
 *     tags: [Kuponat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e kuponit
 *     responses:
 *       200:
 *         description: Kuponi u fshi me sukses
 *       404:
 *         description: Kuponi nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiKupon);

module.exports = router;