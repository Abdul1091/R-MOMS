import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your Flask backend URL

// Axios instance with defaults
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Login API call
export const loginUser = async (credentials) => {
    try {
        console.log('Sending login request to:', `${API_BASE_URL}/auth/login`);
        const response = await api.post('/auth/login', credentials);
        console.log('Login response:', response.data);
        return response.data;
    } catch (err) {
        console.error('Error during login:', err.response?.data || err.message);
        throw err;
    }
};

// Register API call
export const registerUser = async (data) => {
    try {
        console.log('Sending register request to:', `${API_BASE_URL}/auth/register`);
        const response = await api.post('/auth/register', data);
        console.log('Register response:', response.data);
        return response.data;
    } catch (err) {
        console.error('Error during registration:', err.response?.data || err.message);
        throw err;
    }
};

export default api;