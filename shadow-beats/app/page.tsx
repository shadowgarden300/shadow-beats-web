import React, { useState } from 'react';
import Navbar from './components/NavBar';
import Sidebar from './components/SideBar';
import Songs from './components/Songs';
import { fetchPlayListSongs } from './src/FetchPlayListSongs';


const Home: React.FC  = async () => {
  const globalHits = await fetchPlayListSongs("The+Hit+List");
  const bollywoodHits = await fetchPlayListSongs("Bollywood+Hitlist");
  const koreanHits = await fetchPlayListSongs("K-HITLIST");
  const recent = (await fetchPlayListSongs("The+Hit+List")).slice(0,3);

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="pt-16 px-6 md:ml-16">
        <Songs playListSongs={recent} title={"Recently played"} />
        <Songs playListSongs={globalHits} title={"Global Hits"} />
        <Songs playListSongs={koreanHits} title={"Korean Hits"} />
        <Songs playListSongs={bollywoodHits} title={"Bollywood Hits"} />
      </main>
      {/* <Play videoId='eVli-tstM5E'/> */}
    </div>
  );
};

export default Home;
