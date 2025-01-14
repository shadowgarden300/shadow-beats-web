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
        <div className="flex space-x-6 overflow-x-scroll scrollbar-hide w-full"> {/* Added w-full to prevent overflow */}
          {songs.map((song: any) => (
            <div key={song.id} className="flex flex-col items-center flex-shrink-0"> {/* flex-shrink-0 prevents shrinking */}
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
          ))}
        </div>
      </div>
    </>
  );
};

export default Songs;
