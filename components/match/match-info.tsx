"use client"

import { useEffect, useState } from "react"
import { API_STREAMS_URL } from "@/config/api"
import "@/styles/match.css"

interface Game {
  id: number
  name: string
  poster: string
  start_time: number
  end_time: number
  video_link: string
  category: string
}

interface Category {
  category: string
  games: Game[]
}

interface Match {
  id: string | number
  title: string
  date: number | string
  category?: string
}

export default function MatchInfo({ matchId }: { matchId: string }) {
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        // check cache first - faster than api call
        const stored = sessionStorage.getItem("currentMatch");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (String(parsed.id) === String(matchId)) {
                const title = parsed.title || parsed.name || "Live Stream"
                const date = parsed.date || parsed.start_time
                setMatch({
                    id: parsed.id,
                    title: title,
                    date: date,
                    category: parsed.category
                });
                setLoading(false);
                return;
            }
        }

        // cache miss, hit the api
        const res = await fetch(API_STREAMS_URL);
        if (res.ok) {
            const data = await res.json();
            if (data.categories) {
                for (const cat of data.categories as Category[]) {
                    if (cat.games) {
                        const found = cat.games.find((g: Game) => String(g.id) === matchId);
                        if (found) {
                            setMatch({
                                id: found.id,
                                title: found.name,
                                date: found.start_time,
                                category: cat.category
                            });
                            setLoading(false);
                            return;
                        }
                    }
                }
            }
        }
      } catch (e) {
        // shit happened, log and move on
        console.error("Info Load Error", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [matchId]);

  if (loading || !match) return null;

  // format the date nicely
  const dateValue = match.date;
  const dateObj = typeof dateValue === 'number' 
    ? new Date(dateValue * 1000)  // unix timestamp
    : new Date(dateValue);         // iso string
  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dayDate = dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  // split title to get teams - "Team A vs Team B"
  const teams = match.title.split(' vs ');
  const homeName = teams[0] || "Home Team";
  const awayName = teams[1] || "Away Team";

  return (
    <div className="match-info-strip">
        <div className="info-time-block">
            <div className="info-time">{time}</div>
            <div className="info-date">{dayDate}</div>
        </div>

        <div className="info-teams-block">
            <div className="team-side home">
                <span className="team-name">{homeName}</span>
                <div className="team-logo-placeholder">{homeName[0]}</div>
            </div>
            
            <div className="vs-tag">VS</div>
            
            <div className="team-side away">
                <div className="team-logo-placeholder">{awayName[0]}</div>
                <span className="team-name">{awayName}</span>
            </div>
        </div>

        <div className="info-status-block">
            <div className="live-badge">LIVE EVENT</div>
        </div>
    </div>
  )
}
