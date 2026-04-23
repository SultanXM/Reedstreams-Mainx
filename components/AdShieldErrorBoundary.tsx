'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * 🛡️ Ad Shield Error Boundary
 *
 * Catches errors in child components and prevents full app crash.
 * Used to wrap the video player and ad shield components.
 */
export class AdShieldErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('🛡️ [AdShield Error]', error, errorInfo);
        }

        // In production, send to error tracking service
        if (process.env.NODE_ENV === 'production') {
            try {
                fetch('/api/analytics/error', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        error: error.message,
                        stack: error.stack,
                        componentStack: errorInfo.componentStack,
                        timestamp: Date.now(),
                        userAgent: navigator.userAgent,
                        url: window.location.href
                    }),
                    keepalive: true
                }).catch(() => { });
            } catch (e) {
                // Silently fail
            }
        }
    }

    render() {
        if (this.state.hasError) {
            // Render fallback UI or default error message
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    background: '#1a1a1a',
                    color: '#fff',
                    minHeight: '200px',
                    borderRadius: '8px'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ marginBottom: '10px' }}>
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div style={{ fontSize: '14px', color: '#888' }}>
                        Player error. Please refresh the page.
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '15px',
                            padding: '8px 20px',
                            background: '#8db902',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#000',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                    >
                        REFRESH
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
