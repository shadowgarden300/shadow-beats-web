export const inMemoryCache = new Map<string, { data: StreamData; timestamp: number }>();

export const getCache = (key: string): StreamData | null => {
  const cachedInMemory = inMemoryCache.get(key);
  if (cachedInMemory && Date.now() / 1000 < cachedInMemory.timestamp) {
    console.log("Using in-memory cache for videoId:", key);
    return cachedInMemory.data;
  }

  const localStorageCache = JSON.parse(localStorage.getItem("cache") || "[]") as {
    key: string;
    data: { data: StreamData; timestamp: number };
  }[];
  const cached = localStorageCache.find((entry) => entry.key === key);

  if (cached && Date.now() / 1000 < cached.data.timestamp) {
    console.log("Using localStorage cache for videoId:", key);
    return cached.data.data;
  }

  return null;
};

function getExpirationTimestamp(url: string): number | null {
  try {
    const urlObj = new URL(url);
    const expireParam = urlObj.searchParams.get("expire");
    return expireParam ? parseInt(expireParam, 10) : null;
  } catch {
    return null;
  }
}

export const storeCache = (key: string, streamData: StreamData): void => {
  let expire = getExpirationTimestamp(streamData.video_stream_url);

  if (!expire) {
    expire = Math.floor(Date.now() / 1000) + 5 * 60;
  }

  const cacheData = {
    data: streamData,
    timestamp: expire, // Always store timestamp in seconds
  };

  inMemoryCache.set(key, cacheData);

  const localStorageCache = JSON.parse(localStorage.getItem("cache") || "[]") as {
    key: string;
    data: { data: StreamData; timestamp: number };
  }[];

  localStorageCache.push({ key, data: cacheData });

  if (localStorageCache.length > 10) {
    localStorageCache.shift();
  }

  localStorage.setItem("cache", JSON.stringify(localStorageCache));
};
