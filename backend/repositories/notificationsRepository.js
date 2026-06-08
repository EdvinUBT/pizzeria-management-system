const Notification = require('../models/mongodb/Notification');

const notificationsRepository = {
    create: async (data) => {
        const notification = new Notification(data);
        return await notification.save();
    },

    getByUserId: async (userId, page = 1, limit = 20) => {
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            Notification.find({ user_id: userId }).sort({ created_at: -1 }).skip(skip).limit(limit),
            Notification.countDocuments({ user_id: userId })
        ]);

        return { notifications, total, page, limit };
    },

    getUnreadCount: async (userId) => {
        return await Notification.countDocuments({ user_id: userId, is_read: false });
    },

    markAsRead: async (id) => {
        return await Notification.findByIdAndUpdate(id, { is_read: true }, { new: true });
    },

    markAllAsRead: async (userId) => {
        return await Notification.updateMany(
            { user_id: userId, is_read: false },
            { is_read: true }
        );
    },

    deleteById: async (id) => {
        return await Notification.findByIdAndDelete(id);
    },

    deleteAllByUserId: async (userId) => {
        return await Notification.deleteMany({ user_id: userId });
    }
};

module.exports = notificationsRepository;