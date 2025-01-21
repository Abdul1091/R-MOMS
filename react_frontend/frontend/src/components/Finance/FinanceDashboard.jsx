import React, { useEffect, useState } from 'react';
import { fetchFinanceDashboard } from '../../api/finance';
import PaymentList from './PaymentList';
import PaymentDetail from './PaymentDetail';
import WalletDetail from './WalletDetail';
import TransactionTable from './TransactionTable';
import { FaMoneyBillWave, FaWallet, FaHourglassHalf, FaHistory } from 'react-icons/fa';

const FinanceDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [activeComponent, setActiveComponent] = useState(''); // Tracks which component to display

  useEffect(() => {
    fetchFinanceDashboard()
      .then((response) => setDashboardData(response.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!dashboardData) return <p>Loading...</p>;

  // Render the active component based on the selected option
  const renderContent = () => {
    switch (activeComponent) {
      case 'PaymentList':
        return <PaymentList />;
      case 'PaymentDetail':
        return <PaymentDetail />;
      case 'WalletDetail':
        return <WalletDetail />;
      case 'TransactionHistory':
        return (
          <TransactionTable transactionHistory={dashboardData.transaction_history} />
        );
      default:
        return (
          <div>
            <h2 className="text-lg font-bold">Welcome to the Finance Dashboard!</h2>
            <p>Select an option to view more details.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Finance Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaMoneyBillWave className="text-green-500 text-3xl mr-4" />
          <div>
            <h2 className="font-semibold text-gray-600">Total Payments</h2>
            <p className="text-xl font-bold text-gray-800">{dashboardData.total_payments}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaHourglassHalf className="text-yellow-500 text-3xl mr-4" />
          <div>
            <h2 className="font-semibold text-gray-600">Pending Payments</h2>
            <p className="text-xl font-bold text-gray-800">{dashboardData.pending_payments}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaWallet className="text-blue-500 text-3xl mr-4" />
          <div>
            <h2 className="font-semibold text-gray-600">Wallet Balance</h2>
            <p className="text-xl font-bold text-gray-800">{dashboardData.total_wallet_balance}</p>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-700">Quick Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveComponent('PaymentList')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Payment List
          </button>
          <button
            onClick={() => setActiveComponent('PaymentDetail')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            View Payment Details
          </button>
          <button
            onClick={() => setActiveComponent('WalletDetail')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            View Wallet Details
          </button>
          <button
            onClick={() => setActiveComponent('TransactionHistory')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            View Transaction History
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

export default FinanceDashboard;