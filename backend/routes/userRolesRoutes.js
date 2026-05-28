const express = require('express');
const router = express.Router();
const { getRoletEPerdoruesit, caktoRol, hiqRol } = require('../controllers/userRolesController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: UserRoles
 *   description: Caktimi dhe heqja e roleve per perdoruesit
 */

/**
 * @swagger
 * /api/user-roles/{userId}:
 *   get:
 *     summary: Merr rolet e nje perdoruesi
 *     tags: [UserRoles]
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
 *         description: Lista e roleve te perdoruesit
 */
router.get('/:userId', verifyToken, verifyRole('admin'), getRoletEPerdoruesit);

/**
 * @swagger
 * /api/user-roles:
 *   post:
 *     summary: Cakto nje rol per nje perdorues
 *     tags: [UserRoles]
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
 *               - role_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               role_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Roli u caktua me sukses
 *       400:
 *         description: Perdoruesi e ka tashme kete rol
 */
router.post('/', verifyToken, verifyRole('admin'), caktoRol);

/**
 * @swagger
 * /api/user-roles/{userId}/{roleId}:
 *   delete:
 *     summary: Hiq nje rol nga perdoruesi
 *     tags: [UserRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e perdoruesit
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID e rolit
 *     responses:
 *       200:
 *         description: Roli u hoq me sukses
 *       404:
 *         description: Lidhja nuk u gjet
 */
router.delete('/:userId/:roleId', verifyToken, verifyRole('admin'), hiqRol);

module.exports = router;