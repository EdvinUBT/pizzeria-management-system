const express = require('express');
const router = express.Router();
const { getVleresimet, getVleresimetEPorosise, krijoVleresim, perditesoVleresim, fshiVleresim } = require('../controllers/vleresimetController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateVleresim } = require('../middleware/validateMiddleware');

/**
 * @swagger
 * tags:
 *   name: Vleresimet
 *   description: Menaxhimi i vleresimeve te klienteve
 */

/**
 * @swagger
 * /api/vleresimet:
 *   get:
 *     summary: Merr te gjitha vleresimet
 *     tags: [Vleresimet]
 *     responses:
 *       200:
 *         description: Lista e vleresimeve
 */
router.get('/', getVleresimet);

/**
 * @swagger
 * /api/vleresimet/porosi/{porosiId}:
 *   get:
 *     summary: Merr vleresimin e nje porosie
 *     tags: [Vleresimet]
 *     parameters:
 *       - in: path
 *         name: porosiId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e porosise
 *     responses:
 *       200:
 *         description: Vleresimi i porosise
 *       404:
 *         description: Vleresimi nuk u gjet
 */
router.get('/porosi/:porosiId', getVleresimetEPorosise);

/**
 * @swagger
 * /api/vleresimet:
 *   post:
 *     summary: Krijo nje vleresim te ri
 *     tags: [Vleresimet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - klient_id
 *               - porosi_id
 *               - yjet
 *             properties:
 *               klient_id:
 *                 type: integer
 *                 example: 1
 *               porosi_id:
 *                 type: integer
 *                 example: 1
 *               yjet:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               komenti:
 *                 type: string
 *                 example: Pizza shume e mire, do e porosis perseri!
 *     responses:
 *       201:
 *         description: Vleresimi u krijua me sukses
 *       400:
 *         description: Validimi deshtoi
 */
router.post('/', verifyToken, validateVleresim, krijoVleresim);

/**
 * @swagger
 * /api/vleresimet/{id}:
 *   put:
 *     summary: Perditeso nje vleresim
 *     tags: [Vleresimet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e vleresimit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               yjet:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               komenti:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vleresimi u perditesua
 *       404:
 *         description: Vleresimi nuk u gjet
 */
router.put('/:id', verifyToken, perditesoVleresim);

/**
 * @swagger
 * /api/vleresimet/{id}:
 *   delete:
 *     summary: Fshi nje vleresim
 *     tags: [Vleresimet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e vleresimit
 *     responses:
 *       200:
 *         description: Vleresimi u fshi me sukses
 *       404:
 *         description: Vleresimi nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiVleresim);

module.exports = router;