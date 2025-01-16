import { CACHE_DURATION, getFromLocalStorage, inMemoryCache, manageCacheSize } from "./client-cache";

const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const fetchSongStreams = async (videoId: string): Promise<StreamData> => {
   // Step 1: Check in-memory cache
   const cachedInMemory = inMemoryCache.get(videoId);
   if (cachedInMemory && Date.now() - cachedInMemory.timestamp < CACHE_DURATION) {
     console.log("Using in-memory cache for videoId:", videoId);
     return cachedInMemory.data; // Return from in-memory cache
   }
 
   // Step 2: Check localStorage (read-only)
   const cachedInLocalStorage = getFromLocalStorage(videoId);
   if (cachedInLocalStorage) {
     console.log("Using localStorage cache for videoId:", videoId);
     // Add to in-memory cache for faster future access
     inMemoryCache.set(videoId, { data: cachedInLocalStorage, timestamp: Date.now() });
     manageCacheSize();
     return cachedInLocalStorage;
   }
 
   // Step 3: Fetch fresh data from the server
   console.log("Fetching fresh data for videoId:", videoId);
   const response = await fetch(`${base_url}/api/info?id=${videoId}`);
   const streamData: StreamData = await response.json();
 
   // Store in in-memory cache only (no localStorage writes)
   inMemoryCache.set(videoId, { data: streamData, timestamp: Date.now() });
   manageCacheSize(); // Manage in-memory cache size
 
   return streamData;
 };
