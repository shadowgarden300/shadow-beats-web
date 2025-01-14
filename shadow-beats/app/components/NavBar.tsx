import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-gray-900">
     
      <div className="flex items-center justify-center h-full">
        
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-10 rounded-full text-white bg-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





