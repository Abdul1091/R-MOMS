import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        console.log("Request to:", config.url);
        console.log("Headers:", config.headers);
        console.log("Data:", config.data);
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log("Response received:", response);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error("Error response status:", error.response.status);
            console.error("Error response data:", error.response.data);
        } else {
            console.error("Error message:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;