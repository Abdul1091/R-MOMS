import React, { useState } from 'react';
import { addDelivery } from '../../api/weighbridge';
import { useNavigate } from 'react-router-dom';

const DeliveryCreate = () => {
    const [formData, setFormData] = useState({
        supplier_id: '',
        goods_type: '',
        quantity: '',
        gross_wgt: '',
        tar_wgt: '',
        truck_no: '',
        driver_nm: '',
        driver_no: '',
    });

    const [message, setMessage] = useState('');
    const [expandedSection, setExpandedSection] = useState('general');
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addDelivery(formData);
            setMessage('Delivery added successfully');
            setTimeout(() => navigate('/weighbridge'), 2000);
        } catch (error) {
            setMessage(error.response?.data.error || 'An error occurred.');
        }
    };

    const sections = [
        { name: 'General', id: 'general' },
        { name: 'Details', id: 'details' },
    ];

    const scrollToSection = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        setExpandedSection(id);
    };

    const calculateProgress = (fields) => {
        const completedFields = fields.filter(
            (field) => formData[field.name]?.toString().trim() !== ''
        ).length;
        return Math.round((completedFields / fields.length) * 100);
    };

    const renderSection = (id, sectionName, fields) => {
        const progress = calculateProgress(fields);

        return (
            <div id={id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <div className="cursor-pointer flex justify-between items-center">
                    <h3 className="font-bold text-lg">{sectionName}</h3>
                </div>
                <div className="mt-2 mb-4">
                    <div className="relative w-full h-2 bg-gray-200 rounded-full">
                        <div
                            style={{ width: `${progress}%` }}
                            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{progress}% Completed</p>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field) => (
                        <div key={field.name} className="flex flex-col">
                            <label className="font-medium mb-2">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                    rows="4"
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                >
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex">
            
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-100 p-4 shadow-lg h-screen sticky top-0">
                <h3 className="font-bold text-lg mb-4">Sections</h3>
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`cursor-pointer p-2 mb-2 rounded-lg ${
                            expandedSection === section.id ? 'bg-blue-500 text-white' : 'bg-white'
                        }`}
                        onClick={() => scrollToSection(section.id)}
                    >
                        {section.name}
                    </div>
                ))}
            </div>

            {/* Main Form */}
            <div className="w-3/4 p-6 bg-gray-100 min-h-screen">
                <h2 className="text-2xl font-bold mb-6">Add New Delivery</h2>
                {error && <p className="text-red-500">{error}</p>}
                {message && <p className="mt-4 text-green-500">{message}</p>}
                <form onSubmit={handleSubmit}>
                    {renderSection('general', 'General', [
                        { label: 'Supplier ID', name: 'supplier_id', type: 'number' },
                        { label: 'Goods Type', name: 'goods_type', type: 'text' },
                        { label: 'Quantity', name: 'quantity', type: 'number' },
                    ])}
                    {renderSection('details', 'Details', [
                        { label: 'Gross Weight', name: 'gross_wgt', type: 'number' },
                        { label: 'Tare Weight', name: 'tar_wgt', type: 'number' },
                        { label: 'Truck No.', name: 'truck_no', type: 'text' },
                        { label: 'Driver Name', name: 'driver_nm', type: 'text' },
                        { label: 'Driver Number', name: 'driver_no', type: 'text' },
                    ])}
                    <div className="fixed bottom-10 left-0 right-0 bg-white shadow-md p-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeliveryCreate;