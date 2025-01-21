import React, { useEffect, useState } from 'react';
import { getWarehouseData } from '../../api/warehouse';

const WarehouseData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getWarehouseData();
                setData(result);
            } catch (error) {
                console.error('Error fetching warehouse data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Warehouse Data</h1>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="mt-4">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-2 text-left">Delivery ID</th>
                                <th className="px-4 py-2 text-left">Supplier ID</th>
                                <th className="px-4 py-2 text-left">Company Name</th>
                                <th className="px-4 py-2 text-left">Gross Weight (kg)</th>
                                <th className="px-4 py-2 text-left">Tare Weight (kg)</th>
                                <th className="px-4 py-2 text-left">Net Weight (kg)</th>
                                <th className="px-4 py-2 text-left">Total Price</th>
                                <th className="px-4 py-2 text-left">Quantity Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.deliveries_info.map((delivery) => (
                                <tr key={delivery.id} className="border-b">
                                    <td className="px-4 py-2">{delivery.id}</td>
                                    <td className="px-4 py-2">{delivery.supplier_id}</td>
                                    <td className="px-4 py-2">{delivery.supplier}</td>
                                    <td className="px-4 py-2">{delivery.gross_weight}</td>
                                    <td className="px-4 py-2">{delivery.tar_weight}</td>
                                    <td className="px-4 py-2">{delivery.net_weight}</td>
                                    <td className="px-4 py-2">{delivery.total_price}</td>
                                    <td className="px-4 py-2">{delivery.quantity_received}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WarehouseData;