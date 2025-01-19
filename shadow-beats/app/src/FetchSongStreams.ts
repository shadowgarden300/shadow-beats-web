import { getCache, storeCache } from "./client-cache";

const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const fetchSongStreams = async (videoId: string): Promise<StreamData> => {
   
   const cachedInLocalStorage = getCache(videoId);
   if (cachedInLocalStorage) {
     return cachedInLocalStorage;
   }
 
   console.log("Fetching fresh data for videoId:", videoId);
   const response = await fetch(`${base_url}/api/info?id=${videoId}`,{ cache: 'no-store' });
   const streamData: StreamData = await response.json();
 
   storeCache(videoId,streamData);
 
   return streamData;
 };
