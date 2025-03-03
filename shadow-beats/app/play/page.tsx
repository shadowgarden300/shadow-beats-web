'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import Play from '../components/Play';
import { useSearchParams } from 'next/navigation';
import { fetchSongStreams } from '../src/FetchSongStreams';
import Queue from '../components/Queue';
import { SongData, SongItem } from '../interfaces/Song';

const CurrentTrake = () => {
  const searchParams = useSearchParams();
  const [videoId, setVideoId] = useState<string | null>(searchParams.get('id'));
  const [title, setTitile] = useState<string | null>(searchParams.get('title'));
  const [thumbnail, setThumbnail] = useState<string | null>(
    searchParams.get('thumbnail')
  );
  const [playListId, setPlayListId] = useState<string|null>(
    searchParams.get('playListId')
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentTrake, setCurrentTrake] = useState<StreamData | null>(null);
  const [nextSong, setNextSong] = useState<SongData | null>(null);
  const [isMobileQueueVisible, setIsMobileQueueVisible] = useState(true); 
  const [playNextSong, setPlayNextSong] = useState<boolean>(false);
  const [loading, setLoading] = useState(true); // State for loading status
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [isAudioPlaying, setAudioIsPlaying] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (videoId) {
        try {
          const data = await fetchSongStreams(videoId);
          setCurrentTrake(data); // Set the fetched data
        } catch (error) {
          console.error('Error fetching song streams:', error);
        } finally {
          setLoading(false); // Mark loading as complete
        }
      }
    };

    fetchData();
  }, [videoId]);

  useEffect(() => {
    if (nextSong) {
      setCurrentTrake(nextSong.songStream);
      if (videoRef.current) {
        
        videoRef.current.load();
        setVideoCurrentTime(0);
        setAudioCurrentTime(0);

      }
      setIsVideo(false);
      setVideoId(nextSong.songItem.id);
      setTitile(nextSong.songItem.title);
      setThumbnail(nextSong.songItem.thumbnail);
      setPlayListId(nextSong.songItem.playListId);
      setPlayNextSong(false); // Reset playNextSong after it triggers
    }
  }, [nextSong]);

  useEffect(() => {
    setIsVideoPlaying(isVideo);
    if (isVideo) {
      const video = videoRef.current;
      if (video) {
        video.play().catch((error) => {
          //console.error('Error playing video:', error);
        });
      }
    }
  }, [isVideo]);

  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;

    if (!video) {
      console.error('Video element is not found');
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
  }, [isVideo, isAudioPlaying, audioCurrentTime, videoCurrentTime, currentTrake]);

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
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
    <Navbar />
    <Sidebar />
    <main className="flex-grow flex flex-col md:flex-row pt-8 px-4 md:px-8 pb-16 md:pb-0 items-center " >
      {/* Video/Image Section */}
      <div className="flex-grow md:w-2/3 flex flex-col items-center p-3">
        <div className="w-full max-w-4xl h-[80vh]"> {/* Set height to 80% */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 h-full flex flex-col">
            {/* Title and Toggle Button */}
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <button
                disabled={!currentTrake}
                onClick={() => setIsVideo(!isVideo)}
                className={`bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-300 ${
                  !currentTrake ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isVideo ? 'Audio' : 'Video'}
              </button>
            </div>
  
            {/* Image/Video Section */}
            <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-black">
              {isVideo ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  controls
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onTimeUpdate={() =>
                    setVideoCurrentTime(videoRef.current?.currentTime || 0)
                  }
                >
                  {currentTrake && (
                    <source
                      src={currentTrake.video_stream_url}
                      type="video/mp4"
                    />
                  )}
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </div>
  
      {/* Queue Section */}
      <button
        className="md:hidden bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded mb-4"
        onClick={() => setIsMobileQueueVisible(!isMobileQueueVisible)}
      >
        {isMobileQueueVisible ? 'Hide Queue' : 'Show Queue'}
      </button>
      <div className={`${
          isMobileQueueVisible ? 'block' : 'hidden'
        } md:w-1/3 w-full h-[83vh] overflow-y-auto p-3`}> 
        <Queue
          playListId={playListId}
          currentSongId={videoId}
          playNextSong={playNextSong}
          setNextSong={setNextSong}
          isMobileQueueVisible = {isMobileQueueVisible}
          setLoading={setLoading}
        />
        
      </div>
    </main>
  
    {/* Bottom Bar */}
    {loading ? (
      <div className="fixed bottom-0 w-full bg-gray-900 text-white py-4 text-center">
        <p>Loading...</p>
      </div>
    ) : (
      currentTrake && (
        <Play
          song={
            {
              id:videoId,
              thumbnail:thumbnail,
              playListId:playListId?playListId:"",
              title:title
            }
          }
          setPlayNextSong={setPlayNextSong}
          currentTrake={currentTrake}
          title={title}
          thumbnail={thumbnail}
          setAudioIsPlaying={setAudioIsPlaying}
          setAudioCurrentTime={setAudioCurrentTime}
          isVideoPlaying={isVideoPlaying}
          videoCurrentTime={videoCurrentTime}
          isVideo={isVideo}
        />
      )
    )}
  </div>
  

  );
};

export default CurrentTrake;
