import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPendingPayments } from '../../api/finance';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPayments = async () => {
            try {
                const data = await fetchPendingPayments();
                setPayments(data.deliveries_info || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getPayments();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pending Payments</h1>
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Supplier</th>
                        <th className="border px-4 py-2">Net Weight</th>
                        <th className="border px-4 py-2">Total Price</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.id}>
                            <td className="border px-4 py-2">{payment.id}</td>
                            <td className="border px-4 py-2">{payment.supplier.company_name}</td>
                            <td className="border px-4 py-2">{payment.net_weight} kg</td>
                            <td className="border px-4 py-2">${payment.total_price.toFixed(2)}</td>
                            <td className="border px-4 py-2">
                                <Link to={`/payment/${payment.id}`} className="mr-2 text-blue-500">
                                    View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentList;