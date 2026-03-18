import axios from 'axios';

const api = axios.create({
    baseURL: 'https://web-production-d9e15.up.railway.app/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🚀 Request:', config.method.toUpperCase(), config.url);
        return config;
    }
);

export default api;