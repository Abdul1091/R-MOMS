import React, { useState } from 'react';
import { manageMoisturePricing } from '../../api/procurement';

const MoisturePricing = () => {
    const [formData, setFormData] = useState({
        moisture_a: '',
        moisture_b: '',
        moisture_c: '',
        moisture_a_price: '',
        moisture_b_price: '',
        moisture_c_price: '',
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        try {
            const data = {
                moisture_a: parseFloat(formData.moisture_a),
                moisture_b: parseFloat(formData.moisture_b),
                moisture_c: parseFloat(formData.moisture_c),
                moisture_a_price: parseFloat(formData.moisture_a_price),
                moisture_b_price: parseFloat(formData.moisture_b_price),
                moisture_c_price: parseFloat(formData.moisture_c_price),
            };
            await manageMoisturePricing(data);
            setMessage('Moisture pricing updated successfully!');
        } catch (err) {
            setError('Failed to update moisture pricing.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Set Moisture Pricing</h1>

            {message && (
                <p className="text-green-600 bg-green-100 p-2 rounded mb-4">{message}</p>
            )}
            {error && (
                <p className="text-red-600 bg-red-100 p-2 rounded mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="moisture_a">
                            Moisture A:
                        </label>
                        <input
                            id="moisture_a"
                            type="number"
                            name="moisture_a"
                            value={formData.moisture_a}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="moisture_a_price">
                            Moisture A Price:
                        </label>
                        <input
                            id="moisture_a_price"
                            type="number"
                            name="moisture_a_price"
                            value={formData.moisture_a_price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="moisture_b">
                            Moisture B:
                        </label>
                        <input
                            id="moisture_b"
                            type="number"
                            name="moisture_b"
                            value={formData.moisture_b}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="moisture_b_price">
                            Moisture B Price:
                        </label>
                        <input
                            id="moisture_b_price"
                            type="number"
                            name="moisture_b_price"
                            value={formData.moisture_b_price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="moisture_c">
                            Moisture C:
                        </label>
                        <input
                            id="moisture_c"
                            type="number"
                            name="moisture_c"
                            value={formData.moisture_c}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="moisture_c_price">
                            Moisture C Price:
                        </label>
                        <input
                            id="moisture_c_price"
                            type="number"
                            name="moisture_c_price"
                            value={formData.moisture_c_price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default MoisturePricing;