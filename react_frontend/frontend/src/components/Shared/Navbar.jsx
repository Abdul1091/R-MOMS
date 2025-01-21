import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/userContext'; // Import useUser hook

const Navbar = () => {
  const { user } = useUser(); // Access user data from context
  const location = useLocation(); // Get the current location path

  // Map paths to display names and colors
  // const pageTitles = {
  //   '/': 'Rice_MOMS Dashboard',
  //   '/login': 'Login',
  //   '/profile': 'User Profile',
  //   '/register': 'User Registration',
  //   '/reset-password': 'Reset Password',
  //   '/reset-password-request': 'Request Reset Password',
  //   '/proc-dashboard': 'Procurement Department',
  //   '/weighbridge': 'Weighbridge Department',
  //   '/quality/dashboard': 'Quality Control Department',
  //   '/warehouse': 'Warehouse Department',
  //   '/finance': 'Finance Department',
  //   '/it': 'IT Department',
  // };

  // const tabColors = {
  //   '/': 'text-blue-500',
  //   '/profile': 'text-green-500',
  //   '/login': 'text-red-500',
  //   '/register': 'text-purple-500',
  //   '/reset-password': 'text-yellow-500',
  //   '/reset-password-request': 'text-pink-500',
  //   '/proc-dashboard': 'text-teal-500',
  //   '/weighbridge': 'text-orange-500',
  //   '/quality/dashboard': 'text-cyan-500',
  //   '/warehouse': 'text-indigo-500',
  //   '/finance': 'text-emerald-500',
  //   '/it': 'text-rose-500',
  // };

  const currentPageTitle = 'Rice-MOMS'; // pageTitles[location.pathname] || 'Rice-MOMS';
  const currentTabColor = 'text-gray-100'  //tabColors[location.pathname] || 'text-gray-500';

  return (
    <nav className="bg-gray-500 shadow-md p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">

      {/* Logo and Page Title */}
      <div className="flex items-center">
        <img src="/path/to/logo.png" alt="Logo" className="h-10" />
        <span className={`text-xl font-bold ml-4 ${currentTabColor}`}>{currentPageTitle}</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className={`text-lg ${
            location.pathname === '/' ? 'font-semibold underline' : ''
          } hover:text-blue-700`}
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          className={`text-lg ${
            location.pathname === '/profile' ? 'font-semibold underline' : ''
          } hover:text-green-700`}
        >
          Profile
        </Link>
      </div>

      {/* User Info and Logout */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-200 font-semibold">{user?.username || 'Guest'}</span>
        <img
          src={user?.profilePicture || '/default-profile.png'}
          alt="Profile"
          className="h-8 w-8 rounded-full border-2 border-gray-300"
        />
        <Link
          to="/login"
          className={`text-lg ${
            location.pathname === '/login' ? 'font-semibold underline' : ''
          } hover:text-red-700`}
        >
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;