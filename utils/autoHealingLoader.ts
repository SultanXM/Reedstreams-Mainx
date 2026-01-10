/**
 * 🛡️ AUTO-HEALING STREAM LOADER
 * 
 * Implements automatic fallback strategies when sandbox breaks a stream.
 * Tries multiple approaches to ensure the stream plays.
 * 
 * @version 1.0.0
 * @production true
 */

import { getProviderConfig, getSandboxString, reportStreamLoad } from '@/config/streamProviders';
import { trackStreamLoad, trackFallback, startMeasure, endMeasure } from './shieldTelemetry';

// ============================================
// TYPES
// ============================================

export interface StreamLoadResult {
    success: boolean;
    method: 'sandbox' | 'no-sandbox' | 'alternative-permissions' | 'server-proxy';
    sandboxString?: string;
    error?: string;
    loadTime: number;
}

export interface FallbackStrategy {
    name: string;
    sandboxString?: string;
    execute: () => Promise<boolean>;
}

// ============================================
// CACHED RESULTS
// ============================================

// Cache of what works for each provider+device combination
const workingConfigs: Map<string, string | null> = new Map();

function getCacheKey(provider: string, isMobile: boolean): string {
    return `${provider}:${isMobile ? 'mobile' : 'desktop'}`;
}

/**
 * Get cached working configuration for a provider
 */
export function getCachedConfig(provider: string, isMobile: boolean): string | null | undefined {
    return workingConfigs.get(getCacheKey(provider, isMobile));
}

/**
 * Save working configuration for a provider
 */
export function setCachedConfig(provider: string, isMobile: boolean, sandboxString: string | null): void {
    workingConfigs.set(getCacheKey(provider, isMobile), sandboxString);

    // Also save to localStorage for persistence
    try {
        const stored = JSON.parse(localStorage.getItem('stream_configs') || '{}');
        stored[getCacheKey(provider, isMobile)] = sandboxString;
        localStorage.setItem('stream_configs', JSON.stringify(stored));
    } catch (e) {
        // localStorage not available
    }
}

/**
 * Load cached configs from localStorage on startup
 */
export function loadCachedConfigs(): void {
    try {
        const stored = JSON.parse(localStorage.getItem('stream_configs') || '{}');
        Object.entries(stored).forEach(([key, value]) => {
            workingConfigs.set(key, value as string | null);
        });
        console.log('📦 [AutoHeal] Loaded', workingConfigs.size, 'cached configs');
    } catch (e) {
        // localStorage not available
    }
}

// Load on module init
if (typeof window !== 'undefined') {
    loadCachedConfigs();
}

// ============================================
// FALLBACK STRATEGIES
// ============================================

/**
 * Get ordered list of fallback strategies for a provider
 */
export function getFallbackStrategies(provider: string): Array<{
    name: string;
    sandboxString: string | null;
}> {
    const config = getProviderConfig(provider);
    const defaultSandbox = getSandboxString(provider);

    return [
        // Strategy 1: Default sandbox (blocks popups)
        {
            name: 'sandbox',
            sandboxString: defaultSandbox || 'allow-scripts allow-same-origin allow-presentation allow-forms'
        },

        // Strategy 2: More permissive sandbox (allows some features)
        {
            name: 'permissive-sandbox',
            sandboxString: 'allow-scripts allow-same-origin allow-presentation allow-forms allow-modals'
        },

        // Strategy 3: No sandbox (if stream provider doesn't work with sandbox)
        {
            name: 'no-sandbox',
            sandboxString: null
        }
    ];
}

// ============================================
// AUTO-HEALING LOGIC
// ============================================

/**
 * Determine the best sandbox configuration for a provider
 * Uses cached result if available, otherwise returns default
 */
export function getBestSandboxConfig(
    provider: string,
    isMobile: boolean
): { useSandbox: boolean; sandboxString: string | null } {
    // Check cache first
    const cached = getCachedConfig(provider, isMobile);
    if (cached !== undefined) {
        console.log('📦 [AutoHeal] Using cached config for', provider, ':', cached ? 'sandbox' : 'no-sandbox');
        return {
            useSandbox: cached !== null && isMobile,
            sandboxString: cached
        };
    }

    // Default: use sandbox on mobile
    const defaultSandbox = getSandboxString(provider);
    return {
        useSandbox: isMobile,
        sandboxString: isMobile ? defaultSandbox || 'allow-scripts allow-same-origin allow-presentation allow-forms' : null
    };
}

/**
 * Report that a stream loaded successfully with current config
 */
export function reportSuccess(provider: string, isMobile: boolean, sandboxString: string | null): void {
    setCachedConfig(provider, isMobile, sandboxString);
    reportStreamLoad(provider, true);

    console.log('✅ [AutoHeal]', provider, 'loaded successfully with', sandboxString ? 'sandbox' : 'no sandbox');
}

/**
 * Report that a stream failed with current config
 */
export function reportFailure(provider: string, isMobile: boolean, error: string): void {
    reportStreamLoad(provider, false);
    trackFallback(provider, error);

    // Get next fallback strategy
    const strategies = getFallbackStrategies(provider);
    const currentSandbox = getCachedConfig(provider, isMobile);

    // Find current strategy index
    let currentIndex = strategies.findIndex(s => s.sandboxString === currentSandbox);
    if (currentIndex === -1) currentIndex = 0;

    // Try next strategy
    const nextStrategy = strategies[currentIndex + 1];
    if (nextStrategy) {
        console.log('🔄 [AutoHeal] Trying fallback strategy:', nextStrategy.name);
        setCachedConfig(provider, isMobile, nextStrategy.sandboxString);
    } else {
        console.log('❌ [AutoHeal] All strategies exhausted for', provider);
    }
}

// ============================================
// IFRAME LOAD MONITORING
// ============================================

/**
 * Create an iframe load monitor
 * Returns a promise that resolves when iframe loads or rejects on timeout
 */
export function monitorIframeLoad(
    iframe: HTMLIFrameElement,
    timeoutMs: number = 30000
): Promise<boolean> {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.log('⏱️ [AutoHeal] Iframe load timeout');
            resolve(false);
        }, timeoutMs);

        iframe.onload = () => {
            clearTimeout(timeout);
            console.log('✅ [AutoHeal] Iframe loaded');
            resolve(true);
        };

        iframe.onerror = () => {
            clearTimeout(timeout);
            console.log('❌ [AutoHeal] Iframe error');
            resolve(false);
        };
    });
}

// ============================================
// UTILITY: Measure Load Performance
// ============================================

/**
 * Measure and track stream load time
 */
export function measureStreamLoad(provider: string): {
    start: () => void;
    end: (success: boolean, sandboxEnabled: boolean) => void;
} {
    const measureKey = `stream_load_${provider}_${Date.now()}`;

    return {
        start: () => {
            startMeasure(measureKey);
        },
        end: (success: boolean, sandboxEnabled: boolean) => {
            const duration = endMeasure(measureKey);
            trackStreamLoad(provider, sandboxEnabled, success, duration);
        }
    };
}
