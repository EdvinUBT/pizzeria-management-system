const express = require('express');
const router = express.Router();
const { getDergesat, getDergesa, krijoDergese, perditesoStatusin, fshiDergese } = require('../controllers/dergesatController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Dergesat
 *   description: Menaxhimi i dergesave
 */

/**
 * @swagger
 * /api/dergesat:
 *   get:
 *     summary: Merr te gjitha dergesat
 *     tags: [Dergesat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e dergesave
 */
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getDergesat);

/**
 * @swagger
 * /api/dergesat/{id}:
 *   get:
 *     summary: Merr nje dergese sipas ID
 *     tags: [Dergesat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e dergeses
 *     responses:
 *       200:
 *         description: Te dhenat e dergeses
 *       404:
 *         description: Dergesa nuk u gjet
 */
router.get('/:id', verifyToken, getDergesa);

/**
 * @swagger
 * /api/dergesat:
 *   post:
 *     summary: Krijo nje dergese te re
 *     tags: [Dergesat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - porosi_id
 *               - punonjes_id
 *               - adresa
 *             properties:
 *               porosi_id:
 *                 type: integer
 *                 example: 1
 *               punonjes_id:
 *                 type: integer
 *                 example: 2
 *               adresa:
 *                 type: string
 *                 example: Prishtine, Rr. Agim Ramadani 50
 *     responses:
 *       201:
 *         description: Dergesa u krijua me sukses
 *       401:
 *         description: Tokeni mungon
 *       403:
 *         description: Nuk keni qasje
 */
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), krijoDergese);

/**
 * @swagger
 * /api/dergesat/{id}/statusi:
 *   put:
 *     summary: Perditeso statusin e dergeses
 *     tags: [Dergesat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e dergeses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statusi
 *             properties:
 *               statusi:
 *                 type: string
 *                 enum: [ne_pritje, nisur, dorezuar, deshtuar]
 *                 example: nisur
 *     responses:
 *       200:
 *         description: Statusi u perditesua
 *       404:
 *         description: Dergesa nuk u gjet
 */
router.put('/:id/statusi', verifyToken, verifyRole('admin', 'menaxher'), perditesoStatusin);

/**
 * @swagger
 * /api/dergesat/{id}:
 *   delete:
 *     summary: Fshi nje dergese
 *     tags: [Dergesat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e dergeses
 *     responses:
 *       200:
 *         description: Dergesa u fshi me sukses
 *       404:
 *         description: Dergesa nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiDergese);

module.exports = router;