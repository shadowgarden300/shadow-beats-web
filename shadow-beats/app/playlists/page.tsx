import React from 'react';
import Navbar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import { fetchUserPlayLists } from '../src/PlayListControl';
import { fetchPlayListSongs } from '../src/FetchPlayListSongs';
import Link from 'next/link';

async function PlayLists() {
  const thumbnail = 'liked.jpeg'; // Placeholder for thumbnails
  const lists = await fetchUserPlayLists();
  console.log(lists);

  
  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="pt-16 px-6 md:ml-16">
        <h1 className="text-xl font-bold mb-4">PlayLists</h1>
        <div className="my-8">
          <div className="flex space-x-6">
            {/* Resolve all playlist navigation links before rendering */}
            {await Promise.all(
              lists.map(async (name: string) => {
                const link = `/playlistSongs?playListName=${name.replace('.json','')}`;
                return link ? (
                  <Link
                    href={link}
                    key={name}
                    className="cursor-pointer p-4 rounded-lg bg-gray-700 hover:bg-gray-400 transition flex flex-col items-center"
                  >
                    <div className="w-32 h-48 mb-3 rounded-lg overflow-hidden">
                      <img
                        src={thumbnail || '/placeholder-thumbnail.jpg'} // Use a placeholder if no thumbnail
                        alt={name.replace('.json','').replaceAll('_','').replace('user_playlist','')}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-center font-small w-32 overflow-hidden text-ellipsis">
                      {name}
                    </p>
                  </Link>
                ) : (
                  // Handle empty playlists or errors
                  <div
                    key={name}
                    className="cursor-not-allowed p-4 rounded-lg bg-gray-700 opacity-50 flex flex-col items-center"
                  >
                    <div className="w-32 h-48 mb-3 rounded-lg overflow-hidden">
                      <img
                        src={thumbnail || '/placeholder-thumbnail.jpg'}
                        alt={name.replace('.json','').replaceAll('_','').replace('user_playlist','')}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-center font-small w-32 overflow-hidden text-ellipsis">
                      {name.replace('.json','').replace('user_playlist','').replaceAll('_','')}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PlayLists;
