import React from 'react';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">404</h1>
        <p className="text-xl">Page Not Found</p>
        <p className="mt-4">Sorry, the page you're looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFound;