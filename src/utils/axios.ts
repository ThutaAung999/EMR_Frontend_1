import axios from 'axios';

//const apiUrl = 'http://localhost:9999';
const apiUrl = import.meta.env.VITE_API_URL;
//const apiUrl = import.meta.env.production.VITE_API_URL;
//const apiUrl ='https://emr-backend-intz.onrender.com'

const instance = axios.create({
    baseURL: apiUrl, // Set your backend's base URL here
    
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
