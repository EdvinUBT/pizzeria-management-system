const express = require('express');
const router = express.Router();
const { getPerberesit, getPerberesi, krijoPerberes, perditesoPerberes, fshiPerberes } = require('../controllers/perberesitController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Perberesit
 *   description: Menaxhimi i perberesve te produkteve
 */

/**
 * @swagger
 * /api/perberesit:
 *   get:
 *     summary: Merr te gjithe perberesit
 *     tags: [Perberesit]
 *     responses:
 *       200:
 *         description: Lista e perberesve
 */
router.get('/', getPerberesit);

/**
 * @swagger
 * /api/perberesit/{id}:
 *   get:
 *     summary: Merr nje perberes sipas ID
 *     tags: [Perberesit]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perberesit
 *     responses:
 *       200:
 *         description: Te dhenat e perberesit
 *       404:
 *         description: Perberesi nuk u gjet
 */
router.get('/:id', getPerberesi);

/**
 * @swagger
 * /api/perberesit:
 *   post:
 *     summary: Krijo nje perberes te ri
 *     tags: [Perberesit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emri_perberesit
 *               - njesia_matese
 *             properties:
 *               emri_perberesit:
 *                 type: string
 *                 example: Djath Mozzarella
 *               njesia_matese:
 *                 type: string
 *                 example: gr
 *               sasia_stok:
 *                 type: number
 *                 example: 5000
 *               cmimi_shtese:
 *                 type: number
 *                 example: 0.50
 *               alergjene:
 *                 type: string
 *                 example: Qumesht
 *     responses:
 *       201:
 *         description: Perberesi u krijua me sukses
 *       401:
 *         description: Tokeni mungon
 *       403:
 *         description: Nuk keni qasje
 */
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), krijoPerberes);

/**
 * @swagger
 * /api/perberesit/{id}:
 *   put:
 *     summary: Perditeso nje perberes
 *     tags: [Perberesit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perberesit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri_perberesit:
 *                 type: string
 *               njesia_matese:
 *                 type: string
 *               sasia_stok:
 *                 type: number
 *               cmimi_shtese:
 *                 type: number
 *               alergjene:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perberesi u perditesua
 *       404:
 *         description: Perberesi nuk u gjet
 */
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), perditesoPerberes);

/**
 * @swagger
 * /api/perberesit/{id}:
 *   delete:
 *     summary: Fshi nje perberes
 *     tags: [Perberesit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perberesit
 *     responses:
 *       200:
 *         description: Perberesi u fshi me sukses
 *       404:
 *         description: Perberesi nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiPerberes);

module.exports = router;