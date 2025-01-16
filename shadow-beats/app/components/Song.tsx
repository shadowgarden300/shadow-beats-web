'use client'
import { useRouter } from 'next/navigation'; // Using Next.js's useRouter for client-side navigation
import React from 'react';

interface SongProp {
  song: PlaylistItem;
}

function Song({ song }: SongProp) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to the /play page with the videoId
    router.push(`/play?id=${song.snippet.resourceId.videoId}&title=${song.snippet.title}&thumbnail=${song.snippet.thumbnails.maxres.url}`);
  };

  return (
    <>
      <div key={song.id} onClick={handleClick} className="flex flex-col items-center flex-shrink-0">
        <div className="w-32 h-48 rounded-xl flex items-center justify-center mb-3">
          <img
            src={song.snippet.thumbnails.maxres.url}
            alt={song.snippet.title}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <p className="text-center font-small w-32 overflow-hidden text-ellipsis">
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
    </>
  );
}

export default Song;
