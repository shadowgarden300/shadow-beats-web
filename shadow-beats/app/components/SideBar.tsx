import React from 'react';
import { FaHome, FaCog, FaList, FaPlusSquare } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-16 bg-purple-800 text-white flex flex-col items-center py-4 space-y-4">
      {/* Home Icon */}
      <div className="flex items-center justify-center w-10 h-10 hover:bg-purple-700 rounded-lg cursor-pointer">
        <FaHome className="text-xl" />
      </div>
      {/* Settings Icon */}
      <div className="flex items-center justify-center w-10 h-10 hover:bg-purple-700 rounded-lg cursor-pointer">
        <FaCog className="text-xl" />
      </div>
      {/* List Icon */}
      <div className="flex items-center justify-center w-10 h-10 hover:bg-purple-700 rounded-lg cursor-pointer">
        <FaList className="text-xl" />
      </div>
      {/* Add Icon */}
      <div className="flex items-center justify-center w-10 h-10 hover:bg-purple-700 rounded-lg cursor-pointer">
        <FaPlusSquare className="text-xl" />
      </div>
    </aside>
  );
};

export default Sidebar;

