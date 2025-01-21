import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-300 shadow-md p-4 text-center fixed bottom-0 left-0 w-full">
      <p className="text-white-300 text-sm font-medium">
        {/* will be replaced with client's specific info */}
        &copy; {new Date().getFullYear()} SoftBiochem. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;