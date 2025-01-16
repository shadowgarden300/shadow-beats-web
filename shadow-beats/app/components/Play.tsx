'use client';

import React, { useEffect, useState, useRef } from 'react';
import { fetchSongStreams } from '../src/FetchSongStreams';
import { FaStepForward, FaPlay, FaPause } from 'react-icons/fa';

interface StreamData {
  audio_stream_url: string;
  video_stream_url: string;
}

interface SongProp {
  videoId: string;
  title: string;
  thumbnail: string;
}

const Play = ({ videoId, title, thumbnail }: SongProp) => {
  const [songStreams, setSongStreams] = useState<StreamData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSongStreams(videoId);
        setSongStreams(data);
      } catch (error) {
        console.error('Error fetching stream data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [videoId]);

  useEffect(() => {
    if (songStreams && audioRef.current) {
      audioRef.current.play().catch(error => {
        // Handle autoplay errors (e.g., browser restrictions)
        console.error("Autoplay prevented:", error);
        // Optionally, show a message to the user or provide a play button
        setIsPlaying(false)
      });
      setIsPlaying(true); // Set isPlaying to true after successful autoplay
    }
  }, [songStreams]);

  if (loading) {
    return (
      <div className="fixed bottom-0 w-full bg-gray-900 text-white py-4 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!songStreams) {
    return (
      <div className="fixed bottom-0 w-full bg-gray-900 text-white py-4 text-center">
        <p>No stream data available</p>
      </div>
    );
  }

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  };

  
  return (
    <div className="fixed bottom-0 w-full bg-gray-900 text-white flex items-center px-4 py-3 shadow-lg">
      <div className="flex items-center space-x-3 w-1/4 min-w-[100px]">
        <img
          src={thumbnail}
          alt="Song Thumbnail"
          className="w-10 h-10 object-cover rounded"
        />
        <div className="truncate">
          <p className="font-bold text-sm line-clamp-2">{truncateTitle(title, 25)}</p>
          <p className="text-xs text-gray-400">Now Playing</p>
        </div>
      </div>

      <div className="flex-grow mx-2">
        <audio
          ref={audioRef}
          controls
          className="w-full h-8 bg-transparent"
          style={{ outline: 'none' }}
        >
          <source src={songStreams.audio_stream_url} type="audio/mp4" />
          Your browser does not support the audio tag.
        </audio>
      </div>

      <div className="flex items-center w-1/6 min-w-[80px]">
        <button
          className="text-white text-2xl hover:text-gray-400"
          onClick={() => console.log('Next song functionality')}
        >
          <FaStepForward />
        </button>

      </div>
    </div>
  );
};

export default Play;