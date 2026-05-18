import { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await API.post('/auth/login', { email, password });
        const { accessToken, refreshToken, perdoruesi } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(perdoruesi));

        setUser(perdoruesi);
        return response.data;
    };

    const register = async (userData) => {
        const response = await API.post('/auth/register', userData);
        return response.data;
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await API.post('/auth/logout', { refreshToken });
        } catch (error) {
            console.error('Gabim gjate logout:', error);
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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