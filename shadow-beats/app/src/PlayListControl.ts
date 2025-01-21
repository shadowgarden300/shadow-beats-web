import path from "path";
import fs from "fs";
import { SongItem } from "../interfaces/Song";
import { fetchPlayListSongs } from "./FetchPlayListSongs";

const CACHE_DIR = path.resolve('./', 'cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

export async function addToPlayList(name: string, song: SongItem): Promise<void> {
  const playlistFilePath = path.join(CACHE_DIR, `${name}.json`);
  let existingData: { data: PlaylistItem[]; expiry: number | null } = { data: [], expiry: null };

  if (fs.existsSync(playlistFilePath)) {
    const fileContent = fs.readFileSync(playlistFilePath, "utf-8");
    existingData = JSON.parse(fileContent);
  }

  const likedSongs: PlaylistItem[] = existingData.data;
  const songExists = likedSongs.some((item) => item.snippet.resourceId.videoId === song.id);
  if (songExists) {
    return;
  }

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

  likedSongs.push(newPlaylistItem);

  const updatedData = {
    data: likedSongs,
    expiry: null,
  };

  fs.writeFileSync(playlistFilePath, JSON.stringify(updatedData, null, 2), "utf-8");
}

export async function removeFromPlayList(name: string, songId: string): Promise<void> {
  const playlistFilePath = path.join(CACHE_DIR, `${name}.json`);
  let existingData: { data: PlaylistItem[]; expiry: number | null } = { data: [], expiry: null };

  if (fs.existsSync(playlistFilePath)) {
    const fileContent = fs.readFileSync(playlistFilePath, "utf-8");
    existingData = JSON.parse(fileContent);
  }

  const likedSongs: PlaylistItem[] = existingData.data;
  const updatedSongs = likedSongs.filter((item) => item.snippet.resourceId.videoId !== songId);

  if (updatedSongs.length === likedSongs.length) {
    return;
  }

  const updatedData = {
    data: updatedSongs,
    expiry: existingData.expiry,
  };

  fs.writeFileSync(playlistFilePath, JSON.stringify(updatedData, null, 2), "utf-8");
}

export function fetchUserPlayLists() {
  try {
    const files = fs.readdirSync(CACHE_DIR);
    const matchingFiles = files.filter((file) => file.includes('user_playlist'));
    return matchingFiles;
  } catch (error) {
    return [];
  }
}

export function rearrangeSongs(name: string, songs: SongItem[]): void {
  const filePath = path.join(CACHE_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Playlist "${name}" does not exist.`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const existingData: { data: PlaylistItem[]; expiry: number | null } = JSON.parse(fileContent);

  const updatedData = {
    data: songs,
    expiry: existingData.expiry,
  };

  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf-8");
}
