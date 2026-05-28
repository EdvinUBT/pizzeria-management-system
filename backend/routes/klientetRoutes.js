const express = require('express');
const router = express.Router();
const { getKlientet, getKlienti, krijoKlient, perditesoKlient, fshiKlient } = require('../controllers/klientetController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateKlient } = require('../middleware/validateMiddleware');

/**
 * @swagger
 * tags:
 *   name: Klientet
 *   description: Menaxhimi i klienteve
 */

/**
 * @swagger
 * /api/klientet:
 *   get:
 *     summary: Merr te gjithe klientet
 *     tags: [Klientet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e klienteve
 *       401:
 *         description: Tokeni mungon
 *       403:
 *         description: Nuk keni qasje
 */
router.get('/', verifyToken, verifyRole('admin', 'menaxher'), getKlientet);

/**
 * @swagger
 * /api/klientet/{id}:
 *   get:
 *     summary: Merr nje klient sipas ID
 *     tags: [Klientet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e klientit
 *     responses:
 *       200:
 *         description: Te dhenat e klientit
 *       404:
 *         description: Klienti nuk u gjet
 */
router.get('/:id', verifyToken, getKlienti);

/**
 * @swagger
 * /api/klientet:
 *   post:
 *     summary: Krijo nje klient te ri
 *     tags: [Klientet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emri
 *               - mbiemri
 *               - email
 *             properties:
 *               emri:
 *                 type: string
 *                 example: Arta
 *               mbiemri:
 *                 type: string
 *                 example: Fisteku
 *               email:
 *                 type: string
 *                 example: arta@email.com
 *               telefoni:
 *                 type: string
 *                 example: "044123456"
 *               adresa:
 *                 type: string
 *                 example: Prishtine, Rr. Agim Ramadani
 *               fjalekalimi_hash:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Klienti u krijua me sukses
 *       400:
 *         description: Validimi deshtoi
 */
router.post('/', validateKlient, krijoKlient);

/**
 * @swagger
 * /api/klientet/{id}:
 *   put:
 *     summary: Perditeso nje klient
 *     tags: [Klientet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e klientit
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
 *               email:
 *                 type: string
 *               telefoni:
 *                 type: string
 *               adresa:
 *                 type: string
 *     responses:
 *       200:
 *         description: Klienti u perditesua
 *       404:
 *         description: Klienti nuk u gjet
 */
router.put('/:id', verifyToken, perditesoKlient);

/**
 * @swagger
 * /api/klientet/{id}:
 *   delete:
 *     summary: Fshi nje klient
 *     tags: [Klientet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e klientit
 *     responses:
 *       200:
 *         description: Klienti u fshi me sukses
 *       404:
 *         description: Klienti nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiKlient);

module.exports = router;