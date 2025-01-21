import api from './api';
const getAuthToken = () => localStorage.getItem('token');

// Login API call
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

// Get current user
export const getCurrentUser = async () => {
    const token = getAuthToken();
    if (!token) throw new Error('No token found');
    try {
        const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error fetching user data';
    }
};

// Reset Password Request
export const resetPasswordRequest = async (email) => {
    try {
        const response = await api.post('/auth/reset-password-request', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error requesting password reset';
    }
};

// Reset Password
export const resetPassword = async ({ token, new_password }) => {
    try {
        const response = await api.post('/auth/reset-password', { token, new_password });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error resetting password';
    }
};

// Change Password
export const changePassword = async ({ current_password, new_password }) => {
    const token = getAuthToken();
    if (!token) throw new Error('No token found');
    try {
        const response = await api.post(
            '/auth/change-password',
            { current_password, new_password },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error changing password';
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