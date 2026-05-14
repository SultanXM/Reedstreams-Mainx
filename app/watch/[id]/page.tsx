'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../../../components/Navbar'
import Chat from '../../../components/Chat'
import { AdShieldErrorBoundary } from '../../../components/AdShieldErrorBoundary'
import { useUniversalAdBlocker } from '../../../hooks/useUniversalAdBlocker'
import { useTrackMatchView } from '../../../hooks/useLiveViews'
import { APIMatch, Stream, fetchAllMatches, fetchStreams } from '../../../lib/matches/service'
import { SERVICE_API_BASE } from '../../../lib/serviceApi'
import { getDefaultSource } from '../../../lib/admin'
import { isIOS } from '../../../lib/device'
import styles from './WatchPage.module.css'

const REPORT_REASONS = [
  'Stream Lag / Buffering',
  'Stream Down / Not Working',
  'Wrong Match',
  'Poor Quality',
  'Inappropriate Content',
  'Other Issue'
]

export default function WatchPage() {
    const params = useParams()
    const id = params.id
    const [error, setError] = useState('')
    const [match, setMatch] = useState<APIMatch | null>(null)
    const [streams, setStreams] = useState<Stream[]>([])
    const [selectedStream, setSelectedStream] = useState<Stream | null>(null)
    const [loadingMatch, setLoadingMatch] = useState(true)
    const [iframeLoaded, setIframeLoaded] = useState(false)
    const [defaultSource, setDefaultSource] = useState<string | null>(null)
    const [showReportPopup, setShowReportPopup] = useState(false)
    const [reportReason, setReportReason] = useState(REPORT_REASONS[0])
    const [reportMessage, setReportMessage] = useState('')
    const [reportSent, setReportSent] = useState(false)
    const [showShareToast, setShowShareToast] = useState(false)
    const streamsRowRef = useRef<HTMLDivElement>(null)

    // Activate ad blocker
    useUniversalAdBlocker()

    // Track live views
    useTrackMatchView(id as string)

    useEffect(() => {
        const loadDefaultSource = async () => {
            try {
                const response = await getDefaultSource()
                setDefaultSource(response.default_source)
            } catch (err) {
                console.warn('Failed to fetch default source:', err)
            }
        }
        loadDefaultSource()
    }, [])

    useEffect(() => {
        let cancelled = false

        const loadMatchData = async () => {
            setLoadingMatch(true)
            try {
                let matchId = id as string
                const parts = (id as string).split('_')
                if (parts.length === 2) matchId = parts[1]

                // 1. Fetch from caching API (Always try our cache first or in parallel)
                let cachedMatch: APIMatch | null = null
                try {
                    const cacheRes = await fetch(`${SERVICE_API_BASE}/match/${matchId}`)
                    if (cacheRes.ok) {
                        cachedMatch = await cacheRes.json()
                    }
                } catch (err) {
                    console.warn('Failed to fetch from cache:', err)
                }

                // 2. Fetch from primary API
                let primaryMatch: APIMatch | null = null
                try {
                    const allMatches = await fetchAllMatches()
                    primaryMatch = allMatches.find(m => m.id === matchId || m.sources.some(s => s.id === matchId)) || null
                } catch (err) {
                    console.warn('Failed to fetch from primary API:', err)
                }

                if (cancelled) return

                // 3. Determine best match data
                let foundMatch: APIMatch | null = primaryMatch || cachedMatch

                if (!foundMatch) {
                    setError('Match not found')
                    setLoadingMatch(false)
                    return
                }

                // 4. Merge sources if both available
                if (primaryMatch && cachedMatch) {
                    const mergedSources = [...primaryMatch.sources]
                    for (const s of cachedMatch.sources) {
                        if (!mergedSources.find(ms => ms.source === s.source && ms.id === s.id)) {
                            mergedSources.push(s)
                        }
                    }
                    foundMatch.sources = mergedSources
                }

                setMatch(foundMatch)

                const allStreams: Stream[] = []
                for (const src of foundMatch.sources) {
                    try {
                        const streamsData = await fetchStreams(src.source, src.id)
                        if (!cancelled) {
                            allStreams.push(...streamsData)
                        }
                    } catch (err) {
                        console.warn(`Failed to fetch streams from ${src.source}:`, err)
                    }
                }

                if (cancelled) return

                setStreams(allStreams)

                if (allStreams.length > 0) {
                    let streamToSelect: Stream | undefined
                    if (defaultSource) streamToSelect = allStreams.find(s => s.source === defaultSource)
                    if (!streamToSelect) {
                        const hdStream = allStreams.find(s => s.hd)
                        streamToSelect = hdStream || allStreams[0]
                    }
                    setSelectedStream(streamToSelect)
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Failed to load match:', err)
                    setError('Failed to load match data')
                }
            } finally {
                if (!cancelled) {
                    setLoadingMatch(false)
                }
            }
        }

        loadMatchData()

        return () => {
            cancelled = true
        }
    }, [id, defaultSource])
    
    const handleShare = async () => {
        const shareUrl = window.location.href
        const shareTitle = match?.title || 'Watch on Reedstreams'
        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, url: shareUrl })
            } catch {}
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(shareUrl)
                setShowShareToast(true)
                setTimeout(() => setShowShareToast(false), 2500)
            } catch (err) {
                console.warn('Failed to copy link to clipboard:', err)
            }
        }
    }

    const handleReport = async () => {
        if (!match) return

        const subject = `Report for Match ID: ${match.id} - ${reportReason}`
        const body = `Match Title: ${match.title}\nMatch URL: ${window.location.href}\n\nReason: ${reportReason}\n\nDetails: ${reportMessage}`
        const mailtoLink = `mailto:support@streamed.pk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.open(mailtoLink, '_blank')
        setReportSent(true)
    }

    return (
        <>
            <Navbar />
            <main className={styles.watchMain}>
                <div className={styles.watchLayout}>
                    <div className={styles.playerSection}>
                        <div className={styles.playerContainer}>
                            {loadingMatch ? (
                                <div className={styles.loadingOverlay}>
                                    <div className={styles.loadingSpinner} />
                                    <div className={styles.loadingText}>Loading match data...</div>
                                </div>
                            ) : selectedStream ? (
                                <>
                                    {!iframeLoaded && (
                                        <div className={styles.loadingOverlay}>
                                            <div className={styles.loadingSpinner} />
                                            <div className={styles.loadingText}>Connecting to stream...</div>
                                        </div>
                                    )}
                                    <AdShieldErrorBoundary>
                                        <iframe
                                            src={selectedStream.embedUrl}
                                            className={styles.videoIframe}
                                            allowFullScreen
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            sandbox={isIOS() && selectedStream.source.toLowerCase() !== 'golf' ? "allow-scripts allow-same-origin allow-forms allow-presentation" : undefined}
                                            onLoad={() => setIframeLoaded(true)}
                                        />
                                    </AdShieldErrorBoundary>
                                </>
                            ) : (
                                <div className={styles.centered}>No streams available</div>
                            )}
                        </div>

                        {!loadingMatch && streams.length > 0 && (
                            <div className={styles.streamsRow} ref={streamsRowRef}>
                                {(() => {
                                    const seen = new Set<string>()
                                    const uniqueStreams = streams.filter(s => {
                                        const key = `${s.source}-${s.streamNo}`
                                        if (seen.has(key)) return false
                                        seen.add(key)
                                        return true
                                    })

                                    const sourceCounts: Record<string, number> = {}
                                    return uniqueStreams.map((stream) => {
                                        sourceCounts[stream.source] = (sourceCounts[stream.source] || 0) + 1
                                        const count = sourceCounts[stream.source]
                                        const totalForSource = uniqueStreams.filter(s => s.source === stream.source).length
                                        const isActive = selectedStream?.source === stream.source && selectedStream?.streamNo === stream.streamNo

                                        return (
                                            <button
                                                key={`${stream.source}-${stream.streamNo}`}
                                                onClick={() => {
                                                    if (selectedStream?.embedUrl !== stream.embedUrl) {
                                                        setIframeLoaded(false);
                                                        setSelectedStream(stream);
                                                    }
                                                }}
                                                className={`${styles.streamBtn} ${isActive ? styles.streamBtnActive : ''}`}
                                            >
                                                <span className={styles.streamSource}>{stream.source.toUpperCase()}</span>
                                                {totalForSource > 1 && (
                                                    <span className={styles.streamNumber}>{count}</span>
                                                )}
                                                <span className={`${styles.streamQuality} ${stream.hd ? styles.qualityHd : styles.qualitySd}`}>
                                                    {stream.hd ? 'HD' : 'SD'}
                                                </span>
                                                {stream.language && (
                                                    <span className={styles.streamLang}>{stream.language.toUpperCase()}</span>
                                                )}
                                            </button>
                                        )
                                    })
                                })()}
                            </div>
                        )}

                        <div className={styles.infoBar}>
                            <div className={styles.infoContent}>
                                {loadingMatch ? (
                                    <div className={styles.skeletonText} style={{ height: '16px', width: '200px' }} />
                                ) : (
                                    <>
                                        <h1 className={styles.matchTitle}>{match?.title || 'Loading...'}</h1>
                                        <div className={styles.infoBottom}>
                                            <p className={styles.matchCategory}>
                                                {match?.category ? match.category.replace(/-/g, ' ') : ''}
                                            </p>
                                            <div className={styles.infoActions}>
                                                <button onClick={handleShare} className={styles.actionBtn}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                                        <polyline points="16 6 12 2 8 6"></polyline>
                                                        <line x1="12" y1="2" x2="12" y2="15"></line>
                                                    </svg>
                                                    Share
                                                </button>
                                                <button onClick={() => { setShowReportPopup(true); setReportSent(false) }} className={`${styles.actionBtn} ${styles.reportBtn}`}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                                        <line x1="4" y1="22" x2="4" y2="15"></line>
                                                    </svg>
                                                    Report
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <section className={styles.cboxChatSection}>
                        <Chat />
                    </section>
                </div>
            </main>

            {/* Report Popup (Remains as it uses mailto:, requiring no backend) */}
            {showReportPopup && (
                <div className={styles.reportOverlay} onClick={() => setShowReportPopup(false)}>
                    <div className={styles.reportPopup} onClick={e => e.stopPropagation()}>
                        <div className={styles.reportHeader}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                            Report Issue
                        </div>
                        {reportSent ? (
                            <div className={styles.reportSent}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <p>Report sent!</p>
                            </div>
                        ) : (
                            <>
                                <div className={styles.reportBody}>
                                    <label className={styles.reportLabel}>Issue Type</label>
                                    <select
                                        value={reportReason}
                                        onChange={e => setReportReason(e.target.value)}
                                        className={styles.reportSelect}
                                    >
                                        {REPORT_REASONS.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>

                                    <label className={styles.reportLabel}>Additional Details (optional)</label>
                                    <textarea
                                        value={reportMessage}
                                        onChange={e => setReportMessage(e.target.value)}
                                        placeholder="Describe the issue..."
                                        className={styles.reportTextarea}
                                        rows={4}
                                    />
                                </div>
                                <div className={styles.reportActions}>
                                    <button onClick={() => setShowReportPopup(false)} className={styles.reportCancelBtn}>
                                        Cancel
                                    </button>
                                    <button onClick={handleReport} className={styles.reportSubmitBtn}>
                                        Send Report
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {showShareToast && (
                <div className={styles.shareToast}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Link copied to clipboard!
                </div>
            )}
        </>
    )
}
