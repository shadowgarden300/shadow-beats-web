import fs from 'fs';
import path from 'path';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const CACHE_DIR = path.resolve('./', 'cache'); // Path to the cache directory

// In-memory cache (for fast lookups)
export const memoryCache = new Map<string, { data: any; expiry: number }>();

// Ensure the cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}


// Periodically write the cache to files (every 5 hours)
export const writeCacheToFile = () => {
  memoryCache.forEach((cacheEntry, key) => {
    const cacheFilePath = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheEntry), 'utf-8');
  });
};

export const getFromCache = <T>(key: string): T | null => {
  console.log(`Cache directory: ${CACHE_DIR}`);
  const cachedData = memoryCache.get(key);

  if (cachedData) {
   
    if(!key.includes("user_playlist") && cachedData.expiry < Date.now()){
      return null;
    }
    console.log(`Cache hit (memory) for ${key}`);
    return cachedData.data; 
  }

  // If not in memory, check the file-based cache
  const cacheFilePath = path.join(CACHE_DIR, `${key}.json`);
  if (fs.existsSync(cacheFilePath)) {
    const fileContent = fs.readFileSync(cacheFilePath, 'utf-8');
    const parsedCache = JSON.parse(fileContent);

    if (key.includes('user_playlist') || parsedCache.expiry > Date.now()) {
      console.log(`Cache hit (file) for ${key}`);
      memoryCache.set(key, parsedCache); // Store in memory for future requests
      return parsedCache.data;
    } else {
      // If cache expired, delete the file
      fs.unlinkSync(cacheFilePath);
    }
  }

  return null; // Cache miss
};

// Function to store data in both memory and file
export const setCache = <T>(key: string, data: T): void => {
  const cacheEntry = {
    data,
    expiry: Date.now() + CACHE_DURATION, // Cache duration of 24 hours
  };

  // Store in memory
  memoryCache.set(key, cacheEntry);

  // Store in file (this will be written periodically)
  const cacheFilePath = path.join(CACHE_DIR, `${key}.json`);
  fs.writeFileSync(cacheFilePath, JSON.stringify(cacheEntry), 'utf-8');
};

