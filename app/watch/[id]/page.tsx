'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../../../components/Navbar'
import Chat from '../../../components/Chat'
import { trackView } from '../../../lib/api'
import { APIMatch, Stream, fetchStreams } from '../../../lib/matches/service'
import styles from './WatchPage.module.css'

const API_BASE = 'https://streamed.pk/api'

export default function WatchPage() {
  const params = useParams()
  const id = params.id
  const [error, setError] = useState('')
  const [match, setMatch] = useState<APIMatch | null>(null)
  const [streams, setStreams] = useState<Stream[]>([])
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null)
  const [loadingMatch, setLoadingMatch] = useState(true)
  const [showSourceSelector, setShowSourceSelector] = useState(false)
  const sourceSelectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadMatchData = async () => {
      setLoadingMatch(true)
      try {
        let matchId = id as string
        const parts = (id as string).split('_')
        if (parts.length === 2) {
          matchId = parts[1]
        }

        const allMatchesRes = await fetch(`${API_BASE}/matches/all`)
        const allMatches: APIMatch[] = await allMatchesRes.json()

        const foundMatch = allMatches.find(m => m.id === matchId || m.sources.some(s => s.id === matchId))

        if (!foundMatch) {
          setError('Match not found')
          setLoadingMatch(false)
          return
        }

        setMatch(foundMatch)

        const allStreams: Stream[] = []
        for (const src of foundMatch.sources) {
          try {
            const streamsData = await fetchStreams(src.source, src.id)
            allStreams.push(...streamsData)
          } catch (err) {
            console.warn(`Failed to fetch streams from ${src.source}:`, err)
          }
        }

        setStreams(allStreams)

        if (allStreams.length > 0) {
          const hdStream = allStreams.find(s => s.hd)
          setSelectedStream(hdStream || allStreams[0])
        }
      } catch (err) {
        console.error('Failed to load match:', err)
        setError('Failed to load match data')
      } finally {
        setLoadingMatch(false)
      }
    }

    loadMatchData()
  }, [id])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceSelectorRef.current && !sourceSelectorRef.current.contains(event.target as Node)) {
        setShowSourceSelector(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const hasTrackedView = sessionStorage.getItem(`view_tracked_${id}`)
    if (!hasTrackedView) {
      trackView(id as string).then(() => {
        sessionStorage.setItem(`view_tracked_${id}`, 'true')
      }).catch(() => {})
    }
  }, [id])

  return (
    <>
      <Navbar />

      <main className={styles.watchMain}>
        <div className={styles.watchLayout}>
          
          <div className={styles.playerSection}>
            <div className={styles.playerContainer}>
              {loadingMatch ? (
                <div className={styles.centered}>
                  Loading match...
                </div>
              ) : selectedStream ? (
                <iframe
                  src={selectedStream.embedUrl}
                  className={styles.iframe}
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              ) : (
                <div className={styles.centered}>
                  No streams available
                </div>
              )}
            </div>

            <div className={styles.infoBar}>
              <div className={styles.infoContent}>
                {loadingMatch ? (
                  <div className={`${styles.skeletonText} skeleton-text`} style={{
                    height: '16px',
                    width: '200px',
                  }} />
                ) : (
                  <h1 className={styles.matchTitle}>
                    {match?.title || 'Loading...'}
                  </h1>
                )}
                <p className={styles.matchCategory}>
                  {match?.category ? match.category.replace(/-/g, ' ') : ''}
                </p>
              </div>
              
              <div ref={sourceSelectorRef} className={styles.sourceSelector}>
                <button
                  onClick={() => setShowSourceSelector(!showSourceSelector)}
                  className={styles.sourceButton}
                >
                  <div className={styles.buttonLeft}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" className={styles.buttonIcon}>
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <span className={styles.buttonText}>{selectedStream ? `${selectedStream.source.toUpperCase()}${selectedStream.hd ? ' • HD' : ''}` : 'Select Source'}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" className={`${styles.chevron} ${showSourceSelector ? styles.chevronOpen : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {showSourceSelector && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <span>Streams</span>
                      <span className={styles.streamCount}>{streams.length}</span>
                    </div>
                    <div className={styles.dropdownList}>
                      {streams.map((stream) => (
                        <button
                          key={stream.id}
                          onClick={() => {
                            setSelectedStream(stream)
                            setShowSourceSelector(false)
                          }}
                          className={`${styles.streamButton} ${selectedStream?.id === stream.id ? styles.streamButtonActive : ''}`}
                        >
                          <span className={styles.sourceName}>{stream.source.toUpperCase()}</span>
                          {stream.hd && (
                            <span className={styles.hdBadge}>
                              HD
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Chat showRules={true} />

        </div>
      </main>
    </>
  )
}
