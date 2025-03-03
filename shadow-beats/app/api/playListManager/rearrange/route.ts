import { NextResponse } from 'next/server';
import { rearrangeSongs } from '@/app/src/PlayListControl';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, songs } = body;

    if (!name || !Array.isArray(songs)) {
      return NextResponse.json({ error: 'Invalid playlist data' }, { status: 400 });
    }

    rearrangeSongs(name, songs);

    return NextResponse.json({ success: true, message: `Playlist "${name}" has been updated.` });
  } catch (error) {
    console.error('Error rearranging playlist:', error);
    return NextResponse.json({ error: error || 'Failed to rearrange playlist' }, { status: 500 });
  }
}
