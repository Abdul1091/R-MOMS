import React from 'react';

const TransactionHistoryTable = ({ transactionHistory = [] }) => {
  if (!transactionHistory || transactionHistory.length === 0) {
    return <p className="text-gray-600">No transaction history available.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-700 flex items-center">
        Transaction History
      </h2>
      <table className="min-w-full mt-4 border-collapse border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="border px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
            <th className="border px-4 py-2 text-left text-sm font-medium text-gray-600">Supplier</th>
            <th className="border px-4 py-2 text-left text-sm font-medium text-gray-600">Description</th>
            <th className="border px-4 py-2 text-right text-sm font-medium text-gray-600">Amount</th>
            <th className="border px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactionHistory.map((transaction, index) => {
            
            // Determine row color based on the status
            const rowClass = transaction.status === 'Paid' ? 'bg-green-100' : 'bg-red-100';

            return (
              <tr key={`${transaction.date}-${transaction.id || index}`} className={`hover:bg-gray-50 ${rowClass}`}>
                <td className="border px-4 py-2 text-sm text-gray-700">{transaction.date}</td>
                <td className="border px-4 py-2 text-sm text-gray-700">
                  {typeof transaction.supplier === 'object' && transaction.supplier !== null
                    ? transaction.supplier.company_name
                    : transaction.supplier}
                </td>
                <td className="border px-4 py-2 text-sm text-gray-700">
                  {transaction.description || 'N/A'}
                </td>
                <td className="border px-4 py-2 text-sm text-gray-800 text-right">
                  {transaction.amount}
                </td>
                <td className="border px-4 py-2 text-sm text-gray-700">{transaction.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistoryTable;