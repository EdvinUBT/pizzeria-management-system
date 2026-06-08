const notificationsService = require('../services/notificationsService');

const notificationsController = {
    getMyNotifications: async (req, res) => {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 20 } = req.query;
            const result = await notificationsService.getByUserId(userId, parseInt(page), parseInt(limit));
            res.json({ sukses: true, ...result });
        } catch (error) {
            res.status(error.status || 500).json({ sukses: false, mesazhi: error.message });
        }
    },

    getUnreadCount: async (req, res) => {
        try {
            const count = await notificationsService.getUnreadCount(req.user.id);
            res.json({ sukses: true, count });
        } catch (error) {
            res.status(error.status || 500).json({ sukses: false, mesazhi: error.message });
        }
    },

    markAsRead: async (req, res) => {
        try {
            const notification = await notificationsService.markAsRead(req.params.id);
            res.json({ sukses: true, notification });
        } catch (error) {
            res.status(error.status || 500).json({ sukses: false, mesazhi: error.message });
        }
    },

    markAllAsRead: async (req, res) => {
        try {
            await notificationsService.markAllAsRead(req.user.id);
            res.json({ sukses: true, mesazhi: 'Te gjitha njoftimet u shenuan si te lexuara' });
        } catch (error) {
            res.status(error.status || 500).json({ sukses: false, mesazhi: error.message });
        }
    },

    deleteNotification: async (req, res) => {
        try {
            await notificationsService.deleteById(req.params.id);
            res.json({ sukses: true, mesazhi: 'Njoftimi u fshi me sukses' });
        } catch (error) {
            res.status(error.status || 500).json({ sukses: false, mesazhi: error.message });
        }
    },

    deleteAll: async (req, res) => {
        try {
            await notificationsService.deleteAllByUserId(req.user.id);
            res.json({ sukses: true, mesazhi: 'Te gjitha njoftimet u fshin' });
        } catch (error) {
            res.status(error.status || 500).json({ sukses: false, mesazhi: error.message });
        }
    }
};

module.exports = notificationsController;