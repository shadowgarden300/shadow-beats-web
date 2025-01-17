'use client';

import React, { useEffect, useState, useRef } from 'react';
import { fetchSongStreams } from '../src/FetchSongStreams';
import { FaStepForward } from 'react-icons/fa';

interface StreamData {
  audio_stream_url: string;
  video_stream_url: string;
}

interface SongProp {
  videoId: string,
  title: string,
  thumbnail: string,
  setVideoUrl: Function,
  setAudioIsPlaying: Function,
  setAudioCurrentTime: Function,
  isVideoPlaying:boolean,
  videoCurrentTime:number
  
}

const Play = ({
  videoId,
  title,
  thumbnail,
  setVideoUrl,
  setAudioIsPlaying,
  setAudioCurrentTime,
  isVideoPlaying,
  videoCurrentTime
}: SongProp) => {
  const [songStreams, setSongStreams] = useState<StreamData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSongStreams(videoId);
        setSongStreams(data);
        setVideoUrl(data.video_stream_url);
        if(audioRef.current){
            audioRef.current.play();
        }
      } catch (error) {
        console.error('Error fetching stream data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [videoId]);

  // Attach audio event listeners
  useEffect(() => {
    if(loading) return;
    const audio = audioRef.current;
    if (!audio) {
      console.error('Audio element is null');
      return;
    }
    

    const handleTimeUpdate = () => {
      if(isVideoPlaying){
        audio.pause();
      }
      setAudioCurrentTime(audio.currentTime);
      console.log(`Current Audio Time: ${audio.currentTime.toFixed(2)} seconds`);
     
    };

    const handlePlay = () => {
      audio.currentTime = videoCurrentTime > audio.currentTime ? videoCurrentTime:audio.currentTime;

      setAudioIsPlaying(true);
      
    };

    const handlePause = () => {
      setAudioIsPlaying(false);
      setAudioCurrentTime(audio.currentTime);
    };

    // Attach event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Cleanup event listeners on unmount
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [loading,isVideoPlaying,videoCurrentTime]);

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
          <source src={songStreams.video_stream_url} type='audio/mp4' />
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
