import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true    // dergon cookies automatikisht
});

// Menaxho refresh token kur access token skadon
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Therrit refresh endpoint - cookies dergohen automatikisht
                await axios.post('http://localhost:5000/api/auth/refresh-token', {}, {
                    withCredentials: true
                });

                // Riprovo kerkesen origjinale
                return API(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;