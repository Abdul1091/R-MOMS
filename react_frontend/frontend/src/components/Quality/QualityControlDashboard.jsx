import React, { useEffect, useState } from 'react';
import { fetchDashboardData } from '../../api/quality';
import QualityCheckList from './QualityCheckList';
import QualityCheckCreate from './QualityCheckCreate';
import { FaClipboardCheck, FaThumbsUp, FaTimesCircle, FaPlus, FaList } from 'react-icons/fa';


const QualityControlDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [activeComponent, setActiveComponent] = useState('default');

  useEffect(() => {
    fetchDashboardData()
      .then((response) => setDashboardData(response.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!dashboardData) return <p>Loading...</p>;

  // Dynamic content rendering
  const renderContent = () => {
    switch (activeComponent) {
      case 'QualityCheckList':
        return <QualityCheckList />;
      case 'QualityCheckCreate':
        return <QualityCheckCreate />;
      case 'QualityCheckStats':
        return <QualityCheckStats stats={dashboardData.quality_stats} />;
      default:
        return (
          <div>
            <h2 className="text-lg font-bold">Welcome to the Quality Control Dashboard!</h2>
            <p>Select an option to view more details.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Quality Control Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaClipboardCheck className="text-blue-500 text-3xl mr-4" />
          <div>
            <h2 className="font-semibold text-gray-600">Total Quality Checks</h2>
            <p className="text-xl font-bold text-gray-800">{dashboardData.quality_stats.total}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaThumbsUp className="text-green-500 text-3xl mr-4" />
          <div>
            <h2 className="font-semibold text-gray-600">Passed Checks</h2>
            <p className="text-xl font-bold text-gray-800">{dashboardData.quality_stats.passed}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaTimesCircle className="text-red-500 text-3xl mr-4" />
          <div>
            <h2 className="font-semibold text-gray-600">Failed Checks</h2>
            <p className="text-xl font-bold text-gray-800">{dashboardData.quality_stats.failed}</p>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-700">Quick Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveComponent('QualityCheckList')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Quality Check List
          </button>
          <button
            onClick={() => setActiveComponent('QualityCheckCreate')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add New Quality Check
          </button>
          <button
            onClick={() => setActiveComponent('QualityCheckStats')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            View Quality Check Stats
          </button>
        </div>
      </div>

      {/* Dynamic Content Display */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">{renderContent()}</div>
    </div>
  );
};

export default QualityControlDashboard;