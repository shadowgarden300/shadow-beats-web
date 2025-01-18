import React from 'react';
import Navbar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import { fetchSearchResults } from '../src/FetchSearchResults';
import { convertSearchItemsToPlaylistItems, SearchItem } from '../interfaces/SearchItem';
import Song from '../components/Song'; // Reusable Song component

interface Props {
  searchParams: { query?: string }; // This is injected by Next.js
}

const SearchItems: React.FC<Props> = async ({ searchParams }) => {
  const query = searchParams.query;

  // If there's no query, return an empty state
  if (!query) {
    return (
      <div className="bg-gray-800 text-white min-h-screen flex items-center justify-center">
        <h2 className="text-2xl">No Search Query Provided</h2>
      </div>
    );
  }

  try {
    // Fetch search results from your API
    const searchResults: SearchItem[] | null = await fetchSearchResults(query);

    if (!searchResults) {
      return (
        <div className="bg-gray-800 text-white min-h-screen flex items-center justify-center">
          <h2 className="text-2xl">Error Fetching Search Results</h2>
        </div>
      );
    }

    // Convert SearchItems to PlaylistItems
    const playListItems = convertSearchItemsToPlaylistItems(searchResults);

    return (
      <div className="bg-gray-800 text-white min-h-screen">
        <Navbar />
        <Sidebar />
        <main className="pt-16 px-6 md:ml-16">
          <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
          {/* List Layout for Songs */}
          <div className="flex flex-col space-y-4">
            {playListItems.map((song) => (
              <Song key={song.id} song={song} layout="list" />
            ))}
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error fetching search results:', error);
    return (
      <div className="bg-gray-800 text-white min-h-screen flex items-center justify-center">
        <h2 className="text-2xl">Error Fetching Search Results</h2>
      </div>
    );
  }
};

export default SearchItems;

