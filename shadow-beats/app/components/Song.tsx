'use client';
import { useRouter } from 'next/navigation'; // Using Next.js's useRouter for client-side navigation
import React from 'react';

interface SongProp {
  song: PlaylistItem;
  layout?: 'grid' | 'list'; // Supports grid or list layout
}

function Song({ song, layout = 'grid' }: SongProp) {
  const router = useRouter();

  const resolveThumbnailUrl = () => {
    if (song.snippet.thumbnails.maxres) return song.snippet.thumbnails.maxres.url;
    else if (song.snippet.thumbnails.high) return song.snippet.thumbnails.high.url;
    else if (song.snippet.thumbnails.medium) return song.snippet.thumbnails.medium.url;
    else if (song.snippet.thumbnails.standard) return song.snippet.thumbnails.standard.url;
    else return song.snippet.thumbnails.default.url;
  };

  const thumbnail = resolveThumbnailUrl();

  const handleClick = () => {
    // Navigate to the /play page with the videoId
    router.push(`/play?id=${song.snippet.resourceId.videoId}&title=${song.snippet.title}&thumbnail=${thumbnail}`);
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
          src={thumbnail}
          alt={song.snippet.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Song Title */}
      <p
        className={`${
          layout === 'list' ? 'flex-grow text-base' : 'text-center font-small w-32'
        } overflow-hidden text-ellipsis`}
      >
        {song.snippet.title
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
