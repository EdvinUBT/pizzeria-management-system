const express = require('express');
const router = express.Router();
const { getProduktet, getProdukti, getProduktetSipasKategorise, krijoProdukt, perditesoProdukt, fshiProdukt, searchProduktet } = require('../controllers/produktetController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateProdukt } = require('../middleware/validateMiddleware');

/**
 * @swagger
 * tags:
 *   name: Produktet
 *   description: Menaxhimi i produkteve (pizza, pije, etj.)
 */

/**
 * @swagger
 * /api/produktet:
 *   get:
 *     summary: Merr te gjitha produktet
 *     tags: [Produktet]
 *     responses:
 *       200:
 *         description: Lista e produkteve
 */
router.get('/', getProduktet);

/**
 * @swagger
 * /api/produktet/search:
 *   get:
 *     summary: Kerkim i avancuar i produkteve
 *     tags: [Produktet]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kerko sipas emrit ose pershkrimit
 *       - in: query
 *         name: kategori_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: cmimi_min
 *         schema:
 *           type: number
 *       - in: query
 *         name: cmimi_max
 *         schema:
 *           type: number
 *       - in: query
 *         name: aktive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [emri, cmimi, data, kategoria]
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Rezultatet e kerkimit
 */
router.get('/search', searchProduktet);

/**
 * @swagger
 * /api/produktet/{id}:
 *   get:
 *     summary: Merr nje produkt sipas ID
 *     tags: [Produktet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e produktit
 *     responses:
 *       200:
 *         description: Te dhenat e produktit
 *       404:
 *         description: Produkti nuk u gjet
 */
router.get('/:id', getProdukti);

/**
 * @swagger
 * /api/produktet/kategoria/{kategoriId}:
 *   get:
 *     summary: Merr produktet sipas kategorise
 *     tags: [Produktet]
 *     parameters:
 *       - in: path
 *         name: kategoriId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e kategorise
 *     responses:
 *       200:
 *         description: Lista e produkteve te kategorise
 */
router.get('/kategoria/:kategoriId', getProduktetSipasKategorise);

/**
 * @swagger
 * /api/produktet:
 *   post:
 *     summary: Krijo nje produkt te ri
 *     tags: [Produktet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kategori_id
 *               - emri_produktit
 *               - cmimi_baze
 *             properties:
 *               kategori_id:
 *                 type: integer
 *                 example: 1
 *               emri_produktit:
 *                 type: string
 *                 example: Pizza Margherita
 *               pershkrimi:
 *                 type: string
 *                 example: Pizza klasike me djath dhe salce domate
 *               cmimi_baze:
 *                 type: number
 *                 example: 6.50
 *               foto_url:
 *                 type: string
 *                 example: https://images.unsplash.com/pizza.jpg
 *               aktive:
 *                 type: boolean
 *                 example: true
 *               koha_pergatitjes_min:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       201:
 *         description: Produkti u krijua me sukses
 *       401:
 *         description: Tokeni mungon
 *       403:
 *         description: Nuk keni qasje
 */
router.post('/', verifyToken, verifyRole('admin', 'menaxher'), validateProdukt, krijoProdukt);

/**
 * @swagger
 * /api/produktet/{id}:
 *   put:
 *     summary: Perditeso nje produkt
 *     tags: [Produktet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               kategori_id:
 *                 type: integer
 *               emri_produktit:
 *                 type: string
 *               pershkrimi:
 *                 type: string
 *               cmimi_baze:
 *                 type: number
 *               foto_url:
 *                 type: string
 *               aktive:
 *                 type: boolean
 *               koha_pergatitjes_min:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produkti u perditesua
 *       404:
 *         description: Produkti nuk u gjet
 */
router.put('/:id', verifyToken, verifyRole('admin', 'menaxher'), validateProdukt, perditesoProdukt);

/**
 * @swagger
 * /api/produktet/{id}:
 *   delete:
 *     summary: Fshi nje produkt
 *     tags: [Produktet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e produktit
 *     responses:
 *       200:
 *         description: Produkti u fshi me sukses
 *       404:
 *         description: Produkti nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiProdukt);

module.exports = router;