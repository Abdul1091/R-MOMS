import api from './api';

const getAuthToken = () => localStorage.getItem('token');

// Fetch dashboard data
export const fetchDashboardData = async () => {
    try {
        const response = await api.get('/weighbridge/dashboard', {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};

// Fetch deliveries list
export const fetchDeliveries = async (
    page = 1,
    perPage = 10,
    sortBy = 'created_at',
    order = 'asc'
) => {
    try {
        const response = await api.get('/weighbridge/deliveries', {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
            params: { page, per_page: perPage, sort_by: sortBy, order: order },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching deliveries:', error);
        throw error;
    }
};

// Add a new delivery
export const addDelivery = async (deliveryData) => {
    try {
        const response = await api.post('/weighbridge/add_delivery', deliveryData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding delivery:', error);
        throw error;
    }
};