const KEY = process.env.YOUTUBE_API_KEY;

const fetchPlaylistId = async (name:string): Promise<string | null> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?q=${name}&type=playlist&key=${KEY}`
  );
  const data = await res.json();
  if (data.items && data.items.length > 0) {
    return data.items[0].id.playlistId;
  }
  return null;
};

const fetchPlaylistVideos = async (playlistId: string): Promise<any[]> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${KEY}`
  );
  const data = await res.json();
  return data.items; 
};

export const fetchPlayListSongs = async(name:string):Promise<PlaylistItem[]> =>{
  const playListId = await fetchPlaylistId(name);
  let songs: any[] = [];
  if (playListId) {
      songs = await fetchPlaylistVideos(playListId);
  }
  return songs;
}
