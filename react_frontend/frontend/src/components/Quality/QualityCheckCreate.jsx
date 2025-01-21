import React, { useState, useEffect } from 'react';
import { performQualityCheck, fetchDeliveries } from '../../api/quality';
import { useNavigate } from 'react-router-dom';

const QualityCheckCreate = () => {
    const [formData, setFormData] = useState({
        delivery_id: '',
        moisture_content: '',
        total_bags: '',
        accepted_bags: '',
        short_grains: '',
        immature: '',
        foreign_matter: '',
        stones: '',
        discolored_grains: '',
        cracked_grain: '',
        red_grain: '',
        empty_shells: '',
        quality_check_status: 'Pending',
        notes: '',
    });

    const [deliveries, setDeliveries] = useState([]);
    const [message, setMessage] = useState('');
    const [expandedSection, setExpandedSection] = useState('general');
    const navigate = useNavigate();

    useEffect(() => {
        const getDeliveries = async () => {
            try {
                const response = await fetchDeliveries();
                console.log('Response:', response);
                setDeliveries(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching deliveries:', error);
                setMessage('Error fetching deliveries');
            }
        };

        getDeliveries();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convert input value to correct type
        const updatedValue = name.includes('moisture_content') || name.includes('short_grains') || name.includes('stones') || name.includes('discolored_grains') || name.includes('cracked_grain') || name.includes('red_grain') || name.includes('empty_shells') || name.includes('immature') || name.includes('foreign_matter')
            ? parseFloat(value) || ''
            : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: updatedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await performQualityCheck(formData.delivery_id, formData);
            setMessage(response.data.message);
            
        } catch (error) {
            setMessage(error.response?.data.error || 'An error occurred.');
        }
        navigate('/quality/dashboard');
    };

    const sections = [
        { name: 'General', id: 'general' },
        { name: 'Defects', id: 'defects' },
        { name: 'Status & Notes', id: 'status-notes' },
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
                <button onClick={() => navigate('/quality/dashboard')}>Go to Dashboard</button>

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

            <div className="w-3/4 p-6 bg-gray-100 min-h-screen">
                <h2 className="text-2xl font-bold mb-6">Perform Quality Check</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-6">
                        <label className="font-medium mb-2">Select Delivery</label>
                        <select
                            name="delivery_id"
                            value={formData.delivery_id}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full"
                        >
                            <option value="">Select a Delivery</option>
                            {Array.isArray(deliveries) && deliveries.length > 0 ? (
                                deliveries.map((delivery) => (
                                    <option key={delivery.id} value={delivery.id}>
                                        {delivery.truck_no} - {delivery.created_at}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No deliveries available</option>
                            )}
                        </select>
                    </div>

                    {renderSection('general', 'General', [
                        { label: 'Moisture Content', name: 'moisture_content', type: 'number' },
                        { label: 'Total Bags', name: 'total_bags', type: 'number' },
                        { label: 'Accepted Bags', name: 'accepted_bags', type: 'number' },
                    ])}

                    {renderSection('defects', 'Defects', [
                        { label: 'Short Grains (%)', name: 'short_grains', type: 'number' },
                        { label: 'Immature (%)', name: 'immature', type: 'number' },
                        { label: 'Foreign Matter (%)', name: 'foreign_matter', type: 'number' },
                        { label: 'Stones (%)', name: 'stones', type: 'number' },
                        { label: 'Discolored Grains (%)', name: 'discolored_grains', type: 'number' },
                        { label: 'Cracked Grain (%)', name: 'cracked_grain', type: 'number' },
                        { label: 'Red Grain (%)', name: 'red_grain', type: 'number' },
                        { label: 'Empty Shells (%)', name: 'empty_shells', type: 'number' },
                    ])}

                    {renderSection('status-notes', 'Status & Notes', [
                        {
                            label: 'Quality Check Status',
                            name: 'quality_check_status',
                            type: 'select',
                            options: [
                                { value: 'Pending', label: 'Pending' },
                                { value: 'pass', label: 'Pass' },
                                { value: 'fail', label: 'Fail' },
                                { value: 'partial', label: 'Partial' },
                            ],
                        },
                        {
                            label: 'Notes',
                            name: 'notes',
                            type: 'textarea',
                        },
                    ])}

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg"
                        >
                            Submit Quality Check
                        </button>
                    </div>
                </form>
                {message && <p className="mt-4 text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default QualityCheckCreate;