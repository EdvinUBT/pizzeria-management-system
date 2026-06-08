const notificationsRepository = require('../repositories/notificationsRepository');

const notificationsService = {
    create: async (data) => {
        if (!data.user_id || !data.type || !data.title || !data.message) {
            throw { status: 400, message: 'user_id, type, title dhe message jane te detyrueshme' };
        }
        return await notificationsRepository.create(data);
    },

    getByUserId: async (userId, page, limit) => {
        return await notificationsRepository.getByUserId(userId, page, limit);
    },

    getUnreadCount: async (userId) => {
        return await notificationsRepository.getUnreadCount(userId);
    },

    markAsRead: async (id) => {
        const notification = await notificationsRepository.markAsRead(id);
        if (!notification) throw { status: 404, message: 'Njoftimi nuk u gjet' };
        return notification;
    },

    markAllAsRead: async (userId) => {
        return await notificationsRepository.markAllAsRead(userId);
    },

    deleteById: async (id) => {
        const notification = await notificationsRepository.deleteById(id);
        if (!notification) throw { status: 404, message: 'Njoftimi nuk u gjet' };
        return notification;
    },

    deleteAllByUserId: async (userId) => {
        return await notificationsRepository.deleteAllByUserId(userId);
    }
};

module.exports = notificationsService;