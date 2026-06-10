const notificationsService = require('../services/notificationsService');

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

module.exports = { sendNotification };