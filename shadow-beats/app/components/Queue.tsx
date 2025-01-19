'use client';

import React, { useEffect, useState } from 'react';
import Song from './Song';
import { fetchSongStreams } from '../src/FetchSongStreams';
import { convertPlayListItemsToSongs, SongItem } from '../interfaces/Song';

interface Props {
  playListId: string | null;
  currentSongId: string;
  setNextSong: Function;
  playNextSong: boolean;
  isMobileQueueVisible: boolean;
}

const Queue = ({ playListId, currentSongId, setNextSong, playNextSong, isMobileQueueVisible }: Props) => {
  const [queue, setQueue] = useState<SongItem[]>([]);
  const [preloadedStreams, setPreloadedStreams] = useState<Map<string, StreamData>>(new Map());

  // Fetch the playlist and set the queue
  useEffect(() => {
    const fetchQueue = async () => {
      if (!playListId) return;
      try {
        const response = await fetch(`/api/getPlayListSongs?playListId=${playListId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch playlist songs');
        }
        const playListItems = await response.json();
        const songs = convertPlayListItemsToSongs(playListItems);
        setQueue(songs);
      } catch (error) {
        console.error('Error fetching playlist songs:', error);
      }
    };

    fetchQueue();
  }, [playListId]);

  // Preload the next three songs in the background
  useEffect(() => {
    const preloadNextSongs = async () => {
      if (!queue.length || !currentSongId) return;

      const currentIndex = queue.findIndex((song) => song.id === currentSongId);
      if (currentIndex === -1) return;

      const nextSongs = queue.slice(currentIndex + 1, currentIndex + 4); // Get the next 3 songs
      const preloaded = await Promise.all(
        nextSongs.map(async (song) => {
          try {
            const streamData = await fetchSongStreams(song.id);
            return { songId: song.id, streamData };
          } catch (error) {
            console.error(`Error preloading song stream for ${song.title}:`, error);
            return null;
          }
        })
      );
      const preloadedMap = new Map<string, StreamData>(
        preloaded.filter((data): data is { songId: string, streamData: StreamData } => data !== null)
          .map((data) => [data.songId, data.streamData])
      );
      setPreloadedStreams(preloadedMap);
    };

    preloadNextSongs();
  }, [currentSongId]);

  // Handle playNextSong trigger
  useEffect(() => {
    if (!playNextSong || queue.length <= 0 || !preloadedStreams) return;

    const playNext = async () => {
      const currentIndex = queue.findIndex((song) => song.id === currentSongId);
      if (currentIndex === -1 || currentIndex + 1 >= queue.length) return;

      const nextSong = queue[currentIndex + 1];
      let streamData = preloadedStreams.get(nextSong.id);

      if (!streamData) {
        try {
          streamData = await fetchSongStreams(nextSong.id);
        } catch (error) {
          console.error(`Error fetching next song stream for ${nextSong.title}:`, error);
        }
      }

      setNextSong({ songItem: nextSong, songStream: streamData });
    };

    playNext();
  }, [playNextSong]);

  const handleSongClick = async (song: SongItem) => {
    // When a song is clicked, fetch the stream data and set it as the next song
    const streamData = await fetchSongStreams(song.id);
    setNextSong({ songItem: song, songStream: streamData });
  };

  return (
    <aside
      className="flex flex-col bg-gray-800 text-white p-4 rounded-lg shadow-lg h-full overflow-y-auto"
    >
      {/* Queue Content */}
      <div
        className={`${
          isMobileQueueVisible ? 'block' : 'hidden'
        } md:block flex-grow overflow-y-auto`}
      >
        <h1 className="text-2xl font-bold p-3">Queue</h1>
        {queue.map((song) => (
          <div key={song.id} className="p-2" onClick={() => handleSongClick(song)}>
            <Song song={song} layout="list" />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Queue;
