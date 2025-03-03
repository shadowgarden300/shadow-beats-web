import React from 'react';
import { fetchPlayListSongs } from '../src/FetchPlayListSongs';
import { convertPlayListItemsToSongs, SongItem } from '../interfaces/Song'; // Client Component
import Navbar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import PlayListManager from '../components/PlayListManager';

interface Props {
  searchParams: { playListName?: string }; // This is injected by Next.js
}

export default async function PlayListSongs({ searchParams }: Props) {
  const playlistName = await searchParams.playListName;

  if (!playlistName) {
    return (
      <div className="bg-gray-800 text-white min-h-screen">
        <Navbar />
        <Sidebar />
        <main className="pt-16 px-6 md:ml-16">
          <p>Please provide a playlist name in the query parameters.</p>
        </main>
      </div>
    );
  }

  // Fetch playlist data on the server
  const playListItems = await fetchPlayListSongs(playlistName);
  const songs = convertPlayListItemsToSongs(playListItems);

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="pt-16 px-6 md:ml-16">
        {/* Pass songs to the client component */}
        <PlayListManager initialSongs={songs} playlistName={playlistName} />
      </main>
    </div>
  );
}
