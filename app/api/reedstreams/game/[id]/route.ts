import { NextResponse } from 'next/server';
import { REED_API_V1 } from '@/config/api';

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    console.log(`[REED GAME] Fetching game ${id}`);

    // Fetch all games and find the one with matching ID
    const res = await fetch(`${REED_API_V1}/streams`, {
      next: { revalidate: 60 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      console.error(`[REED GAME] Error fetching games: ${res.status}`);
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    
    // Find the game with matching ID across all categories
    let foundGame = null;
    if (data.categories) {
      for (const category of data.categories) {
        const game = category.games.find((g: any) => String(g.id) === String(id));
        if (game) {
          foundGame = { 
            id: game.id,
            name: game.name,
            poster: game.poster,
            start_time: game.start_time,
            end_time: game.end_time,
            video_link: game.video_link,
            category: category.category 
          };
          break;
        }
      }
    }

    if (!foundGame) {
      console.error(`[REED GAME] Game ${id} not found`);
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    console.log(`[REED GAME] Found game:`, foundGame.name);
    return NextResponse.json(foundGame);
  } catch (error) {
    console.error("[REED GAME] Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
