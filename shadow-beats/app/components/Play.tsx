
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { FaStepForward } from 'react-icons/fa';

interface SongProp {
  currentTrake:StreamData,
  title: string;
  thumbnail: string;
  setAudioIsPlaying: Function;
  setAudioCurrentTime: Function;
  isVideoPlaying: boolean;
  videoCurrentTime: number;
  isVideo: boolean;
  setPlayNextSong:Function;
}

const Play = ({
  title,
  thumbnail,
  setAudioIsPlaying,
  setAudioCurrentTime,
  isVideoPlaying,
  videoCurrentTime,
  isVideo,
  currentTrake,
  setPlayNextSong
}: SongProp) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isVideo) {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch((error) => {
         // console.error("Error playing audio:", error);
        });
      }
    }
  }, [isVideo,currentTrake]);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (isVideoPlaying) {
        audio.pause();
      }
      setAudioCurrentTime(audio.currentTime);

    };
    const handleAudioEnd = () => {
      setPlayNextSong(true); // Trigger next song when audio ends
    };
  
    const handlePlay = () => {
      audio.currentTime = videoCurrentTime > audio.currentTime ? videoCurrentTime : audio.currentTime;
      setAudioIsPlaying(true);
    };

    const handlePause = () => {
      setAudioIsPlaying(false);
      setAudioCurrentTime(audio.currentTime);
    };
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [isVideoPlaying,videoCurrentTime,currentTrake]);


  if (!currentTrake) {
    return (
      <div className="fixed bottom-0 w-full bg-gray-900 text-white py-4 text-center">
        <p>No stream data available</p>
      </div>
    );
  }

  const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
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
          <source src={currentTrake.video_stream_url} type="audio/mp4" />
          Your browser does not support the audio tag.
        </audio>
      </div>

      <div className="flex items-center w-1/6 min-w-[80px]">
        <button
          className="text-white text-2xl hover:text-gray-400"
          onClick={() => setPlayNextSong(true)}
        >
          <FaStepForward />
        </button>
      </div>
    </div>
  );
};

export default Play;
