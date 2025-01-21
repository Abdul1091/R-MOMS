import api from './api'; 

const getAuthToken = () => localStorage.getItem('token');

export const fetchDashboardData = () =>
    api.get('/quality_control/dashboard', {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });

export const fetchQualityChecks = (params) =>
    api.get('/quality_control/list_quality_check', {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
        params,
    });

export const performQualityCheck = (deliveryId, data) =>
    api.post(`/quality_control/quality_check/${deliveryId}`, data, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });

export const fetchDeliveries = async () => {
    try {
        const response = await api.get('/quality_control/list_deliveries', {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        throw error;
    }
};