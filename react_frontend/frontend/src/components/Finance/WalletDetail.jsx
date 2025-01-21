import React, { useEffect, useState } from 'react';
import { fetchWalletDetails } from '../../api/finance';

const WalletDetail = ({ supplierId }) => {
  const [walletData, setWalletData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWalletDetails(supplierId)
      .then((response) => setWalletData(response.data))
      .catch((err) => setError(err.message));
  }, [supplierId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!walletData) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{walletData.supplier.company_name} Wallet</h1>
      <h2 className="font-semibold">Wallet Balance:</h2>
      <p>{walletData.wallet.balance}</p>
      <h2 className="text-lg font-bold mt-6">Transaction History</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Type</th>
          </tr>
        </thead>
        <tbody>
          {walletData.transaction_history.map((transaction, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">{transaction.date}</td>
              <td className="border px-2 py-1">{transaction.description}</td>
              <td className="border px-2 py-1">{transaction.amount}</td>
              <td className="border px-2 py-1">{transaction.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletDetail;