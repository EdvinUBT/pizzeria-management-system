const express = require('express');
const router = express.Router();
const { getPerberesitEProduktit, shtoPerberesNeProdukt, perditesoPerberesNeProdukt, hiqPerberesNgaProdukti } = require('../controllers/produktPerberesitController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: ProduktPerberesit
 *   description: Lidhja ndermjet produkteve dhe perberesve
 */

/**
 * @swagger
 * /api/produkt-perberesit/{produktId}:
 *   get:
 *     summary: Merr perberesit e nje produkti
 *     tags: [ProduktPerberesit]
 *     parameters:
 *       - in: path
 *         name: produktId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e produktit
 *     responses:
 *       200:
 *         description: Lista e perberesve te produktit
 */
router.get('/:produktId', getPerberesitEProduktit);

/**
 * @swagger
 * /api/produkt-perberesit/{produktId}:
 *   post:
 *     summary: Shto nje perberes ne produkt
 *     tags: [ProduktPerberesit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produktId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e produktit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - perberes_id
 *             properties:
 *               perberes_id:
 *                 type: integer
 *                 example: 1
 *               sasia_standarde:
 *                 type: number
 *                 example: 100
 *               eshte_opsionale:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Perberesi u shtua ne produkt
 *       401:
 *         description: Tokeni mungon
 *       403:
 *         description: Nuk keni qasje
 */
router.post('/:produktId', verifyToken, verifyRole('admin', 'menaxher'), shtoPerberesNeProdukt);

/**
 * @swagger
 * /api/produkt-perberesit/{id}:
 *   put:
 *     summary: Perditeso sasine e perberesit ne produkt
 *     tags: [ProduktPerberesit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e lidhjes produkt-perberes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sasia_standarde:
 *                 type: number
 *               eshte_opsionale:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Lidhja u perditesua
 *       404:
 *         description: Lidhja nuk u gjet
 */
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), perditesoPerberesNeProdukt);

/**
 * @swagger
 * /api/produkt-perberesit/{produktId}/{perberesId}:
 *   delete:
 *     summary: Hiq nje perberes nga produkti
 *     tags: [ProduktPerberesit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produktId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e produktit
 *       - in: path
 *         name: perberesId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perberesit
 *     responses:
 *       200:
 *         description: Perberesi u hoq nga produkti
 *       404:
 *         description: Lidhja nuk u gjet
 */
router.delete('/:produktId/:perberesId', verifyToken, verifyRole('admin', 'menaxher'), hiqPerberesNgaProdukti);

module.exports = router;