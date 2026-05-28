const express = require('express');
const router = express.Router();
const { getAdresatEKlientit, shtoAdrese, perditesoAdrese, fshiAdrese } = require('../controllers/adresatController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Adresat
 *   description: Menaxhimi i adresave te klienteve
 */

/**
 * @swagger
 * /api/adresat/{klientId}:
 *   get:
 *     summary: Merr adresat e nje klienti
 *     tags: [Adresat]
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
 *         description: Lista e adresave te klientit
 */
router.get('/:klientId', verifyToken, getAdresatEKlientit);

/**
 * @swagger
 * /api/adresat:
 *   post:
 *     summary: Shto nje adrese te re
 *     tags: [Adresat]
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
 *               - adresa
 *               - qyteti
 *             properties:
 *               klient_id:
 *                 type: integer
 *                 example: 1
 *               emertimi:
 *                 type: string
 *                 example: Shtepia
 *               adresa:
 *                 type: string
 *                 example: Rr. Agim Ramadani 50
 *               qyteti:
 *                 type: string
 *                 example: Prishtine
 *               kodi_postar:
 *                 type: string
 *                 example: "10000"
 *               eshte_default:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Adresa u shtua me sukses
 */
router.post('/', verifyToken, shtoAdrese);

/**
 * @swagger
 * /api/adresat/{id}:
 *   put:
 *     summary: Perditeso nje adrese
 *     tags: [Adresat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e adreses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emertimi:
 *                 type: string
 *               adresa:
 *                 type: string
 *               qyteti:
 *                 type: string
 *               kodi_postar:
 *                 type: string
 *               eshte_default:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Adresa u perditesua
 *       404:
 *         description: Adresa nuk u gjet
 */
router.put('/:id', verifyToken, perditesoAdrese);

/**
 * @swagger
 * /api/adresat/{id}:
 *   delete:
 *     summary: Fshi nje adrese
 *     tags: [Adresat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e adreses
 *     responses:
 *       200:
 *         description: Adresa u fshi me sukses
 *       404:
 *         description: Adresa nuk u gjet
 */
router.delete('/:id', verifyToken, fshiAdrese);

module.exports = router;