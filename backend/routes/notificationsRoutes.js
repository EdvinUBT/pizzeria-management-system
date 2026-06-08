const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Menaxhimi i njoftimeve (MongoDB)
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Merr njoftimet e mia
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Lista e njoftimeve
 */
router.get('/', verifyToken, notificationsController.getMyNotifications);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Merr numrin e njoftimeve te palexuara
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Numri i njoftimeve te palexuara
 */
router.get('/unread-count', verifyToken, notificationsController.getUnreadCount);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   put:
 *     summary: Sheno te gjitha njoftimet si te lexuara
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Njoftimet u shenuan si te lexuara
 */
router.put('/mark-all-read', verifyToken, notificationsController.markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Sheno nje njoftim si te lexuar
 *     tags: [Notifications]
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
 *         description: Njoftimi u shenua si i lexuar
 */
router.put('/:id/read', verifyToken, notificationsController.markAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Fshi nje njoftim
 *     tags: [Notifications]
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
 *         description: Njoftimi u fshi
 */
router.delete('/:id', verifyToken, notificationsController.deleteNotification);

/**
 * @swagger
 * /api/notifications:
 *   delete:
 *     summary: Fshi te gjitha njoftimet
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Te gjitha njoftimet u fshin
 */
router.delete('/', verifyToken, notificationsController.deleteAll);

module.exports = router;