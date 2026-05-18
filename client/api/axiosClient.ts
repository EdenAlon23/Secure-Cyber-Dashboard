import axios from 'axios';

const API_URL = 'http://localhost:5041/api'; 

export const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERVIEW TALKING POINT:
// Interceptors automatically attach our JWT to every request we send to the server.
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});