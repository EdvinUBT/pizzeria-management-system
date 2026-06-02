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
        const { perdoruesi } = response.data;

        // Ruaj vetem te dhenat e userit (jo tokenat!)
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
            await API.post('/auth/logout');
        } catch (error) {
            console.error('Gabim gjate logout:', error);
        }

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