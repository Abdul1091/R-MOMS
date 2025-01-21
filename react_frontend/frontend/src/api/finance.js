import api from './api';

const getAuthToken = () => localStorage.getItem('token');

export const fetchFinanceDashboard = () => 
    api.get('/finance/fin_dashboard', {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });

export const fetchWalletDetails = (supplierId) => 
    api.get(`/finance/wallet/${supplierId}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });

export const fetchPayments = () => 
    api.get('/finance/fin_pro_payment', {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });

export const fetchPendingPayments = async () => {
    try {
        const response = await api.get('/finance/fin_pro_payment', {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching pending payments:", error);
        throw error;
    }
};

export const processPayment = async (deliveryId) => {
    try {
        const response = await api.post(
            '/finance/process_payment',
            { delivery_id: deliveryId },
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error processing payment:", error);
        throw error;
    }
};