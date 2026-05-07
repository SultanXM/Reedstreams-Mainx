'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Navbar from '../../components/Navbar'
import { trackView } from '../../lib/api'
import { isIOS } from '../../lib/device'
import { APIMatch, Stream, fetchStreams, fetchAllMatches, getPosterUrl, getTeamBadgeUrl } from '../../lib/matches/service'

interface Slot {
  id: number
  match: APIMatch | null
  selectedStream: Stream | null
  streams: Stream[]
  loading: boolean
}

const CATEGORIES = [
  { id: 'all', name: 'All Sports' },
  { id: 'football', name: 'Soccer' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'baseball', name: 'Baseball' },
  { id: 'american-football', name: 'NFL' },
  { id: 'hockey', name: 'Hockey' },
  { id: 'cricket', name: 'Cricket' },
  { id: 'motor-sports', name: 'Moto' },
  { id: 'fight', name: 'Fighting' },
]

export default function MultiviewPage() {
  const [slots, setSlots] = useState<Slot[]>([
    { id: 1, match: null, selectedStream: null, streams: [], loading: false },
    { id: 2, match: null, selectedStream: null, streams: [], loading: false },
    { id: 3, match: null, selectedStream: null, streams: [], loading: false },
    { id: 4, match: null, selectedStream: null, streams: [], loading: false },
  ])
  
  const [allMatches, setAllMatches] = useState<APIMatch[]>([])
  const [showMatchPicker, setShowMatchPicker] = useState<number | null>(null)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const pendingSlotOps = useRef<Record<number, number>>({})

  // Modal Search & Filter
  const [modalSearch, setModalSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Fetch all matches once
  useEffect(() => {
    const loadMatches = async () => {
      setLoadingMatches(true)
      try {
        const matches = await fetchAllMatches()
        setAllMatches(matches)
      } catch (err) {
        console.error('Failed to load matches:', err)
      } finally {
        setLoadingMatches(false)
      }
    }
    loadMatches()
  }, [])

  // Filtered matches for the modal
  const filteredMatches = useMemo(() => {
    return allMatches.filter(match => {
      const matchesSearch = match.title.toLowerCase().includes(modalSearch.toLowerCase()) ||
                          match.category.toLowerCase().includes(modalSearch.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || match.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allMatches, modalSearch, selectedCategory])

  // Slot Management
  const handleSelectMatch = async (slotId: number, match: APIMatch) => {
    const opId = Date.now()
    pendingSlotOps.current[slotId] = opId

    setShowMatchPicker(null)
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, match, loading: true } : s))

    try {
      const allStreams: Stream[] = []
      for (const src of match.sources) {
        try {
          const streamsData = await fetchStreams(src.source, src.id)
          if (pendingSlotOps.current[slotId] !== opId) return
          allStreams.push(...streamsData)
        } catch (err) {
          console.warn(`Failed to fetch streams from ${src.source}:`, err)
        }
      }

      if (pendingSlotOps.current[slotId] !== opId) return

      const hdStream = allStreams.find(s => s.hd)
      const selected = hdStream || allStreams[0] || null

      setSlots(prev => prev.map(s => s.id === slotId ? {
        ...s,
        streams: allStreams,
        selectedStream: selected,
        loading: false
      } : s))

      // Track view
      trackView(match.id).catch(() => {})
    } catch (err) {
      if (pendingSlotOps.current[slotId] !== opId) return
      console.error('Failed to load streams for slot:', slotId, err)
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, loading: false } : s))
    }
  }

  const handleClearSlot = (slotId: number) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { id: slotId, match: null, selectedStream: null, streams: [], loading: false } : s))
  }

  const handleSwitchSource = (slotId: number, stream: Stream) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, selectedStream: stream } : s))
  }

  return (
    <>
      <Navbar />
      <main className="multiview-main">
        <div className="grid-container">
          {slots.map(slot => (
            <div key={slot.id} className="watch-slot">
              {slot.match ? (
                <>
                  {slot.loading ? (
                    <div className="slot-message">Loading streams...</div>
                  ) : slot.selectedStream ? (
                    <iframe
                      src={slot.selectedStream.embedUrl}
                      className="slot-iframe"
                      allowFullScreen
                      allow="autoplay; fullscreen"
                      sandbox={isIOS() && slot.selectedStream.source.toLowerCase() !== 'golf' ? "allow-scripts allow-same-origin allow-forms allow-presentation" : undefined}
                    />
                  ) : (
                    <div className="slot-message">No streams available</div>
                  )}
                  
                  {/* Overlay Controls */}
                  <div className="slot-controls">
                    <select 
                      value={slot.selectedStream?.id || ''} 
                      onChange={(e) => {
                        const stream = slot.streams.find(s => s.id === e.target.value)
                        if (stream) handleSwitchSource(slot.id, stream)
                      }}
                      className="source-select"
                    >
                      {slot.streams.map(s => (
                        <option key={s.id} value={s.id}>{s.source.toUpperCase()} {s.hd ? '(HD)' : ''}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => handleClearSlot(slot.id)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-slot">
                  <button 
                    onClick={() => setShowMatchPicker(slot.id)}
                    className="select-match-btn"
                  >
                    <div className="plus-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </div>
                    <span>Select Stream</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Match Picker Modal */}
        {showMatchPicker !== null && (
          <div className="modal-overlay" onClick={() => setShowMatchPicker(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Select Match</h3>
                <button onClick={() => setShowMatchPicker(null)} className="modal-close">✕</button>
              </div>

              {/* Modal Filters */}
              <div className="modal-filters">
                <div className="modal-search-wrapper">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search teams or sports..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="modal-search-input"
                  />
                </div>
                <div className="modal-categories">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`modal-cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="matches-list">
                {loadingMatches ? (
                  <div className="loading-msg">Loading matches...</div>
                ) : filteredMatches.length === 0 ? (
                  <div className="loading-msg">No matches found</div>
                ) : (
                  filteredMatches.map(match => (
                    <button 
                      key={match.id} 
                      onClick={() => handleSelectMatch(showMatchPicker, match)}
                      className="match-option"
                    >
                      <div className="match-option-left">
                        {match.poster ? (
                          <div className="match-option-poster">
                            <img src={getPosterUrl(match.poster)} alt="" />
                          </div>
                        ) : (
                          <div className="match-option-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 2a14.5 14.5 0 0 0 0 20"></path>
                              <path d="M2 12h20"></path>
                            </svg>
                          </div>
                        )}
                        <div className="match-option-info">
                          <div className="match-option-title">{match.title}</div>
                          <div className="match-option-meta">
                            <span className="match-option-cat">{match.category.replace(/-/g, ' ')}</span>
                            {match.popular && <span className="popular-tag">Popular</span>}
                          </div>
                        </div>
                      </div>
                      <div className="match-option-right">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .multiview-main {
          height: calc(100vh - 56px);
          background: #0a0a0a;
          color: #fff;
          overflow: hidden;
          padding: 8px;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 8px;
          height: 100%;
          width: 100%;
        }
        .watch-slot {
          position: relative;
          background: #050505;
          border-radius: 8px;
          overflow: hidden;
          border: 1.5px solid #1e1e30;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s ease;
        }
        .watch-slot:hover {
          border-color: #2a2a4e;
        }
        .slot-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .slot-message {
          color: #666;
          font-size: 13px;
          font-weight: 500;
        }
        .slot-controls {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          gap: 8px;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .watch-slot:hover .slot-controls {
          opacity: 1;
        }
        .source-select {
          background: rgba(10, 10, 15, 0.9);
          color: #fff;
          border: 1px solid #1e1e30;
          border-radius: 6px;
          font-size: 11px;
          padding: 4px 8px;
          outline: none;
          backdrop-filter: blur(4px);
        }
        .remove-btn {
          background: rgba(233, 25, 22, 0.8);
          border: none;
          color: #fff;
          border-radius: 6px;
          width: 26px;
          height: 26px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .remove-btn:hover {
          background: rgba(233, 25, 22, 1);
        }
        .empty-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .select-match-btn {
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }
        .plus-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px dashed #1e1e30;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          transition: all 0.2s;
        }
        .select-match-btn:hover {
          color: #fff;
        }
        .select-match-btn:hover .plus-icon {
          border-color: #00bcd4;
          color: #00bcd4;
          transform: scale(1.1);
        }
        .select-match-btn span {
          font-size: 13px;
          font-weight: 500;
        }
        
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-content {
          background: #0a0a0f;
          border: 1.5px solid #1e1e30;
          border-radius: 16px;
          width: 100%;
          max-width: 550px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
          animation: modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalAppear {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-header {
          padding: 18px 24px;
          border-bottom: 1px solid #1e1e30;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(10, 10, 15, 0.5);
        }
        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.3px;
        }
        .modal-close {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 18px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .modal-close:hover {
          background: rgba(233, 25, 22, 0.1);
          color: #e91916;
        }

        .modal-filters {
          padding: 16px 24px;
          border-bottom: 1px solid #1e1e30;
          background: rgba(10, 10, 15, 0.3);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .modal-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .modal-search-wrapper svg {
          position: absolute;
          left: 12px;
          pointer-events: none;
        }
        .modal-search-input {
          width: 100%;
          background: #141420;
          border: 1.5px solid #1e1e30;
          border-radius: 10px;
          padding: 10px 12px 10px 36px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }
        .modal-search-input:focus {
          border-color: #00bcd4;
          background: #1a1a2e;
        }
        .modal-categories {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .modal-categories::-webkit-scrollbar {
          display: none;
        }
        .modal-cat-btn {
          padding: 7px 14px;
          background: transparent;
          border: 1px solid #1e1e30;
          border-radius: 8px;
          color: #888;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-cat-btn:hover {
          color: #fff;
          border-color: #888;
        }
        .modal-cat-btn.active {
          background: #1a1a2e;
          color: #fff;
          border-color: #888;
        }

        .matches-list {
          padding: 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .match-option {
          padding: 12px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          color: #fff;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }
        .match-option:hover {
          background: #0a0a0f;
          border-color: #1e1e30;
        }
        .match-option-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }
        .match-option-poster {
          width: 54px;
          aspect-ratio: 16/9;
          border-radius: 4px;
          overflow: hidden;
          background: #1a1a2e;
          flex-shrink: 0;
          border: 1px solid #1e1e30;
        }
        .match-option-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .match-option-icon {
          width: 32px;
          height: 32px;
          background: #141420;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #666;
        }
        .match-option-info {
          min-width: 0;
          flex: 1;
        }
        .match-option-title {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #fff;
        }
        .match-option-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .match-option-cat {
          font-size: 11px;
          color: #888;
          text-transform: capitalize;
        }
        .popular-tag {
          font-size: 9px;
          background: rgba(233, 25, 22, 0.1);
          color: #e91916;
          padding: 1px 5px;
          border-radius: 3px;
          font-weight: 700;
          text-transform: uppercase;
          border: 1px solid rgba(233, 25, 22, 0.2);
        }
        .loading-msg {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .multiview-main {
            height: auto;
            min-height: calc(100vh - 40px);
            padding: 4px;
            overflow-y: auto;
          }
          .grid-container {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            gap: 8px;
            height: auto;
          }
          .watch-slot {
            height: auto;
            aspect-ratio: 16/9;
            border-width: 1px;
          }
          .plus-icon {
            width: 32px;
            height: 32px;
          }
          .select-match-btn span {
            font-size: 11px;
          }
          .modal-content {
            max-height: 90vh;
            border-radius: 16px 16px 0 0;
            position: fixed;
            bottom: 0;
          }
          .modal-header {
            padding: 14px 20px;
          }
          .modal-filters {
            padding: 12px 20px;
          }
          .match-option-poster {
            width: 80px;
          }
        }
      `}</style>
    </>
  )
}
