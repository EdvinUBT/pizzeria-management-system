const express = require('express');
const router = express.Router();
const { getTokenatEPerdoruesit, shtoToken, fshiToken, fshiTeGjithaTokenat } = require('../controllers/userTokensController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: UserTokens
 *   description: Menaxhimi i tokenave te perdoruesve
 */

/**
 * @swagger
 * /api/user-tokens/{userId}:
 *   get:
 *     summary: Merr tokenat e nje perdoruesi
 *     tags: [UserTokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perdoruesit
 *     responses:
 *       200:
 *         description: Lista e tokenave te perdoruesit
 */
router.get('/:userId', verifyToken, verifyRole('admin'), getTokenatEPerdoruesit);

/**
 * @swagger
 * /api/user-tokens:
 *   post:
 *     summary: Shto nje token te ri
 *     tags: [UserTokens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - login_provider
 *               - token_name
 *               - token_value
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               login_provider:
 *                 type: string
 *                 example: local
 *               token_name:
 *                 type: string
 *                 example: access_token
 *               token_value:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIs..."
 *     responses:
 *       201:
 *         description: Tokeni u shtua me sukses
 */
router.post('/', verifyToken, verifyRole('admin'), shtoToken);

/**
 * @swagger
 * /api/user-tokens/{id}:
 *   delete:
 *     summary: Fshi nje token
 *     tags: [UserTokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e tokenit
 *     responses:
 *       200:
 *         description: Tokeni u fshi me sukses
 *       404:
 *         description: Tokeni nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiToken);

/**
 * @swagger
 * /api/user-tokens/user/{userId}:
 *   delete:
 *     summary: Fshi te gjitha tokenat e nje perdoruesi
 *     tags: [UserTokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perdoruesit
 *     responses:
 *       200:
 *         description: Te gjitha tokenat u fshin
 */
router.delete('/user/:userId', verifyToken, verifyRole('admin'), fshiTeGjithaTokenat);

module.exports = router;