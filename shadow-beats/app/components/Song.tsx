'use client'
import { useRouter } from 'next/navigation'; // Using Next.js's useRouter for client-side navigation
import React from 'react';

interface SongProp {
  song: PlaylistItem;
}

function Song({ song }: SongProp) {
  const router = useRouter();

  const resolveThumbnailUrl = () =>{
    if(song.snippet.thumbnails.maxres) return song.snippet.thumbnails.maxres.url;
    else if(song.snippet.thumbnails.high) return song.snippet.thumbnails.high.url;
    else if(song.snippet.thumbnails.medium)return song.snippet.thumbnails.medium.url;
    else if(song.snippet.thumbnails.standard) return song.snippet.thumbnails.standard.url;
    else return song.snippet.thumbnails.default.url;
  }

  const thumbnail = resolveThumbnailUrl();

  const handleClick = () => {
    // Navigate to the /play page with the videoId
    router.push(`/play?id=${song.snippet.resourceId.videoId}&title=${song.snippet.title}&thumbnail=${thumbnail}`);
  };

  return (
    <>
      <div key={song.id} onClick={handleClick} className="flex flex-col items-center flex-shrink-0">
        <div className="w-32 h-48 rounded-xl flex items-center justify-center mb-3">
          <img
            src={thumbnail}
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
