import 'server-only';

const STREAMED_API_URL = 'https://streamed.pk/api/matches';

interface Match {
    id: string;
    title: string;
    date: string;
    competition?: string;
    teams?: {
      home?: { name: string; badge?: string };
      away?: { name: string; badge?: string };
    };
    sources?: Array<{ source: string; id: string }>;
}

export async function fetchMatches(): Promise<Match[]> {
    try {
        const response = await fetch(STREAMED_API_URL, { next: { revalidate: 60 } });
        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error('External API fetch error in fetchMatches:', error);
        return [];
    }
}
