import React, { useEffect, useState } from 'react';
import { fetchDashboardData } from '../../api/weighbridge';
import DeliveryList from './DeliveryList';
import DeliveryCreate from './DeliveryCreate';
import { FaList, FaPlus, FaTruck, FaBalanceScale, FaUsers } from 'react-icons/fa';

const WeighbridgeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [activeComponent, setActiveComponent] = useState(''); // Tracks which component to display

  useEffect(() => {
    fetchDashboardData()
      .then((response) => setDashboardData(response))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!dashboardData) return <div className="text-center py-10">Loading...</div>;

  // Render the active component based on the selected option
  const renderContent = () => {
    switch (activeComponent) {
      case 'DeliveryList':
        return <DeliveryList />;
      case 'DeliveryCreate':
        return <DeliveryCreate />;
      default:
        return (
          <div>
            <h2 className="text-lg font-bold">Welcome to the Weighbridge Dashboard!</h2>
            <p>Select an option to view more details.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Weighbridge Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaTruck className="text-blue-500 text-3xl mr-4" />
          <div>
            <h2 className="font-semibold text-gray-600">Total Deliveries</h2>
            <p className="text-xl font-bold text-gray-800">{dashboardData.total_deliveries}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaBalanceScale className="text-green-500 text-3xl mr-4" />
          <div>
            <h2 className="font-semibold text-gray-600">Total Weight (kg)</h2>
            <p className="text-xl font-bold text-gray-800">{dashboardData.total_weight}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaUsers className="text-yellow-500 text-3xl mr-4" />
          <div>
            <h2 className="font-semibold text-gray-600">Total Suppliers</h2>
            <p className="text-xl font-bold text-gray-800">{dashboardData.total_suppliers}</p>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-700">Quick Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveComponent('DeliveryList')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Delivery List
          </button>
          <button
            onClick={() => setActiveComponent('DeliveryCreate')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add New Delivery
          </button>
        </div>
      </div>

      {/* Dynamic Content Display */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default WeighbridgeDashboard;