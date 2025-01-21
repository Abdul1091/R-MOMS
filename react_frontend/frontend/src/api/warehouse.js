import api from './api';

const getAuthToken = () => localStorage.getItem('token');

export const getWarehouseDashboardData = async (page = 1, perPage = 10) => {
    const response = await api.get(`/warehouse/dashboard_data?page=${page}&per_page=${perPage}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
    return response.data;
};

export const downloadGPR = async (deliveryId) => {
    const response = await api.get(`/warehouse/download_gpr/${deliveryId}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
        responseType: 'blob',
    });
    return response.data;
};

export const updateQuantity = async (data) => {
    const response = await api.post('/warehouse/update_quantity', data, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
    return response.data;
};

export const getWarehouseData = async () => {
    const response = await api.get('/warehouse/warehouse', {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
    return response.data;
};