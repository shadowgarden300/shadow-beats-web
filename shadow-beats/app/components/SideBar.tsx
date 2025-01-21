import Link from 'next/link';
import React from 'react';
import { FaHome, FaCog, FaList, FaPlusSquare } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <aside
      className="fixed bg-gray-900 text-white flex items-center justify-around w-full h-16 bottom-0 md:top-16 md:left-0 md:h-[calc(100vh-4rem)] md:w-16 md:flex-col md:justify-start md:space-y-2"
    >
      {/* Home Icon */}
      <div className="flex items-center justify-center w-10 h-10 hover:bg-gray-700 rounded-lg cursor-pointer">
        <Link href={"/"}>
          <FaHome className="text-xl" />
        </Link>
      </div>
      {/* Settings Icon */}
      <div className="flex items-center justify-center w-10 h-10 hover:bg-gray-700 rounded-lg cursor-pointer">
        <FaCog className="text-xl" />
      </div>
      {/* List Icon */}
      <div className="flex items-center justify-center w-10 h-10 hover:bg-gray-700 rounded-lg cursor-pointer">
        <Link href={"/playlists"}>
            <FaList className="text-xl" />
        </Link>
        
      </div>
      {/* Add Icon */}
      <div className="flex items-center justify-center w-10 h-10 hover:bg-gray-700 rounded-lg cursor-pointer">
        <FaPlusSquare className="text-xl" />
      </div>
    </aside>
  );
};

export default Sidebar;
