import React, { useState, useEffect } from 'react';
import { fetchSuppliers } from '../../api/procurement';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
        pages: 0,
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSuppliers = async () => {
            try {
                const data = await fetchSuppliers(pagination.page);
                setSuppliers(data.suppliers);
                setPagination({
                    page: data.current_page,
                    total: data.total,
                    pages: data.pages,
                });
            } catch (err) {
                setError(err.message);
            }
        };
        loadSuppliers();
    }, [pagination.page]);

    const handlePageChange = (pageNumber) => {
        setPagination((prevState) => ({
            ...prevState,
            page: pageNumber,
        }));
    };

    return (
        <div className="bg-gray-50 p-6 rounded-md shadow-md">
            {error && (
                <p className="text-red-500 text-sm mb-4">
                    {error}
                </p>
            )}
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Supplier List
            </h2>
            {suppliers.length > 0 ? (
                <div>
                    <ul className="space-y-4">
                        {suppliers.map((supplier) => (
                            <li
                                key={supplier.id}
                                className="p-4 bg-white border border-gray-200 rounded-md shadow hover:shadow-lg transition-shadow duration-300"
                            >
                                <p className="text-lg font-medium text-gray-800">
                                    {supplier.company_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Phone: {supplier.phone_no}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Email: {supplier.email}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed`}
                        >
                            Previous
                        </button>
                        <span className="text-gray-600">
                            Page {pagination.page} of {pagination.pages}
                        </span>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 text-center">
                    Loading suppliers...
                </p>
            )}
        </div>
    );
};

export default SupplierList;