const express = require('express');
const router = express.Router();
const { getClaimsEPerdoruesit, shtoClaim, perditesoClaim, fshiClaim } = require('../controllers/userClaimsController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: UserClaims
 *   description: Menaxhimi i claims te perdoruesve
 */

/**
 * @swagger
 * /api/user-claims/{userId}:
 *   get:
 *     summary: Merr claims e nje perdoruesi
 *     tags: [UserClaims]
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
 *         description: Lista e claims te perdoruesit
 */
router.get('/:userId', verifyToken, verifyRole('admin'), getClaimsEPerdoruesit);

/**
 * @swagger
 * /api/user-claims:
 *   post:
 *     summary: Shto nje claim te ri
 *     tags: [UserClaims]
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
 *               - claim_type
 *               - claim_value
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               claim_type:
 *                 type: string
 *                 example: permission
 *               claim_value:
 *                 type: string
 *                 example: manage_orders
 *     responses:
 *       201:
 *         description: Claim u shtua me sukses
 */
router.post('/', verifyToken, verifyRole('admin'), shtoClaim);

/**
 * @swagger
 * /api/user-claims/{id}:
 *   put:
 *     summary: Perditeso nje claim
 *     tags: [UserClaims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e claim-it
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               claim_type:
 *                 type: string
 *               claim_value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Claim u perditesua
 *       404:
 *         description: Claim nuk u gjet
 */
router.put('/:id', verifyToken, verifyRole('admin'), perditesoClaim);

/**
 * @swagger
 * /api/user-claims/{id}:
 *   delete:
 *     summary: Fshi nje claim
 *     tags: [UserClaims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e claim-it
 *     responses:
 *       200:
 *         description: Claim u fshi me sukses
 *       404:
 *         description: Claim nuk u gjet
 */
router.delete('/:id', verifyToken, verifyRole('admin'), fshiClaim);

module.exports = router;