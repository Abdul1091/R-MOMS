import api from './api';

const getAuthToken = () => localStorage.getItem('token');

const API_URL = 'http://localhost:5000/api';

// Fetch procurement dashboard data
export const fetchProcurementData = async () => {
    try {
        const response = await api.get(`${API_URL}/procurement/proc_dashboard`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch procurement data', error);
        throw new Error('Unable to fetch procurement data.');
    }
};

// Fetch suppliers with pagination
export const fetchSuppliers = async (page = 1, perPage = 10) => {
    try {
        const response = await api.get(`${API_URL}/procurement/suppliers`, {
            params: { page, per_page: perPage },
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch suppliers', error);
        throw new Error('Unable to fetch suppliers.');
    }
};

// Add a new supplier
export const addSupplier = async (data) => {
    try {
        const response = await api.post(`${API_URL}/procurement/suppliers/add`, data, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add supplier', error);
        throw new Error('Unable to add supplier.');
    }
};

// Manage moisture pricing
export const manageMoisturePricing = async (data = null) => {
    try {
        if (data) {
            
            const response = await api.post(`${API_URL}/procurement/moisture-pricing`, data, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
            });
            return response.data;
        } else {
            
            const response = await api.get(`${API_URL}/procurement/moisture-pricing`, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
            });
            return response.data;
        }
    } catch (error) {
        console.error('Failed to manage moisture pricing', error);
        throw new Error('Unable to manage moisture pricing.');
    }
};