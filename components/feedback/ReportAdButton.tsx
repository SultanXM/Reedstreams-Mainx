'use client';

import { useState, useCallback } from 'react';
import { trackUserReport } from '@/utils/shieldTelemetry';

interface ReportAdButtonProps {
    provider: string;
    streamUrl?: string;
}

/**
 * 🛡️ Report Ad Button
 * 
 * Allows users to report when ads appear despite protection.
 * Data is collected anonymously to improve blocking.
 */
export function ReportAdButton({ provider, streamUrl }: ReportAdButtonProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [reported, setReported] = useState(false);

    const handleReport = useCallback((type: 'ad-appeared' | 'stream-broken' | 'other') => {
        trackUserReport(provider, type, streamUrl);
        setReported(true);
        setShowMenu(false);

        // Reset after 3 seconds
        setTimeout(() => setReported(false), 3000);
    }, [provider, streamUrl]);

    if (reported) {
        return (
            <div style={{
                padding: '8px 16px',
                background: '#1a472a',
                borderRadius: '6px',
                color: '#8db902',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span>✓</span>
                <span>Thanks for reporting!</span>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                    padding: '8px 16px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#888',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8db902';
                    e.currentTarget.style.color = '#8db902';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#333';
                    e.currentTarget.style.color = '#888';
                }}
            >
                <span>⚠️</span>
                <span>Report Issue</span>
            </button>

            {showMenu && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '0',
                    marginBottom: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '8px',
                    minWidth: '180px',
                    zIndex: 1000,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    <button
                        onClick={() => handleReport('ad-appeared')}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '13px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a2a'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <span>🚫</span>
                        <span>Ad appeared</span>
                    </button>

                    <button
                        onClick={() => handleReport('stream-broken')}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '13px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a2a'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <span>📺</span>
                        <span>Stream not working</span>
                    </button>

                    <button
                        onClick={() => handleReport('other')}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '13px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a2a'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <span>❓</span>
                        <span>Other issue</span>
                    </button>
                </div>
            )}
        </div>
    );
}
