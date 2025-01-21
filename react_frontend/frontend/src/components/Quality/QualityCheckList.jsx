import React, { useEffect, useState } from 'react';
import { fetchQualityChecks } from '../../api/quality';

const QualityCheckList = () => {
    const [qualityChecks, setQualityChecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchQualityChecks();
                setQualityChecks(response.data.items);
            } catch (error) {
                console.error('Error fetching quality checks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center">Loading...</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Quality Checks</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Truck No</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {qualityChecks.map((item, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{item.delivery.truck_no}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.quality_check?.quality_check_status || 'Pending'}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.delivery.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QualityCheckList;