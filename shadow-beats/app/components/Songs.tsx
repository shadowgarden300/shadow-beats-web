import React from 'react';

interface SongsProps {
  songs: PlaylistItem[];
  title: string;
}

const Songs: React.FC<SongsProps> = ({ songs, title }) => {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <div className="my-8">
        <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
          {songs.map((song: any) => (
            <div key={song.id} className="flex flex-col items-center">
              <div className="flex-shrink-0 w-40 h-56 rounded-lg flex items-center justify-center mb-2">
                <img
                  src={song.snippet.thumbnails.maxres.url}
                  alt={song.snippet.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center font-small w-40 overflow-hidden text-ellipsis">
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
          ))}
        </div>
      </div>
    </>
  );
};

export default Songs;
