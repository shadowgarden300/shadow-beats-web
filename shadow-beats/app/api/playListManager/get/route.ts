import { NextResponse } from 'next/server';
import { fetchPlayListSongs } from '@/app/src/FetchPlayListSongs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const playListId = searchParams.get('playListId');

    if (!playListId) {
      return NextResponse.json({ error: 'playListId is required' }, { status: 400 });
    }

    const playListItems = await fetchPlayListSongs(playListId);

    return NextResponse.json(playListItems);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return NextResponse.json({ error: error || 'Failed to fetch playlist' }, { status: 500 });
  }
}
