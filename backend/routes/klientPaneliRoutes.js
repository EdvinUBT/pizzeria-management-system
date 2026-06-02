const express = require('express');
const router = express.Router();
const {
    getProfilin,
    perditesoProfilin,
    getPorositeEMia,
    getDetajetEPorosise,
    krijoPorosi,
    anuloPorosi,
    krijoVleresim,
    getMenyteAktive,
    verifikoKupon,
    getVleresimetProdukteve
} = require('../controllers/klientPaneliController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: KlientPaneli
 *   description: Paneli i klientit - porosi, profili, vleresime
 */

/**
 * @swagger
 * /api/klient-paneli/menyte:
 *   get:
 *     summary: Merr menyte aktive me produktet
 *     tags: [KlientPaneli]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e menyve aktive
 */
router.get('/menyte', verifyToken, getMenyteAktive);
router.get('/vleresimet-produkteve', verifyToken, getVleresimetProdukteve);

/**
 * @swagger
 * /api/klient-paneli/verifikoKupon:
 *   post:
 *     summary: Verifiko nje kupon pa e aplikuar
 *     tags: [KlientPaneli]
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
 *         description: Kuponi eshte i vlefshem
 *       400:
 *         description: Kuponi i pavlefshem
 */
router.post('/verifikoKupon', verifyToken, verifikoKupon);

/**
 * @swagger
 * /api/klient-paneli/{klientId}/profili:
 *   get:
 *     summary: Merr profilin e klientit
 *     tags: [KlientPaneli]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: klientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Te dhenat e profilit
 */
router.get('/:klientId/profili', verifyToken, getProfilin);

/**
 * @swagger
 * /api/klient-paneli/{klientId}/profili:
 *   put:
 *     summary: Perditeso profilin
 *     tags: [KlientPaneli]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: klientId
 *         required: true
 *         schema:
 *           type: integer
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
 *               telefoni:
 *                 type: string
 *               adresa:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profili u perditesua
 */
router.put('/:klientId/profili', verifyToken, perditesoProfilin);

/**
 * @swagger
 * /api/klient-paneli/{klientId}/porosite:
 *   get:
 *     summary: Merr porosite e klientit
 *     tags: [KlientPaneli]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: klientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista e porosive
 */
router.get('/:klientId/porosite', verifyToken, getPorositeEMia);

/**
 * @swagger
 * /api/klient-paneli/{klientId}/porosite:
 *   post:
 *     summary: Krijo porosi te re
 *     tags: [KlientPaneli]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: klientId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adresa_dergeses
 *               - detajet
 *             properties:
 *               metoda_pageses:
 *                 type: string
 *                 enum: [cash, karte, online]
 *               adresa_dergeses:
 *                 type: string
 *               shenimet:
 *                 type: string
 *               kupon_kodi:
 *                 type: string
 *               detajet:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produkt_id:
 *                       type: integer
 *                     sasia:
 *                       type: integer
 *                     personalizimi:
 *                       type: string
 *     responses:
 *       201:
 *         description: Porosia u krijua
 */
router.post('/:klientId/porosite', verifyToken, krijoPorosi);

/**
 * @swagger
 * /api/klient-paneli/{klientId}/porosite/{porosiId}:
 *   get:
 *     summary: Merr detajet e nje porosie me tracking
 *     tags: [KlientPaneli]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: klientId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: porosiId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detajet e porosise me tracking info
 */
router.get('/:klientId/porosite/:porosiId', verifyToken, getDetajetEPorosise);

/**
 * @swagger
 * /api/klient-paneli/{klientId}/porosite/{porosiId}/anulo:
 *   put:
 *     summary: Anulo nje porosi (vetem nese ne_pritje)
 *     tags: [KlientPaneli]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: klientId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: porosiId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Porosia u anulua
 */
router.put('/:klientId/porosite/:porosiId/anulo', verifyToken, anuloPorosi);

/**
 * @swagger
 * /api/klient-paneli/{klientId}/porosite/{porosiId}/vleresim:
 *   post:
 *     summary: Ler nje vleresim per porosine
 *     tags: [KlientPaneli]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: klientId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: porosiId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - yjet
 *             properties:
 *               yjet:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               komenti:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vleresimi u krijua
 */
router.post('/:klientId/porosite/:porosiId/vleresim', verifyToken, krijoVleresim);

module.exports = router;