import { NextResponse } from 'next/server';
import { addToPlayList } from '@/app/src/PlayListControl';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { playListId, song } = body;

    if (!playListId || typeof playListId !== 'string') {
      return NextResponse.json({ error: 'playListId is required and must be a string' }, { status: 400 });
    }

    if (!song || typeof song.id !== 'string' || typeof song.title !== 'string' || typeof song.thumbnail !== 'string') {
      return NextResponse.json({ error: 'Invalid song data' }, { status: 400 });
    }

    await addToPlayList(playListId, song);

    return NextResponse.json({
      success: true,
      message: `Song "${song.title}" has been added to the playlist "${playListId}".`,
    });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    return NextResponse.json({ error: error || 'Failed to add song' }, { status: 500 });
  }
}
