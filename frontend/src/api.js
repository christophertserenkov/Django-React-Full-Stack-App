// This is an Interceptor file that intercepts all the requests and adds a header to them.
// Using axios interceptors (automatically checks for access tokens)

import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const apiUrl = '/choreo-apis/djangoreacttutorial/backend/v1';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL
        : apiUrl,
});

api.interceptors.request.use(
    // Function that checks for an access token
    (config) => {
        // Try to access token from local storage
        const token = localStorage.getItem(ACCESS_TOKEN);
        // Check if the token exists
        if (token) {
            // Add the token
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
