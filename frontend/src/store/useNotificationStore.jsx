import { create } from 'zustand';
import API from '../services/api';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,

    fetchNotifications: async () => {
        try {
            const res = await API.get('/notifications?limit=10');
            set({ notifications: res.data.notifications || [] });
        } catch (error) {
            console.error('Gabim:', error);
        }
    },

    fetchUnreadCount: async () => {
        try {
            const res = await API.get('/notifications/unread-count');
            set({ unreadCount: res.data.count });
        } catch (error) {
            console.error('Gabim:', error);
        }
    },

    addNotification: (notification) => {
        set(state => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    },

    markAsRead: async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            set(state => ({
                unreadCount: Math.max(0, state.unreadCount - 1),
                notifications: state.notifications.map(n =>
                    n._id === id ? { ...n, is_read: true } : n
                )
            }));
        } catch (error) {
            console.error('Gabim:', error);
        }
    },

    markAllAsRead: async () => {
        try {
            await API.put('/notifications/mark-all-read');
            set(state => ({
                unreadCount: 0,
                notifications: state.notifications.map(n => ({ ...n, is_read: true }))
            }));
        } catch (error) {
            console.error('Gabim:', error);
        }
    }
}));

export default useNotificationStore;