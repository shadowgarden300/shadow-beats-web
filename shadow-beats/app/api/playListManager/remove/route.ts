import { NextResponse } from 'next/server';
import { removeFromPlayList } from '@/app/src/PlayListControl';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, songId } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Playlist name is required and must be a string' }, { status: 400 });
    }

    if (!songId || typeof songId !== 'string') {
      return NextResponse.json({ error: 'Song ID is required and must be a string' }, { status: 400 });
    }

    await removeFromPlayList(name, songId);

    return NextResponse.json({
      success: true,
      message: `Song with ID "${songId}" has been removed from the playlist "${name}".`,
    });
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    return NextResponse.json({ error: error || 'Failed to remove song' }, { status: 500 });
  }
}
