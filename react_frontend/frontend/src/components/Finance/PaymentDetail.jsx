import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPendingPayments, processPayment } from '../../api/finance';

const PaymentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the payment details when the component is mounted or the ID changes
    useEffect(() => {
        const getPaymentDetail = async () => {
            try {
                setLoading(true);
                const data = await fetchPendingPayments(); // Fetch all pending payments
                const paymentDetail = data.deliveries_info.find(
                    (delivery) => delivery.id === parseInt(id)
                );
                if (!paymentDetail) {
                    throw new Error("Payment not found");
                }
                setPayment(paymentDetail);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getPaymentDetail();
    }, [id]);

    // Handle the processing of the payment
    const handleProcessPayment = async () => {
        if (!payment) return;
        try {
            await processPayment(payment.id);
            alert("Payment processed successfully!"); // Notify success
            navigate('/payments'); 
        } catch (err) {
            alert(`Error processing payment: ${err.message}`); // Notify error
        }
    };

    // Render loading state
    if (loading) return <p>Loading...</p>;

    // Render error state
    if (error) return <p>Error: {error}</p>;

    // Render "Payment not found" if no payment is available
    if (!payment) return <p>Payment not found.</p>;

    // Render payment details
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
            <div className="border p-4 rounded">
                <p>
                    <strong>Delivery ID:</strong> {payment.id}
                </p>
                <p>
                    <strong>Supplier:</strong> {payment.supplier.company_name}
                </p>
                <p>
                    <strong>Net Weight:</strong> {payment.net_weight} kg
                </p>
                <p>
                    <strong>Total Price:</strong> ${payment.total_price.toFixed(2)}
                </p>
                <button
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleProcessPayment}
                >
                    Process Payment
                </button>
            </div>
        </div>
    );
};

export default PaymentDetail;