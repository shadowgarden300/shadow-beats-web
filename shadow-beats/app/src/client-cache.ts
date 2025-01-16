export const inMemoryCache = new Map<string, { data: StreamData; timestamp: number }>(); // In-memory cache
export const CACHE_DURATION = 24 * 60 * 60 * 1000; // Cache duration in milliseconds (24 hours)
export const MAX_CACHE_SIZE = 5; // Maximum number of items in in-memory cache

// Function to manage in-memory cache size (FIFO eviction)
export const manageCacheSize = () => {
  if (inMemoryCache.size > MAX_CACHE_SIZE) {
    // Remove the oldest cache entry
    const firstKey = inMemoryCache.keys().next().value;
    if(firstKey){
        inMemoryCache.delete(firstKey);
    }
  }
};

// Function to check localStorage for cached data (read-only)
export const getFromLocalStorage = (key: string): StreamData | null => {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log("Using localStorage cache for videoId:", key);
      return data; // Return cached data if still valid
    }
  }
  return null;
};


