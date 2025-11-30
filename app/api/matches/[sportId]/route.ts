import { NextResponse } from 'next/server'

interface Team {
  name: string;
}

interface Match {
  id: string;
  status: string;
  home_team: Team;
  away_team: Team;
}
const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

interface RouteParams {
  params: Promise<{ sportId: string }>
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { sportId } = await params
    const res = await fetch(`${STREAMED_API_BASE}/matches/${sportId}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const allMatches: Match[] = await res.json()

    if (!Array.isArray(allMatches)) {
      return NextResponse.json([])
    }

    const priorityTeamNames = ["NFL RedZone", "NFL RedZone|"]

    // Always include priority matches, regardless of their status
    const priorityMatches = allMatches.filter(match =>
      priorityTeamNames.includes(match.home_team.name) || priorityTeamNames.includes(match.away_team.name)
    );

    // Filter other matches to only show live ones
    const liveMatches = allMatches.filter(match => match.status === 'live');

    // Combine them, ensuring no duplicates
    const combinedMatches = [...priorityMatches, ...liveMatches.filter(liveMatch => !priorityMatches.some(pMatch => pMatch.id === liveMatch.id))];

    return NextResponse.json(combinedMatches)
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json([])
  }
}