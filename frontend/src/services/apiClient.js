import axios from 'axios';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL : API_BASE_URL,
    headers : {
        "Content-type": "application/json",
    },
    timeout : 10000,
});

api.interceptors.request.use(
    (config)=> {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error)=> {
        return Promise.reject(error);
    }
    
)

export default api;

