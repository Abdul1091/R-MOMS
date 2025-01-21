import React, { useEffect, useState } from 'react';
import { downloadGPR } from '../../api/warehouse';
import { fetchDeliveries } from '../../api/quality';

const DownloadGPR = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

    // Fetch deliveries
    useEffect(() => {
        const getDeliveries = async () => {
            try {
                const deliveriesData = await fetchDeliveries();
                setDeliveries(deliveriesData);
            } catch (error) {
                console.error('Error fetching deliveries:', error);
            }
        };

        getDeliveries();
    }, []);

    const handleDownload = async () => {
        if (!selectedDeliveryId) {
            alert('Please select a delivery first.');
            return;
        }

        try {
            const data = await downloadGPR(selectedDeliveryId);
            const fileURL = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `GPR_${selectedDeliveryId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading GPR:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="font-semibold mb-4">Select a Delivery to Download GPR</h2>

            <div className="mb-4">
                <label htmlFor="deliverySelect" className="block mb-2">Select Delivery</label>
                <select
                    id="deliverySelect"
                    onChange={(e) => setSelectedDeliveryId(e.target.value)}
                    value={selectedDeliveryId || ''}
                    className="p-2 border border-gray-300 rounded w-full"
                >
                    <option value="">-- Choose Delivery --</option>
                    {deliveries.map((delivery) => (
                        <option key={delivery.id} value={delivery.id}>
                            {`Delivery ID: ${delivery.id} - Quantity Received: ${delivery.quantity_received}`}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleDownload} className="p-2 bg-green-500 text-white rounded">
                Download GPR
            </button>
        </div>
    );
};

export default DownloadGPR;