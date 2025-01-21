import React, { useState, useEffect } from 'react';
import { fetchDeliveries } from '../../api/weighbridge';

const DeliveryList = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getDeliveries = async () => {
            try {
                const data = await fetchDeliveries();
                setDeliveries(data.deliveries);
            } catch (error) {
                setError('Error fetching deliveries');
            } finally {
                setLoading(false);
            }
        };
        getDeliveries();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">Deliveries List</h2>
            <table className="min-w-full mt-4 table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Truck No</th>
                        <th className="px-4 py-2 border">Driver</th>
                        <th className="px-4 py-2 border">Gross Weight</th>
                        <th className="px-4 py-2 border">Net Weight</th>
                        <th className="px-4 py-2 border">Total Value</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveries.map((delivery) => (
                        <tr key={delivery.id}>
                            <td className="px-4 py-2 border">{delivery.truck_no}</td>
                            <td className="px-4 py-2 border">{delivery.driver_nm}</td>
                            <td className="px-4 py-2 border">{delivery.gross_wgt}</td>
                            <td className="px-4 py-2 border">{delivery.net_wgt}</td>
                            <td className="px-4 py-2 border">{delivery.total_value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeliveryList;