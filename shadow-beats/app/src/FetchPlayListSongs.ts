import { getFromCache, setCache } from "./server-cache";

const KEY = process.env.YOUTUBE_API_KEY;
const maxResults = 10;


const fetchPlaylistId = async (name:string): Promise<string | null> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?q=${name}&type=playlist&key=${KEY}`
    , { cache: 'no-store' });
  const data = await res.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].id.playlistId;
  }
  return null;
};

const fetchPlaylistVideos = async (playlistId: string): Promise<any[]> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${KEY}`
  , { cache: 'no-store' });
  const data = await res.json();
  return data.items; 
};

export const fetchPlayListSongs = async (name: string): Promise<PlaylistItem[]> => {

  const cachedData = getFromCache<PlaylistItem[]>(name);
  if (cachedData) {
    return cachedData;
  }

  const playlistId = await fetchPlaylistId(name);
  let songs: PlaylistItem[] = [];
  if (playlistId) {
    songs = await fetchPlaylistVideos(playlistId);
  }

  setCache(name, songs);

  return songs;
};
