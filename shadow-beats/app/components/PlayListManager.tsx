'use client';

import React, { useState } from 'react';
import { FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { SongItem } from '../interfaces/Song';
import { useRouter } from 'next/navigation';

interface PlayListManagerProps {
  initialSongs: SongItem[];
  playlistName: string;
}

const PlayListManager: React.FC<PlayListManagerProps> = ({ initialSongs, playlistName }) => {
  const [songs, setSongs] = useState<SongItem[]>(initialSongs);
  const router = useRouter();

  // Remove song by calling the API
  const handleRemoveSong = async (songId: string) => {
    try {
      const res = await fetch('/api/playListManager/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playlistName, songId }),
      });

      if (!res.ok) {
        throw new Error('Failed to remove song');
      }

      setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
    } catch (error) {
      console.error('Error removing song:', error);
      alert('Failed to remove the song. Please try again.');
    }
  };

  // Rearrange songs in the playlist by calling the API
  const updateSongOrder = async (newSongs: SongItem[]) => {
    try {
      const res = await fetch('/api/playListManager/rearrange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playlistName, songs: newSongs }),
      });

      if (!res.ok) {
        throw new Error('Failed to update song order');
      }
    } catch (error) {
      console.error('Error updating song order:', error);
      alert('Failed to update the song order. Please try again.');
    }
  };

  // Move song up in the list
  const handleMoveUp = async (index: number) => {
    if (index > 0) {
      const newSongs = [...songs];
      [newSongs[index - 1], newSongs[index]] = [newSongs[index], newSongs[index - 1]];
      setSongs(newSongs);

      await updateSongOrder(newSongs);
    }
  };

  // Move song down in the list
  const handleMoveDown = async (index: number) => {
    if (index < songs.length - 1) {
      const newSongs = [...songs];
      [newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]];
      setSongs(newSongs);

      await updateSongOrder(newSongs);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className="p-4 rounded-lg bg-gray-700 hover:bg-gray-500 transition flex items-center space-x-4"
          onClick={()=> router.push(`/play?id=${song.id}&title=${song.title}&thumbnail=${song.thumbnail}&playListId=${song.playListId}`)}
        >
          {/* Thumbnail */}
          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
            <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
          </div>

          {/* Song Title */}
          <p className="flex-grow text-base overflow-hidden text-ellipsis">
            {song.title
              .replace(/\(Official Video\)/gi, '')
              .replace(/\(Official Music Video\)/gi, '')
              .replace(/\(Official Lyric Video\)/gi, '')
              .replace(/\(Full Video\)/gi, '')
              .replace(/Video/gi, '')
              .replace(/Song/gi, '')
              .replace(/\s*\|.*/g, '')}
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition flex items-center"
              onClick={() => handleRemoveSong(song.id)}
            >
              <FaTrash className="mr-1" />
              
            </button>
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition flex items-center"
              onClick={() => handleMoveUp(index)}
              disabled={index === 0}
            >
              <FaArrowUp className="mr-1" />
              
            </button>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition flex items-center"
              onClick={() => handleMoveDown(index)}
              disabled={index === songs.length - 1}
            >
              <FaArrowDown className="mr-1" />
              
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayListManager;
