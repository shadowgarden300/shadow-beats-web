'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import Play from '../components/Play';
import { useSearchParams } from 'next/navigation';

interface SongData {
  videoId: string;
  title: string;
  thumbnail: string;
}

interface PlayBackDetails {
  videoUrl: string;
  isPlaying: boolean;
  currentTime: number;
}

const CurrentTrake = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('id');
  const title = searchParams.get('title');
  const thumbnail = searchParams.get('thumbnail');

  const videoRef = useRef<HTMLVideoElement>(null);

  const [queue, setQueue] = useState<SongData[] | never[]>([]);
  const [video_url, setVideoUrl] = useState<string>();
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [isAudioPlaying, setAudioIsPlaying] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState(true);

  useEffect(() => {
    setIsVideoPlaying(isVideo);
    if(isVideo){
      if(videoRef.current){
        videoRef.current.play();
      }
    }
  }, [isVideo]);

  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;

    if (!video) {
      console.error("Video element is not found");
    }

    const handleTimeUpdate = () => {
      if (video) {
        if (isAudioPlaying) {
          video.pause();
        }
        setVideoCurrentTime(video.currentTime);
      }
    };

    const handlePlay = () => {
      if (video) {
        video.currentTime = video.currentTime > audioCurrentTime ? video.currentTime : audioCurrentTime;
        setIsVideoPlaying(true);
      }
    };

    const handlePause = () => {
      if (video) {
        setVideoCurrentTime(video.currentTime);
        setIsVideoPlaying(false);
      }
    };

    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      video.addEventListener('loadedmetadata', () => {
        console.log("Video duration:", video.duration);
      });
    }

    return () => {
      if (video) {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      }
    };
  }, [isVideo, isAudioPlaying, audioCurrentTime, isVideoPlaying, videoCurrentTime]);

  if (!videoId || !title || !thumbnail) {
    return (
      <div className="bg-gray-800 text-white min-h-screen">
        <Navbar />
        <Sidebar />
        <main className="ml-16 pt-16 px-6">
          <h1>Video ID is not provided</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col md:flex-row">
      <Navbar />
      <Sidebar />
      <main className="md:ml-16 pt-8 px-4 flex-grow flex flex-col items-center justify-center">
        <div className="relative w-full flex flex-col items-center">
          <div className="mb-4">
            <button disabled={!video_url}
              onClick={() => setIsVideo(!isVideo)}
              className="bg-gray-700 text-white py-2 px-4 rounded"
            >
              {isVideo ? 'Audio' : 'Video'}
            </button>
          </div>

          {/* Container for both video and image */}
          <div className="w-full max-w-3xl h-auto flex items-center justify-center p-2">
            {isVideo ? (
              <video
                ref={videoRef}
                className="w-full h-auto object-contain"
                controls
              >
                <source src={video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-auto object-contain"
              />
            )}
          </div>
        </div>
      </main>
      <Play
        videoId={videoId}
        title={title}
        thumbnail={thumbnail}
        setVideoUrl={setVideoUrl}
        setAudioIsPlaying={setAudioIsPlaying}
        setAudioCurrentTime={setAudioCurrentTime}
        isVideoPlaying={isVideoPlaying}
        videoCurrentTime={videoCurrentTime}
        isVideo={isVideo}
      />
    </div>
  );
};

export default CurrentTrake;

