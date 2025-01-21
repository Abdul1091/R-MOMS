import React, { useState, useEffect } from 'react';
import { fetchProcurementData, manageMoisturePricing } from '../../api/procurement';
import MoisturePricing from './MoisturePricing';
import AddSupplier from './AddSupplier';
import SupplierList from './SupplierList';
import MoisturePricingCard from './MoisturePricingCard';
import { FaUserFriends, FaClipboardList } from 'react-icons/fa';

const ProcurementDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [moisturePricing, setMoisturePricing] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [activeComponent, setActiveComponent] = useState('');

    // Load initial data
    useEffect(() => {
        loadDashboardData();
        loadMoisturePricing();
    }, []);

    // Fetch dashboard data
    const loadDashboardData = async () => {
        try {
            const data = await fetchProcurementData();
            setDashboardData(data);
        } catch (err) {
            setError('Failed to load dashboard data.');
        }
    };

    // Fetch moisture pricing data
    const loadMoisturePricing = async () => {
        try {
            const data = await manageMoisturePricing();
            setMoisturePricing(data.message === 'No moisture pricing found.' ? null : data);
        } catch (err) {
            setError('Failed to load moisture pricing.');
        }
    };

    // Handle success or error messages
    const handleActionCompletion = (type, text) => {
        setMessage({ type, text });
        // Refresh dashboard data
        loadDashboardData();

        // Refresh moisture pricing data
        loadMoisturePricing();
        setTimeout(() => setMessage(null), 3000); // Clear the message after 3 seconds
    };

    // Render active component content
    const renderContent = () => {
        switch (activeComponent) {
            case 'MoisturePricing':
                return <MoisturePricing onActionComplete={handleActionCompletion} />;
            case 'AddSupplier':
                return <AddSupplier onActionComplete={handleActionCompletion} />;
            case 'SupplierList':
                return <SupplierList />;
            default:
                return (
                    <div>
                        <h2 className="text-lg font-bold">Welcome to the Procurement Dashboard!</h2>
                        <p>Select an option to view more details.</p>
                    </div>
                );
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;
    if (!dashboardData) return <p>Loading...</p>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Procurement Dashboard</h1>

            {/* Success/Error Messages */}
            {message && (
                <div
                    className={`p-4 mb-4 rounded ${
                        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {message.text}
                </div>
            )}

            {/* Metrics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
                    <FaUserFriends className="text-blue-500 text-3xl mr-4" />
                    <div>
                        <h2 className="font-semibold text-gray-600">Total Suppliers</h2>
                        <p className="text-xl font-bold text-gray-800">{dashboardData.total_suppliers}</p>
                    </div>
                </div>
                <MoisturePricingCard moisturePricing={moisturePricing} />
                <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
                    <FaClipboardList className="text-yellow-500 text-3xl mr-4" />
                    <div>
                        <h2 className="font-semibold text-gray-600">Supplier Management</h2>
                        <p className="text-xl font-bold text-gray-800">Active</p>
                    </div>
                </div>
            </div>

            {/* Navigation Options */}
            <div>
                <h2 className="text-lg font-bold mb-4 text-gray-700">Quick Actions</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveComponent('MoisturePricing')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Manage Moisture Pricing
                    </button>
                    <button
                        onClick={() => setActiveComponent('AddSupplier')}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Add Supplier
                    </button>
                    <button
                        onClick={() => setActiveComponent('SupplierList')}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        View Supplier List
                    </button>
                </div>
            </div>

            {/* Dynamic Content Display */}
            <div className="mt-8 bg-white shadow-md rounded-lg p-6">{renderContent()}</div>
        </div>
    );
};

export default ProcurementDashboard;