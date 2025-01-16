import fs from 'fs';
import path from 'path';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const FILE_WRITE_INTERVAL = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
const CACHE_DIR = path.resolve(__dirname, 'cache'); // Path to the cache directory

// In-memory cache (for fast lookups)
export const memoryCache = new Map<string, { data: any; expiry: number }>();

// Ensure the cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

// Function to load the cache from the file system on app startup
export const loadCacheFromFile = () => {
  const files = fs.readdirSync(CACHE_DIR);
  files.forEach((file) => {
    const cacheFilePath = path.join(CACHE_DIR, file);
    const fileContent = fs.readFileSync(cacheFilePath, 'utf-8');
    const parsedCache = JSON.parse(fileContent);

    // Check if the cache is still valid, and load it into memory
    if (parsedCache.expiry > Date.now()) {
      memoryCache.set(file, parsedCache); // Store in memory if valid
    }
  });
};

// Periodically write the cache to files (every 5 hours)
export const writeCacheToFile = () => {
  memoryCache.forEach((cacheEntry, key) => {
    const cacheFilePath = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheEntry), 'utf-8');
  });
};

// Periodically clear expired cache (every hour)
export const clearExpiredCache = () => {
  const now = Date.now();
  memoryCache.forEach((cacheEntry, key) => {
    if (cacheEntry.expiry <= now) {
      memoryCache.delete(key); // Delete from memory
      const cacheFilePath = path.join(CACHE_DIR, `${key}.json`);
      if (fs.existsSync(cacheFilePath)) {
        fs.unlinkSync(cacheFilePath); // Delete expired cache file
      }
    }
  });
};

// Function to get data from cache (checks both memory and file)
export const getFromCache = <T>(key: string): T | null => {
  // First, check in-memory cache
  const cachedData = memoryCache.get(key);

  if (cachedData) {
    console.log(`Cache hit (memory) for ${key}`);
    return cachedData.data; // Return cached data if valid
  }

  // If not in memory, check the file-based cache
  const cacheFilePath = path.join(CACHE_DIR, `${key}.json`);
  if (fs.existsSync(cacheFilePath)) {
    const fileContent = fs.readFileSync(cacheFilePath, 'utf-8');
    const parsedCache = JSON.parse(fileContent);

    if (parsedCache.expiry > Date.now()) {
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

// Initialize the cache by loading it from the file on app start
loadCacheFromFile();

// Set up periodic cache writing and expiry clearing
setInterval(writeCacheToFile, FILE_WRITE_INTERVAL);
setInterval(clearExpiredCache, 60 * 60 * 1000); // Clear expired cache every 1 hour
