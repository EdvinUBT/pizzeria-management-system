const express = require('express');
const router = express.Router();
const { getPorosite, getPorosia, getPorositeEKlientit, krijoPorosi, perditesoStatusin, anuloPorosi, fshiPorosi } = require('../controllers/porositeController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validatePorosi } = require('../middleware/validateMiddleware');

/**
 * @swagger
 * tags:
 *   name: Porosite
 *   description: Menaxhimi i porosive
 */

/**
 * @swagger
 * /api/porosite:
 *   get:
 *     summary: Merr te gjitha porosite
 *     tags: [Porosite]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e porosive
 *       401:
 *         description: Tokeni mungon
 *       403:
 *         description: Nuk keni qasje
 */
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getPorosite);

/**
 * @swagger
 * /api/porosite/{id}:
 *   get:
 *     summary: Merr nje porosi sipas ID me detajet e saj
 *     tags: [Porosite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e porosise
 *     responses:
 *       200:
 *         description: Te dhenat e porosise me detaje
 *       404:
 *         description: Porosia nuk u gjet
 */
router.get('/:id', verifyToken, getPorosia);

/**
 * @swagger
 * /api/porosite/klienti/{klientId}:
 *   get:
 *     summary: Merr porosite e nje klienti
 *     tags: [Porosite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: klientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e klientit
 *     responses:
 *       200:
 *         description: Lista e porosive te klientit
 */
router.get('/klienti/:klientId', verifyToken, getPorositeEKlientit);

/**
 * @swagger
 * /api/porosite:
 *   post:
 *     summary: Krijo nje porosi te re me detaje
 *     tags: [Porosite]
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
 *               - metoda_pageses
 *               - adresa_dergeses
 *               - detajet
 *             properties:
 *               klient_id:
 *                 type: integer
 *                 example: 1
 *               metoda_pageses:
 *                 type: string
 *                 enum: [cash, karte, online]
 *                 example: cash
 *               adresa_dergeses:
 *                 type: string
 *                 example: Prishtine, Rr. Agim Ramadani 50
 *               shenimet:
 *                 type: string
 *                 example: Pa qepe ju lutem
 *               detajet:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - produkt_id
 *                     - sasia
 *                   properties:
 *                     produkt_id:
 *                       type: integer
 *                       example: 1
 *                     sasia:
 *                       type: integer
 *                       example: 2
 *                     personalizimi:
 *                       type: string
 *                       example: Djath ekstra
 *     responses:
 *       201:
 *         description: Porosia u krijua me sukses
 *       400:
 *         description: Validimi deshtoi
 */
router.post('/', verifyToken, validatePorosi, krijoPorosi);

/**
 * @swagger
 * /api/porosite/{id}/statusi:
 *   put:
 *     summary: Perditeso statusin e porosise
 *     tags: [Porosite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e porosise
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
 *                 enum: [ne_pritje, ne_pergatitje, gati, ne_dergim, dorezuar, anuluar]
 *                 example: ne_pergatitje
 *     responses:
 *       200:
 *         description: Statusi u perditesua
 *       404:
 *         description: Porosia nuk u gjet
 */
router.put('/:id/statusi', verifyToken, verifyRole('admin', 'menaxher'), perditesoStatusin);

/**
 * @swagger
 * /api/porosite/{id}/anulo:
 *   put:
 *     summary: Anulo nje porosi
 *     tags: [Porosite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e porosise
 *     responses:
 *       200:
 *         description: Porosia u anulua
 *       404:
 *         description: Porosia nuk u gjet
 */
router.put('/:id/anulo', verifyToken, anuloPorosi);

/**
 * @swagger
 * /api/porosite/{id}:
 *   delete:
 *     summary: Fshi nje porosi
 *     tags: [Porosite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e porosise
 *     responses:
 *       200:
 *         description: Porosia u fshi me sukses
 *       404:
 *         description: Porosia nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiPorosi);

module.exports = router;