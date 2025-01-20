
import { addToPlayList } from '@/app/src/PlayListControl';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { playListId, song } = body;

    // Validate input
    if (!playListId || typeof playListId !== 'string') {
      return NextResponse.json({ error: 'playListId is required and must be a string' }, { status: 400 });
    }

    if (!song || typeof song.id !== 'string' || typeof song.title !== 'string' || typeof song.thumbnail !== 'string') {
      return NextResponse.json({ error: 'Invalid song data' }, { status: 400 });
    }

    // Add the song to the playlist
    await addToPlayList(playListId, song);

    return NextResponse.json({ success: true, message: `Song "${song.title}" has been added to the playlist "${playListId}"` });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    return NextResponse.json({ error: 'Failed to add song to playlist' }, { status: 500 });
  }
}
