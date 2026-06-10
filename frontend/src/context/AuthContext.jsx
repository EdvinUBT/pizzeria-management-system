import { createContext, useContext, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const store = useAuthStore();

    useEffect(() => {
        store.initSocket();
    }, []);

    return (
        <AuthContext.Provider value={{
            user: store.user,
            loading: store.loading,
            login: store.login,
            register: store.register,
            logout: store.logout,
            isAdmin: store.isAdmin,
            isMenaxher: store.isMenaxher,
            hasRole: store.hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;