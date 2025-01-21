import React, { useState } from 'react';
import { updateQuantity } from '../../api/warehouse';

const UpdateQuantity = () => {
    const [deliveryId, setDeliveryId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateQuantity({ delivery_id: deliveryId, quantity_received: quantity });
            setMessage(response.message || 'Quantity updated successfully');
        } catch (error) {
            setMessage('Error updating quantity');
        }
    };

    return (
        <div className="p-4">
            <h2 className="font-semibold">Update Quantity</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="deliveryId" className="block">Delivery ID</label>
                    <input
                        id="deliveryId"
                        type="number"
                        value={deliveryId}
                        onChange={(e) => setDeliveryId(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="quantity" className="block">Quantity Received</label>
                    <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                    Update Quantity
                </button>
            </form>

            {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
    );
};

export default UpdateQuantity;