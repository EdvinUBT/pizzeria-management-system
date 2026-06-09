const express = require('express');
const router = express.Router();
const { getPunonjesit, getPunonjesi, krijoPunonjes, perditesoPunonjes, fshiPunonjes, searchPunonjesit } = require('../controllers/punonjesitController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validatePunonjes } = require('../middleware/validateMiddleware');

/**
 * @swagger
 * tags:
 *   name: Punonjesit
 *   description: Menaxhimi i punonjesve
 */

/**
 * @swagger
 * /api/punonjesit:
 *   get:
 *     summary: Merr te gjithe punonjesit
 *     tags: [Punonjesit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e punonjesve
 */
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getPunonjesit);

/**
 * @swagger
 * /api/punonjesit/search:
 *   get:
 *     summary: Kerkim i avancuar i punonjesve
 *     tags: [Punonjesit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: roli
 *         schema:
 *           type: string
 *       - in: query
 *         name: aktiv
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [emri, mbiemri, roli, email]
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Rezultatet e kerkimit
 */
router.get('/search', verifyToken, verifyRole('admin', 'menaxher'), searchPunonjesit);

/**
 * @swagger
 * /api/punonjesit/{id}:
 *   get:
 *     summary: Merr nje punonjes sipas ID
 *     tags: [Punonjesit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e punonjesit
 *     responses:
 *       200:
 *         description: Te dhenat e punonjesit
 *       404:
 *         description: Punonjesi nuk u gjet
 */
router.get('/:id', verifyToken, verifyRole('admin', 'menaxher'), getPunonjesi);

/**
 * @swagger
 * /api/punonjesit:
 *   post:
 *     summary: Krijo nje punonjes te ri
 *     tags: [Punonjesit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emri
 *               - mbiemri
 *               - roli
 *             properties:
 *               emri:
 *                 type: string
 *                 example: Arben
 *               mbiemri:
 *                 type: string
 *                 example: Krasniqi
 *               roli:
 *                 type: string
 *                 enum: [kuzhinier, shofer, kamarier, menaxher]
 *                 example: kuzhinier
 *               telefoni:
 *                 type: string
 *                 example: "045123456"
 *               email:
 *                 type: string
 *                 example: arben@piceria.com
 *               aktiv:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Punonjesi u krijua me sukses
 *       401:
 *         description: Tokeni mungon
 *       403:
 *         description: Nuk keni qasje
 */
router.post('/', verifyToken, verifyRole('admin'), validatePunonjes, krijoPunonjes);

/**
 * @swagger
 * /api/punonjesit/{id}:
 *   put:
 *     summary: Perditeso nje punonjes
 *     tags: [Punonjesit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e punonjesit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri:
 *                 type: string
 *               mbiemri:
 *                 type: string
 *               roli:
 *                 type: string
 *                 enum: [kuzhinier, shofer, kamarier, menaxher]
 *               telefoni:
 *                 type: string
 *               email:
 *                 type: string
 *               aktiv:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Punonjesi u perditesua
 *       404:
 *         description: Punonjesi nuk u gjet
 */
router.put('/:id', verifyToken, verifyRole('admin'), validatePunonjes, perditesoPunonjes);

/**
 * @swagger
 * /api/punonjesit/{id}:
 *   delete:
 *     summary: Fshi nje punonjes
 *     tags: [Punonjesit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e punonjesit
 *     responses:
 *       200:
 *         description: Punonjesi u fshi me sukses
 *       404:
 *         description: Punonjesi nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiPunonjes);

module.exports = router;