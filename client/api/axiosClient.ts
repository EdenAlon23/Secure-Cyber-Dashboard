import axios from 'axios';

// INTERVIEW TALKING POINT: 
// Using environment variables allows the app to dynamically switch between 
// the local C# server during development and the Render.com cloud server in production.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5041/api';

export const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});