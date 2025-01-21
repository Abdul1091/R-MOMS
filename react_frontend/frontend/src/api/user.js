import api from './api';

const getAuthToken = () => localStorage.getItem('token');

// Fetch user profile
export const fetchUserProfile = async () => {
    try {
        const response = await api.get('/user/profile', {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            } 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update user profile
export const updateUserProfile = async (data) => {
    try {
        const response = await api.put('/user/profile', data, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};