"use client"
import { useState, useEffect } from "react"
import { Video, RefreshCw, CheckCircle, AlertTriangle, Save } from "lucide-react"

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [matches, setMatches] = useState<any[]>([])
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "reedsmoney19k") setIsAuthenticated(true);
  }

  const fetchMatches = async () => {
    setLoading(true);
    const res = await fetch("/api/matches");
    if (res.ok) setMatches(await res.json());
    setLoading(false);
  }

  useEffect(() => { if (isAuthenticated) fetchMatches(); }, [isAuthenticated]);

  const handleOverride = async (matchId: string, source: string) => {
    setLoading(true);
    const res = await fetch('/api/stream-control', {
      method: 'POST',
      body: JSON.stringify({ matchId, source, secret: password })
    });
    if (res.ok) setOverrides(prev => ({ ...prev, [matchId]: source }));
    setLoading(false);
  }

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-[#111] p-8 rounded-xl border border-[#333] w-full max-w-md">
        <h1 className="text-xl font-bold text-white mb-4">ReedStreams Controller</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-[#333] text-white p-3 rounded-lg mb-4" placeholder="Admin Key" />
        <button type="submit" className="w-full bg-[#8db902] p-3 rounded-lg font-bold">LOG IN</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><Video /> Stream Manager</h1>
        <div className="grid gap-4">
          {matches.map(m => (
            <div key={m.id} className="bg-[#111] p-6 rounded-xl border border-[#333] flex justify-between items-center">
              <div><h3 className="font-bold">{m.title}</h3><p className="text-xs text-gray-500">{m.id}</p></div>
              <div className="flex gap-2 bg-black p-1 rounded-lg">
                {['AUTO', 'NATIVE', 'GOLF'].map(s => (
                  <button key={s} onClick={() => handleOverride(m.id, s)} className={`px-4 py-2 rounded text-xs font-bold ${overrides[m.id] === s ? 'bg-[#8db902] text-black' : 'text-gray-500'}`}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}