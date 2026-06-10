const notificationsService = require('../services/notificationsService');
const db = require('../config/db');

const sendNotification = async (req, userId, notificationData) => {
    try {
        const notification = await notificationsService.create({
            user_id: userId,
            type: notificationData.type,
            title: notificationData.title,
            message: notificationData.message
        });

        const io = req.app.get('io');
        io.to(`user_${userId}`).emit('notification', notification);

        return notification;
    } catch (error) {
        console.error('Gabim ne dergimin e njoftimit:', error.message);
    }
};

// Konverton klient_id ne user_id dhe dergon njoftim
const sendNotificationToKlient = async (req, klientId, notificationData) => {
    try {
        const [rows] = await db.query(
            'SELECT u.id FROM users u JOIN klientet k ON u.email = k.email WHERE k.klient_id = ?',
            [klientId]
        );

        if (rows.length > 0) {
            return await sendNotification(req, rows[0].id, notificationData);
        }
    } catch (error) {
        console.error('Gabim ne dergimin e njoftimit te klientit:', error.message);
    }
};

module.exports = { sendNotification, sendNotificationToKlient };