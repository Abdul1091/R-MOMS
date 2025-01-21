import React, { useEffect, useState } from 'react';
import { getWarehouseDashboardData } from '../../api/warehouse';
import DownloadGPR from './DownloadGPR';
import UpdateQuantity from './UpdateQuantity';
import WarehouseData from './WarehouseData';
// import WarehouseTable from './WarehouseTable';
import { FaBox, FaWeightHanging, FaUsers, FaFileDownload, FaEdit } from 'react-icons/fa';

const WarehouseDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [activeComponent, setActiveComponent] = useState(''); // Tracks which component to display

  useEffect(() => {
    getWarehouseDashboardData()
      .then((response) => setDashboardData(response))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!dashboardData) return <p>Loading...</p>;

  // Render the active component based on the selected option
  const renderContent = () => {
    switch (activeComponent) {
      case 'WarehouseData':
        return <WarehouseData />;
      case 'DownloadGPR':
        return <DownloadGPR />;
      case 'UpdateQuantity':
        return <UpdateQuantity />;
      default:
        return (
          <div>
            <h2 className="text-lg font-bold">Welcome to the Warehouse Dashboard!</h2>
            <p>Select an option to view more details.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Warehouse Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaBox className="text-blue-500 text-3xl mr-4" />
          <div>
            <h2 className="font-semibold text-gray-600">Total Deliveries</h2>
            <p className="text-xl font-bold text-gray-800">{dashboardData.total_deliveries}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaWeightHanging className="text-green-500 text-3xl mr-4" />
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
            onClick={() => setActiveComponent('WarehouseData')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Warehouse Data
          </button>
          <button
            onClick={() => setActiveComponent('DownloadGPR')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download GPR
          </button>
          <button
            onClick={() => setActiveComponent('UpdateQuantity')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Update Quantity
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

export default WarehouseDashboard;