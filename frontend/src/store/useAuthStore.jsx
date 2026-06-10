import { create } from 'zustand';
import API from '../services/api';
import socket from '../services/socket';

const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,

    login: async (email, password) => {
        const response = await API.post('/auth/login', { email, password });
        const { perdoruesi } = response.data;

        localStorage.setItem('user', JSON.stringify(perdoruesi));
        set({ user: perdoruesi });

        socket.connect();
        socket.emit('join', perdoruesi.id);
        if (perdoruesi.roles?.includes('admin') || perdoruesi.roles?.includes('menaxher')) {
            socket.emit('join_admin');
        }

        return response.data;
    },

    register: async (userData) => {
        const response = await API.post('/auth/register', userData);
        return response.data;
    },

    logout: async () => {
        try {
            await API.post('/auth/logout');
        } catch (error) {
            console.error('Gabim gjate logout:', error);
        }

        socket.disconnect();
        localStorage.removeItem('user');
        set({ user: null });
    },

    isAdmin: () => {
        return get().user?.roles?.includes('admin');
    },

    isMenaxher: () => {
        return get().user?.roles?.includes('menaxher');
    },

    hasRole: (role) => {
        return get().user?.roles?.includes(role);
    },

    initSocket: () => {
        const user = get().user;
        if (user) {
            socket.connect();
            socket.emit('join', user.id);
            if (user.roles?.includes('admin') || user.roles?.includes('menaxher')) {
                socket.emit('join_admin');
            }
        }
    }
}));

export default useAuthStore;