'use client';

import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import Play from '../components/Play';
import { useSearchParams } from 'next/navigation';

interface SongData {
  videoId: string;
  title: string;
  thumbnail: string;
}

const CurrentTrake = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('id');
  const title = searchParams.get('title');
  const thumbnail = searchParams.get('thumbnail');

  const [queue, setQueue] = useState<SongData[]|never[]>([]);

  const [isQueueOpen, setIsQueueOpen] = useState(true); // State for queue visibility

  if (!videoId || !title || !thumbnail) {
    return (
      <div className="bg-gray-800 text-white min-h-screen">
        <Navbar />
        <Sidebar />
        <main className="ml-16 pt-16 px-6">
          <h1>Video ID is not provided</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col md:flex-row"> {/* Flex for layout */}
      <Navbar />
      <Sidebar />
      <main className="md:ml-16 pt-16 px-6 flex-grow flex flex-col"> {/* Main content area */}
        <div className="flex flex-col md:flex-row w-full h-full"> {/* Container for image and queue */}
          <div className="md:w-1/2 p-4 flex items-center justify-center"> {/* Image container */}
            <img src={thumbnail} alt={title} className="max-w-full max-h-96 rounded-lg shadow-lg" />
          </div>
          <div className={`md:w-1/2 p-4 overflow-y-auto transition-all duration-300 ${isQueueOpen ? 'block' : 'hidden md:block'}`}> {/* Queue container */}
            <h2 className="text-xl font-bold mb-4">Up Next</h2>
            <ul>
              {queue.map((song) => (
                <li key={song.videoId} className="flex items-center mb-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                  <img src={song.thumbnail} alt={song.title} className="w-16 h-9 object-cover rounded mr-2" />
                  <div>
                    <p className="font-medium">{song.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="md:hidden w-full bg-gray-700 text-white py-2 rounded-b fixed bottom-[56px]" // Mobile only button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
        >
          {isQueueOpen ? 'Hide Queue' : 'Show Queue'}
        </button>
      </main>

      <Play videoId={videoId} title={title} thumbnail={thumbnail} />
    </div>
  );
};

export default CurrentTrake;