import { SearchItem } from "../interfaces/SearchItem";
import { getFromCache, setCache } from "./server-cache";

const KEY = process.env.YOUTUBE_API_KEY;

export  const fetchSearchResults = async (query:string): Promise<SearchItem[]|null> => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query.replace(" ","+")}&type=video&key=${KEY}&maxResults=7`
  );
  const data = await res.json();
  if (data.items && data.items.length > 0) {
    const searchResults:SearchItem[] = data.items;
    return searchResults;
  }
  return null;
};