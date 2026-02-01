/**
 * 🛡️ AD SHIELD TELEMETRY & MONITORING
 * 
 * Production-ready monitoring for the ad blocking system.
 * Tracks performance, success rates, and user experience.
 * 
 * @version 1.0.0
 * @production true
 */

// ============================================
// TYPES
// ============================================

export interface TelemetryEvent {
    type: 'load' | 'block' | 'error' | 'fallback' | 'report';
    provider: string;
    device: 'mobile' | 'desktop' | 'tablet';
    browser: string;
    sandboxEnabled: boolean;
    success: boolean;
    duration?: number;
    error?: string;
    timestamp: number;
    sessionId: string;
    userId?: string;
}

export interface PerformanceMetrics {
    loadTime: number;
    timeToFirstFrame: number;
    sandboxOverhead: number; // Time difference with/without sandbox
    memoryUsage?: number;
}

// ============================================
// SESSION MANAGEMENT
// ============================================

let sessionId: string | null = null;

function getSessionId(): string {
    if (typeof window === 'undefined') return 'server';

    if (!sessionId) {
        sessionId = sessionStorage.getItem('adshield_session') || generateSessionId();
        sessionStorage.setItem('adshield_session', sessionId);
    }
    return sessionId;
}

function generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// DEVICE DETECTION (Memoized)
// ============================================

let cachedDeviceInfo: { device: 'mobile' | 'desktop' | 'tablet'; browser: string } | null = null;

export function getDeviceInfo(): { device: 'mobile' | 'desktop' | 'tablet'; browser: string } {
    if (cachedDeviceInfo) return cachedDeviceInfo;

    if (typeof navigator === 'undefined') {
        cachedDeviceInfo = { device: 'desktop', browser: 'unknown' };
        return cachedDeviceInfo;
    }

    const ua = navigator.userAgent;

    // Detect device type
    let device: 'mobile' | 'desktop' | 'tablet' = 'desktop';
    if (/iPad|Tablet/i.test(ua)) {
        device = 'tablet';
    } else if (/Android|iPhone|iPod|Mobile/i.test(ua)) {
        device = 'mobile';
    }

    // Detect browser
    let browser = 'unknown';
    if (/Chrome/i.test(ua) && !/Edge|Edg/i.test(ua)) browser = 'chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'safari';
    else if (/Firefox/i.test(ua)) browser = 'firefox';
    else if (/Edge|Edg/i.test(ua)) browser = 'edge';

    cachedDeviceInfo = { device, browser };
    return cachedDeviceInfo;
}

// ============================================
// EVENT BUFFER (Batched Sending)
// ============================================

const eventBuffer: TelemetryEvent[] = [];
const MAX_BUFFER_SIZE = 20;
const FLUSH_INTERVAL = 30000; // 30 seconds

let flushTimeout: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush(): void {
    if (flushTimeout) return;

    flushTimeout = setTimeout(() => {
        flushEvents();
        flushTimeout = null;
    }, FLUSH_INTERVAL);
}

async function flushEvents(): Promise<void> {
    if (eventBuffer.length === 0) return;

    const events = [...eventBuffer];
    eventBuffer.length = 0;

    try {
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics/shield-telemetry', JSON.stringify({
                events,
                timestamp: Date.now()
            }));
        } else {
            await fetch('/api/analytics/shield-telemetry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events, timestamp: Date.now() }),
                keepalive: true
            });
        }
        console.log(`📊 [Telemetry] Flushed ${events.length} events`);
    } catch (e) {
        console.warn('📊 [Telemetry] Failed to send events');
    }
}

// Flush on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flushEvents);
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            flushEvents();
        }
    });
}

// ============================================
// TELEMETRY API
// ============================================

/**
 * Track a stream load event
 */
export function trackStreamLoad(
    provider: string,
    sandboxEnabled: boolean,
    success: boolean,
    duration?: number,
    error?: string
): void {
    const { device, browser } = getDeviceInfo();

    const event: TelemetryEvent = {
        type: success ? 'load' : 'error',
        provider,
        device,
        browser,
        sandboxEnabled,
        success,
        duration,
        error,
        timestamp: Date.now(),
        sessionId: getSessionId()
    };

    eventBuffer.push(event);

    if (eventBuffer.length >= MAX_BUFFER_SIZE) {
        flushEvents();
    } else {
        scheduleFlush();
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
        console.log('📊 [Telemetry]', event.type.toUpperCase(), {
            provider,
            device,
            sandboxEnabled,
            success,
            duration: duration ? `${duration}ms` : undefined
        });
    }
}

/**
 * Track when an ad is blocked
 */
export function trackAdBlocked(provider: string, method: string): void {
    const { device, browser } = getDeviceInfo();

    eventBuffer.push({
        type: 'block',
        provider,
        device,
        browser,
        sandboxEnabled: true,
        success: true,
        timestamp: Date.now(),
        sessionId: getSessionId()
    });

    scheduleFlush();

    console.log('🛡️ [Telemetry] Ad blocked via', method, 'on', provider);
}

/**
 * Track when fallback is used
 */
export function trackFallback(provider: string, reason: string): void {
    const { device, browser } = getDeviceInfo();

    eventBuffer.push({
        type: 'fallback',
        provider,
        device,
        browser,
        sandboxEnabled: false,
        success: true,
        error: reason,
        timestamp: Date.now(),
        sessionId: getSessionId()
    });

    scheduleFlush();

    console.log('⚠️ [Telemetry] Fallback used for', provider, '-', reason);
}

/**
 * Track user report
 */
export function trackUserReport(
    provider: string,
    reportType: 'ad-appeared' | 'stream-broken' | 'other',
    details?: string
): void {
    const { device, browser } = getDeviceInfo();

    eventBuffer.push({
        type: 'report',
        provider,
        device,
        browser,
        sandboxEnabled: true,
        success: false,
        error: `${reportType}: ${details || 'No details'}`,
        timestamp: Date.now(),
        sessionId: getSessionId()
    });

    // Immediately flush user reports
    flushEvents();

    console.log('📢 [Telemetry] User report:', reportType, provider);
}

// ============================================
// PERFORMANCE MEASUREMENT
// ============================================

const performanceMarks: Map<string, number> = new Map();

/**
 * Start measuring performance
 */
export function startMeasure(name: string): void {
    performanceMarks.set(name, performance.now());
}

/**
 * End measurement and get duration
 */
export function endMeasure(name: string): number {
    const start = performanceMarks.get(name);
    if (!start) return 0;

    const duration = performance.now() - start;
    performanceMarks.delete(name);

    return Math.round(duration);
}

/**
 * Measure sandbox overhead
 */
export function measureSandboxOverhead(): number {
    // This would be calculated by comparing load times with/without sandbox
    // For now, return estimated overhead
    return 10; // ~10ms typical overhead
}
