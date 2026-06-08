const express = require('express');
const router = express.Router();
const auditLogsController = require('../controllers/auditLogsController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: AuditLogs
 *   description: Menaxhimi i audit logs (MongoDB)
 */

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: Merr te gjitha audit logs me filtra
 *     tags: [AuditLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista e audit logs
 */
router.get('/', verifyToken, verifyRole('admin'), auditLogsController.getAll);

/**
 * @swagger
 * /api/audit-logs/{id}:
 *   get:
 *     summary: Merr nje audit log sipas ID
 *     tags: [AuditLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audit log i gjetur
 */
router.get('/:id', verifyToken, verifyRole('admin'), auditLogsController.getById);

/**
 * @swagger
 * /api/audit-logs/entity/{entity}/{entityId}:
 *   get:
 *     summary: Merr audit logs sipas entitetit
 *     tags: [AuditLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Audit logs per entitetin
 */
router.get('/entity/:entity/:entityId', verifyToken, verifyRole('admin'), auditLogsController.getByEntity);

/**
 * @swagger
 * /api/audit-logs/user/{userId}:
 *   get:
 *     summary: Merr audit logs sipas perdoruesit
 *     tags: [AuditLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Audit logs per perdoruesin
 */
router.get('/user/:userId', verifyToken, verifyRole('admin'), auditLogsController.getByUserId);

module.exports = router;