const express = require('express');
const router = express.Router();
const { getKategorite, getKategoria, krijoKategori, perditesoKategori, fshiKategori } = require('../controllers/kategoriteController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateKategori } = require('../middleware/validateMiddleware');

/**
 * @swagger
 * tags:
 *   name: Kategorite
 *   description: Menaxhimi i kategorive te produkteve
 */

/**
 * @swagger
 * /api/kategorite:
 *   get:
 *     summary: Merr te gjitha kategorite
 *     tags: [Kategorite]
 *     responses:
 *       200:
 *         description: Lista e kategorive
 */
router.get('/', getKategorite);

/**
 * @swagger
 * /api/kategorite/{id}:
 *   get:
 *     summary: Merr nje kategori sipas ID
 *     tags: [Kategorite]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e kategorise
 *     responses:
 *       200:
 *         description: Te dhenat e kategorise
 *       404:
 *         description: Kategoria nuk u gjet
 */
router.get('/:id', getKategoria);

/**
 * @swagger
 * /api/kategorite:
 *   post:
 *     summary: Krijo nje kategori te re
 *     tags: [Kategorite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emri_kategorise
 *             properties:
 *               emri_kategorise:
 *                 type: string
 *                 example: Pizza
 *               pershkrimi:
 *                 type: string
 *                 example: Pizzat tona te shijshme
 *               renditja:
 *                 type: integer
 *                 example: 1
 *               aktive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Kategoria u krijua me sukses
 *       401:
 *         description: Tokeni mungon
 *       403:
 *         description: Nuk keni qasje
 */
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), validateKategori, krijoKategori);

/**
 * @swagger
 * /api/kategorite/{id}:
 *   put:
 *     summary: Perditeso nje kategori
 *     tags: [Kategorite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e kategorise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emri_kategorise:
 *                 type: string
 *               pershkrimi:
 *                 type: string
 *               renditja:
 *                 type: integer
 *               aktive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Kategoria u perditesua
 *       404:
 *         description: Kategoria nuk u gjet
 */
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), validateKategori, perditesoKategori);

/**
 * @swagger
 * /api/kategorite/{id}:
 *   delete:
 *     summary: Fshi nje kategori
 *     tags: [Kategorite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e kategorise
 *     responses:
 *       200:
 *         description: Kategoria u fshi me sukses
 *       404:
 *         description: Kategoria nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiKategori);

module.exports = router;