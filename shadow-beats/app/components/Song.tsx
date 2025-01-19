'use client';
import { useRouter } from 'next/navigation'; // Using Next.js's useRouter for client-side navigation
import React from 'react';
import { SongItem } from '../interfaces/Song';

interface SongProp {
  song: SongItem;
  layout?: 'grid' | 'list'; // Supports grid or list layout
}

function Song({ song, layout = 'grid' }: SongProp) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to the /play page with the videoId
    router.push(`/play?id=${song.id}&title=${song.title}&thumbnail=${song.thumbnail}&playListId=${song.playListId}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer p-4 rounded-lg bg-gray-700 hover:bg-gray-400 transition ${
        layout === 'list' ? 'flex items-center space-x-4' : 'flex flex-col items-center'
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`${
          layout === 'list' ? 'w-16 h-16 flex-shrink-0' : 'w-32 h-48 mb-3'
        } rounded-lg overflow-hidden`}
      >
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Song Title */}
      <p
        className={`${
          layout === 'list' ? 'flex-grow text-base' : 'text-center font-small w-32'
        } overflow-hidden text-ellipsis`}
      >
        {song.title
          .replace(/\(Official Video\)/gi, '')
          .replace(/\(Official Music Video\)/gi, '')
          .replace(/\(Official Lyric Video\)/gi, '')
          .replace(/\(Full Video\)/gi, '')
          .replace(/Video/gi, '')
          .replace(/Song/gi, '')
          .replace(/\s*\|.*/g, '')}
      </p>
    </div>
  );
}

export default Song;
