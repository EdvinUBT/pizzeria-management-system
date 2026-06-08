import { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';
import socket from '../services/socket';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);

            socket.connect();
            socket.emit('join', parsedUser.id);
            if (parsedUser.roles?.includes('admin') || parsedUser.roles?.includes('menaxher')) {
                socket.emit('join_admin');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await API.post('/auth/login', { email, password });
        const { perdoruesi } = response.data;

        localStorage.setItem('user', JSON.stringify(perdoruesi));
        setUser(perdoruesi);

        // Lidhu me Socket.IO
        socket.connect();
        socket.emit('join', perdoruesi.id);
        if (perdoruesi.roles?.includes('admin') || perdoruesi.roles?.includes('menaxher')) {
            socket.emit('join_admin');
        }

        return response.data;
    };

    const register = async (userData) => {
        const response = await API.post('/auth/register', userData);
        return response.data;
    };

    const logout = async () => {
        try {
            await API.post('/auth/logout');
        } catch (error) {
            console.error('Gabim gjate logout:', error);
        }

        socket.disconnect();
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAdmin = () => {
        return user?.roles?.includes('admin');
    };

    const isMenaxher = () => {
        return user?.roles?.includes('menaxher');
    };

    const hasRole = (role) => {
        return user?.roles?.includes(role);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            isAdmin,
            isMenaxher,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;