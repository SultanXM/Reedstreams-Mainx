/**
 * 🛡️ STREAM PROVIDER CONFIGURATION
 * 
 * Database of stream providers with their ad-blocking requirements.
 * This allows per-provider customization of sandbox settings.
 * 
 * @version 1.0.0
 * @production true
 */

export interface StreamProviderConfig {
    /** Provider identifier */
    id: string;
    /** Display name */
    name: string;
    /** Whether sandbox should be applied */
    needsSandbox: boolean;
    /** Sandbox permissions to allow */
    sandboxPermissions: string[];
    /** Known issues with this provider */
    knownIssues: string[];
    /** Alternative strategy if sandbox fails */
    fallbackStrategy: 'no-sandbox' | 'server-proxy' | 'alternative-source' | 'none';
    /** Whether this provider is currently active */
    active: boolean;
    /** Success rate tracking */
    stats?: {
        totalLoads: number;
        successfulLoads: number;
        failedLoads: number;
        lastUpdated: number;
    };
}

/**
 * Default sandbox permissions that work for most providers
 */
export const DEFAULT_SANDBOX_PERMISSIONS = [
    'allow-scripts',
    'allow-same-origin',
    'allow-presentation',
    'allow-forms'
];

/**
 * Stream provider database
 * Add new providers here as they are discovered
 */
export const STREAM_PROVIDERS: Record<string, StreamProviderConfig> = {
    // Primary provider
    'streamed.pk': {
        id: 'streamed.pk',
        name: 'Streamed.pk',
        needsSandbox: true,
        sandboxPermissions: DEFAULT_SANDBOX_PERMISSIONS,
        knownIssues: [],
        fallbackStrategy: 'no-sandbox',
        active: true
    },

    // Echo streams
    'echo': {
        id: 'echo',
        name: 'Echo Streams',
        needsSandbox: true,
        sandboxPermissions: DEFAULT_SANDBOX_PERMISSIONS,
        knownIssues: [],
        fallbackStrategy: 'no-sandbox',
        active: true
    },

    // Charlie streams  
    'charlie': {
        id: 'charlie',
        name: 'Charlie Streams',
        needsSandbox: true,
        sandboxPermissions: DEFAULT_SANDBOX_PERMISSIONS,
        knownIssues: [],
        fallbackStrategy: 'no-sandbox',
        active: true
    },

    // Admin streams
    'admin': {
        id: 'admin',
        name: 'Admin Streams',
        needsSandbox: true,
        sandboxPermissions: DEFAULT_SANDBOX_PERMISSIONS,
        knownIssues: [],
        fallbackStrategy: 'no-sandbox',
        active: true
    },

    // Bravo streams
    'bravo': {
        id: 'bravo',
        name: 'Bravo Streams',
        needsSandbox: true,
        sandboxPermissions: DEFAULT_SANDBOX_PERMISSIONS,
        knownIssues: [],
        fallbackStrategy: 'no-sandbox',
        active: true
    },

    // Default fallback for unknown providers
    'default': {
        id: 'default',
        name: 'Unknown Provider',
        needsSandbox: true,
        sandboxPermissions: DEFAULT_SANDBOX_PERMISSIONS,
        knownIssues: [],
        fallbackStrategy: 'no-sandbox',
        active: true
    }
};

/**
 * Get configuration for a stream provider
 */
export function getProviderConfig(providerIdOrUrl: string): StreamProviderConfig {
    // Normalize the provider ID
    const normalizedId = providerIdOrUrl.toLowerCase().trim();

    // Check for exact match
    if (STREAM_PROVIDERS[normalizedId]) {
        return STREAM_PROVIDERS[normalizedId];
    }

    // Check if URL contains known provider
    for (const [key, config] of Object.entries(STREAM_PROVIDERS)) {
        if (normalizedId.includes(key)) {
            return config;
        }
    }

    // Return default config
    return STREAM_PROVIDERS['default'];
}

/**
 * Get sandbox string for a provider
 */
export function getSandboxString(providerId: string): string | undefined {
    const config = getProviderConfig(providerId);

    if (!config.needsSandbox) {
        return undefined;
    }

    return config.sandboxPermissions.join(' ');
}

/**
 * Check if provider should use sandbox
 */
export function shouldUseSandbox(providerId: string, isMobile: boolean): boolean {
    const config = getProviderConfig(providerId);
    return config.needsSandbox && isMobile;
}

/**
 * Report a stream load result for analytics
 */
export function reportStreamLoad(providerId: string, success: boolean): void {
    const config = getProviderConfig(providerId);

    if (!config.stats) {
        config.stats = {
            totalLoads: 0,
            successfulLoads: 0,
            failedLoads: 0,
            lastUpdated: Date.now()
        };
    }

    config.stats.totalLoads++;
    if (success) {
        config.stats.successfulLoads++;
    } else {
        config.stats.failedLoads++;
    }
    config.stats.lastUpdated = Date.now();

    // Log for monitoring
    console.log(`📊 [StreamProvider] ${providerId}: ${success ? 'SUCCESS' : 'FAILED'} | Rate: ${((config.stats.successfulLoads / config.stats.totalLoads) * 100).toFixed(1)}%`);
}

/**
 * Get success rate for a provider
 */
export function getProviderSuccessRate(providerId: string): number {
    const config = getProviderConfig(providerId);

    if (!config.stats || config.stats.totalLoads === 0) {
        return 100; // Assume 100% if no data
    }

    return (config.stats.successfulLoads / config.stats.totalLoads) * 100;
}
