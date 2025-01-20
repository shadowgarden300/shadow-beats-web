import path from "path";
import { SongItem } from "../interfaces/Song";
import { fetchPlayListSongs } from "./FetchPlayListSongs";
import fs from "fs";
import { CACHE_DIR } from "./server-cache";


// Ensure the cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

export async function addToPlayList(name: string, song: SongItem): Promise<void> {
  // Fetch the current liked songs or initialize an empty array
  const likedSongs: PlaylistItem[] = await fetchPlayListSongs(name);

  // Check if the song is already in the playlist
  const songExists = likedSongs.some((item) => item.snippet.resourceId.videoId === song.id);
  if (songExists) {
    console.log(`Song "${song.title}" is already in the playlist "${name}".`);
    return;
  }

  // Convert SongItem to PlaylistItem
  const newPlaylistItem: PlaylistItem = {
    id: song.id,
    snippet: {
      publishedAt: new Date().toISOString(),
      channelId: "dummy-channel-id",
      title: song.title,
      description: "This is a liked song",
      thumbnails: {
        default: { url: song.thumbnail, width: 120, height: 90 },
        medium: { url: song.thumbnail, width: 320, height: 180 },
        high: { url: song.thumbnail, width: 480, height: 360 },
        standard: { url: song.thumbnail, width: 640, height: 480 },
        maxres: { url: song.thumbnail, width: 1280, height: 720 },
      },
      channelTitle: "dummy-channel-title",
      playlistId: name,
      position: likedSongs.length,
      resourceId: {
        kind: "youtube#video",
        videoId: song.id,
      },
      videoOwnerChannelTitle: "dummy-owner-title",
      videoOwnerChannelId: "dummy-owner-id",
    },
  };

  // Add the new playlist item
  likedSongs.push(newPlaylistItem);

  // Write the updated playlist back to the file
  const playlistFilePath = path.join(CACHE_DIR, `${name}.json`);
  fs.writeFileSync(playlistFilePath, JSON.stringify(likedSongs, null, 2), "utf-8");
  console.log(`Song "${song.title}" has been added to the playlist "${name}".`);
}

export async function removeFromPlayList(name: string, songId: string): Promise<void> {
  // Fetch the current liked songs or initialize an empty array
  const likedSongs: PlaylistItem[] = await fetchPlayListSongs(name);

  // Filter out the song to be removed
  const updatedSongs = likedSongs.filter((item) => item.snippet.resourceId.videoId !== songId);

  if (updatedSongs.length === likedSongs.length) {
    console.log(`Song with ID "${songId}" was not found in the playlist "${name}".`);
    return;
  }

  // Write the updated playlist back to the file
  const playlistFilePath = path.join(CACHE_DIR, `${name}.json`);
  fs.writeFileSync(playlistFilePath, JSON.stringify(updatedSongs, null, 2), "utf-8");
  console.log(`Song with ID "${songId}" has been removed from the playlist "${name}".`);
}
