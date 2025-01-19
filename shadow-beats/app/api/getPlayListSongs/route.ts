// app/api/getPlayListSongs/route.ts

import { fetchPlayListSongs } from '@/app/src/FetchPlayListSongs';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const playListId = searchParams.get('playListId');

  if (!playListId) {
    return NextResponse.json({ error: 'playListId is required' }, { status: 400 });
  }

  try {
    const playListItems = await fetchPlayListSongs(playListId);
    return NextResponse.json(playListItems);
  } catch (error) {
    console.error('Error fetching playlist songs:', error);
    return NextResponse.json({ error: 'Failed to fetch playlist songs' }, { status: 500 });
  }
}
