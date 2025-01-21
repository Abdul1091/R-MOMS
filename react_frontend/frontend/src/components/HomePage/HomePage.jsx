import React from 'react';
import { Link } from 'react-router-dom';
import { FaWarehouse, FaTruck, FaMoneyBillWave, FaShieldAlt, FaWeight, FaUsers, FaChartLine, FaBullhorn, FaCog } from 'react-icons/fa';

const departments = [
    { id: 1, name: 'Procurement', link: '/proc-dashboard', available: true, icon: <FaCog />, color: 'text-green-500' },
    { id: 2, name: 'Warehouse', link: '/warehouse', available: true, icon: <FaWarehouse />, color: 'text-yellow-500' },
    { id: 3, name: 'Finance', link: '/finance', available: true, icon: <FaMoneyBillWave />, color: 'text-blue-500' },
    { id: 4, name: 'Quality Control', link: '/quality/dashboard', available: true, icon: <FaShieldAlt />, color: 'text-red-500' },
    { id: 5, name: 'Weighbridge', link: '/weighbridge', available: true, icon: <FaWeight />, color: 'text-purple-500' },
    { id: 6, name: 'Logistics', link: '', available: false, icon: <FaTruck />, color: 'text-teal-500' },
    { id: 7, name: 'Human Resources', link: '', available: false, icon: <FaUsers />, color: 'text-pink-500' },
    { id: 8, name: 'Production', link: '', available: false, icon: <FaCog />, color: 'text-orange-500' },
    { id: 9, name: 'Sales', link: '', available: false, icon: <FaChartLine />, color: 'text-indigo-500' },
    { id: 10, name: 'Marketing', link: '', available: false, icon: <FaBullhorn />, color: 'text-cyan-500' },
];

const HomePage = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            
            {/* Page Header */}
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Welcome to R-MOMS Dashboard</h1>
            <p className="text-lg text-gray-700 text-center mb-8">
                Your central hub for efficient and effective operations.
            </p>

            {/* Quick Actions Section */}
            <div className="gap-6 mb-8">
                <h2 className="text-lg font-bold mb-4 text-gray-700">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Manage Departments
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        View Reports
                    </button>
                    <button
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                        Configure Settings
                    </button>
                </div>
            </div>

            {/* Department Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {departments.map(department => (
                    department.available ? (
                        <Link
                            to={department.link}
                            key={department.id}
                            className="bg-white shadow-md rounded-lg p-4 flex items-center transform hover:scale-105 transition duration-300"
                        >
                            <div className={`text-3xl mr-4 ${department.color}`}>{department.icon}</div>
                            <div>
                                <h2 className="font-semibold text-gray-600">{department.name}</h2>
                            </div>
                        </Link>
                    ) : (
                        <div
                            key={department.id}
                            className="bg-gray-100 border border-gray-300 shadow-md rounded-lg p-4 flex items-center cursor-not-allowed"
                        >
                            <div className={`text-3xl mr-4 ${department.color} opacity-50`}>{department.icon}</div>
                            <div>
                                <h2 className="font-semibold text-gray-500">{department.name}</h2>
                                <p className="text-sm text-gray-400">(Coming Soon)</p>
                            </div>
                        </div>
                    )
                ))}
            </div>

        </div>
    );
};

export default HomePage;