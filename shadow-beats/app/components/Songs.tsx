import React from 'react';
import Song from './Song';

interface SongsProps {
  songs: PlaylistItem[];
  title: string;
}

const Songs: React.FC<SongsProps> = ({ songs, title }) => {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <div className="my-8">
        <div className="flex space-x-6 overflow-x-scroll scrollbar-hide w-full"> {/* Added w-full to prevent overflow */}
          {songs.map((song: PlaylistItem) => (
            // Add the key prop here to ensure each Song component has a unique key
            <Song key={song.id} song={song} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Songs;
