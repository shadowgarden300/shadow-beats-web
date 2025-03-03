import React from 'react';
import Song from './Song';
import { convertPlayListItemsToSongs, SongItem } from '../interfaces/Song';

interface SongsProps {
  playListSongs: PlaylistItem[];
  title: string;
}

const Songs: React.FC<SongsProps> = ({ playListSongs, title }) => {
  
  const songs = convertPlayListItemsToSongs(playListSongs);
  
  return (
    <>
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <div className="my-8">
        <div className="flex space-x-6 overflow-x-scroll scrollbar-hide w-full"> {/* Added w-full to prevent overflow */}
          {songs.map((song: SongItem) => (
            // Add the key prop here to ensure each Song component has a unique key
            <Song key={song.id} song={song} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Songs;
