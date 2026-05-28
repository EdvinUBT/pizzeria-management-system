const express = require('express');
const router = express.Router();
const { getUsers, getUser, krijoUser, perditesoUser, ndryshStatusin, fshiUser } = require('../controllers/usersController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Menaxhimi administrativ i perdoruesve
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Merr te gjithe perdoruesit
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e perdoruesve
 *       403:
 *         description: Vetem admin ka qasje
 */
router.get('/', verifyToken, verifyRole('admin'), getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Merr nje perdorues sipas ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perdoruesit
 *     responses:
 *       200:
 *         description: Te dhenat e perdoruesit
 *       404:
 *         description: Perdoruesi nuk u gjet
 */
router.get('/:id', verifyToken, verifyRole('admin'), getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Krijo nje perdorues te ri
 *     tags: [Users]
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
 *               - email
 *               - password
 *             properties:
 *               emri:
 *                 type: string
 *                 example: Filan
 *               mbiemri:
 *                 type: string
 *                 example: Fisteku
 *               email:
 *                 type: string
 *                 example: filan@test.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *               phone_number:
 *                 type: string
 *                 example: "044123456"
 *     responses:
 *       201:
 *         description: Perdoruesi u krijua me sukses
 *       400:
 *         description: Email ekziston
 */
router.post('/', verifyToken, verifyRole('admin'), krijoUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Perditeso nje perdorues
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perdoruesit
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
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perdoruesi u perditesua
 *       404:
 *         description: Perdoruesi nuk u gjet
 */
router.put('/:id', verifyToken, verifyRole('admin'), perditesoUser);

/**
 * @swagger
 * /api/users/{id}/statusi:
 *   put:
 *     summary: Aktivizo ose deaktivizo nje perdorues
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perdoruesit
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
 *                 enum: [aktiv, joaktiv, bllokuar]
 *                 example: aktiv
 *     responses:
 *       200:
 *         description: Statusi u ndryshua
 *       404:
 *         description: Perdoruesi nuk u gjet
 */
router.put('/:id/statusi', verifyToken, verifyRole('admin'), ndryshStatusin);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Fshi nje perdorues
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perdoruesit
 *     responses:
 *       200:
 *         description: Perdoruesi u fshi me sukses
 *       404:
 *         description: Perdoruesi nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiUser);

module.exports = router;