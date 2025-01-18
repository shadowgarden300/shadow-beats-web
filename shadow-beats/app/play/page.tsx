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

const CurrentTrake = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('id');
  const title = searchParams.get('title');
  const thumbnail = searchParams.get('thumbnail');

  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoUrl, setVideoUrl] = useState<string>();
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [isAudioPlaying, setAudioIsPlaying] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isVideo, setIsVideo] = useState<boolean>(false);

  useEffect(() => {
    setIsVideoPlaying(isVideo);
    if (isVideo) {
      const video = videoRef.current;
      if (video) {
        video.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    }
  }, [isVideo]);

  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;

    if (!video) {
      console.error("Video element is not found");
      return;
    }

    const handleTimeUpdate = () => {
      if (isAudioPlaying) {
        video.pause();
      }
      setVideoCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      video.currentTime = Math.max(videoCurrentTime, audioCurrentTime);
      setIsVideoPlaying(true);
    };

    const handlePause = () => {
      setVideoCurrentTime(video.currentTime);
      setIsVideoPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isVideo, isAudioPlaying, audioCurrentTime, videoCurrentTime]);

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
      <div className="bg-gray-900 text-white min-h-screen flex flex-col md:flex-row">
        <Navbar />
        <Sidebar />
        <main className="flex-grow pt-8 px-4 md:px-8 pb-16 md:pb-0 flex flex-col items-center justify-center"> {/* Key changes here */}
          <div className="w-full max-w-4xl">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <button
                  disabled={!videoUrl}
                  onClick={() => setIsVideo(!isVideo)}
                  className={`bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-300 ${!videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isVideo ? "Audio" : "Video"}
                </button>
              </div>

              <div className="w-full rounded-lg overflow-hidden">
                {isVideo ? (
                  <video
                    ref={videoRef}
                    className="w-full h-auto"
                    controls
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onTimeUpdate={() => setVideoCurrentTime(videoRef.current?.currentTime || 0)}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-auto"
                  />
                )}
              </div>
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

