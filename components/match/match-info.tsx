"use client"

import { useEffect, useState } from "react"
import "@/styles/match.css"

interface Match {
  id: string
  title: string
  date: string
  // Assuming the API returns team info like this, otherwise we parse the title
  homeTeam?: { name: string, logo: string }
  awayTeam?: { name: string, logo: string }
}

export default function MatchInfo({ matchId }: { matchId: string }) {
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        // 1. Check Session Storage first (Speed)
        const stored = sessionStorage.getItem("currentMatch");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (String(parsed.id) === String(matchId)) {
                setMatch(parsed);
                setLoading(false);
                return;
            }
        }

        // 2. Fetch from API if needed
        const res = await fetch("/api/matches");
        if(res.ok) {
            const list = await res.json();
            const found = list.find((m: Match) => String(m.id) === String(matchId));
            if(found) setMatch(found);
        }
      } catch (e) {
        console.error("Info Load Error", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [matchId]);

  if (loading || !match) return null; // Hide if loading/error to keep UI clean

  // Helper to format date nicely
  const dateObj = new Date(match.date);
  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dayDate = dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  // PARSING TEAMS (If your API just gives a "Title" string like "Team A vs Team B")
  // If your API gives real team objects, use those instead.
  const teams = match.title.split(' vs ');
  const homeName = teams[0] || "Home Team";
  const awayName = teams[1] || "Away Team";

  return (
    <div className="match-info-strip">
        {/* LEFT: MATCH STATUS / TIME */}
        <div className="info-time-block">
            <div className="info-time">{time}</div>
            <div className="info-date">{dayDate}</div>
        </div>

        {/* MIDDLE: THE TEAMS */}
        <div className="info-teams-block">
            <div className="team-side home">
                <span className="team-name">{homeName}</span>
                {/* Placeholder Logos (Replace src with real data if you have it) */}
                <div className="team-logo-placeholder">{homeName[0]}</div>
            </div>
            
            <div className="vs-tag">VS</div>
            
            <div className="team-side away">
                <div className="team-logo-placeholder">{awayName[0]}</div>
                <span className="team-name">{awayName}</span>
            </div>
        </div>

        {/* RIGHT: LIVE BADGE */}
        <div className="info-status-block">
            <div className="live-badge">LIVE EVENT</div>
        </div>
    </div>
  )
}