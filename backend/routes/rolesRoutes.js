const express = require('express');
const router = express.Router();
const { getRoles, getRole, krijoRole, perditesoRole, fshiRole } = require('../controllers/rolesController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Menaxhimi i roleve te sistemit
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Merr te gjitha rolet
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e roleve
 */
router.get('/', verifyToken, verifyRole('admin'), getRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Merr nje rol sipas ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e rolit
 *     responses:
 *       200:
 *         description: Te dhenat e rolit
 *       404:
 *         description: Roli nuk u gjet
 */
router.get('/:id', verifyToken, verifyRole('admin'), getRole);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Krijo nje rol te ri
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emertimi
 *             properties:
 *               emertimi:
 *                 type: string
 *                 example: menaxher
 *               pershkrimi:
 *                 type: string
 *                 example: Menaxhon operacionet e picerise
 *     responses:
 *       201:
 *         description: Roli u krijua me sukses
 *       400:
 *         description: Roli ekziston
 */
router.post('/', verifyToken, verifyRole('admin'), krijoRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Perditeso nje rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e rolit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emertimi:
 *                 type: string
 *               pershkrimi:
 *                 type: string
 *     responses:
 *       200:
 *         description: Roli u perditesua
 *       404:
 *         description: Roli nuk u gjet
 */
router.put('/:id', verifyToken, verifyRole('admin'), perditesoRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Fshi nje rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e rolit
 *     responses:
 *       200:
 *         description: Roli u fshi me sukses
 *       404:
 *         description: Roli nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiRole);

module.exports = router;