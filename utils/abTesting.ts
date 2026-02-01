/**
 * 🛡️ A/B TESTING FRAMEWORK
 * 
 * Tests different ad-blocking approaches on different user segments.
 * Measures success rate, performance, and user satisfaction.
 * 
 * @version 1.0.0
 * @production true
 */

// ============================================
// TYPES
// ============================================

export interface ABTestVariant {
    id: string;
    name: string;
    description: string;
    weight: number; // Percentage of users (0-100)
    config: {
        useSandbox: boolean;
        sandboxPermissions?: string[];
        useClickShield: boolean;
        useServerProxy: boolean;
    };
}

export interface ABTest {
    id: string;
    name: string;
    description: string;
    active: boolean;
    startDate: number;
    endDate?: number;
    variants: ABTestVariant[];
}

export interface ABTestResult {
    testId: string;
    variantId: string;
    sessionId: string;
    timestamp: number;
    metrics: {
        adsBlocked: number;
        adsShown: number;
        streamLoaded: boolean;
        loadTime: number;
        userReported: boolean;
    };
}

// ============================================
// ACTIVE TESTS
// ============================================

const ACTIVE_TESTS: ABTest[] = [
    {
        id: 'sandbox_v2',
        name: 'Sandbox Permissions Test',
        description: 'Test different sandbox permission combinations',
        active: true,
        startDate: Date.now(),
        variants: [
            {
                id: 'control',
                name: 'Current Solution (Control)',
                description: 'Current sandbox with basic permissions',
                weight: 80, // 80% of users
                config: {
                    useSandbox: true,
                    sandboxPermissions: ['allow-scripts', 'allow-same-origin', 'allow-presentation', 'allow-forms'],
                    useClickShield: true,
                    useServerProxy: false
                }
            },
            {
                id: 'minimal',
                name: 'Minimal Sandbox',
                description: 'Minimum permissions needed',
                weight: 10, // 10% of users
                config: {
                    useSandbox: true,
                    sandboxPermissions: ['allow-scripts', 'allow-same-origin'],
                    useClickShield: true,
                    useServerProxy: false
                }
            },
            {
                id: 'no_shield',
                name: 'Sandbox Only (No Click Shield)',
                description: 'Remove click shield, rely only on sandbox',
                weight: 10, // 10% of users
                config: {
                    useSandbox: true,
                    sandboxPermissions: ['allow-scripts', 'allow-same-origin', 'allow-presentation', 'allow-forms'],
                    useClickShield: false,
                    useServerProxy: false
                }
            }
        ]
    }
];

// ============================================
// USER ASSIGNMENT
// ============================================

let userVariant: { testId: string; variant: ABTestVariant } | null = null;

/**
 * Get or assign user to a test variant
 */
export function getABTestVariant(): { testId: string; variant: ABTestVariant } | null {
    if (typeof window === 'undefined') return null;

    // Return cached assignment
    if (userVariant) return userVariant;

    // Check localStorage for existing assignment
    try {
        const stored = localStorage.getItem('ab_test_assignment');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Validate assignment is still valid
            const test = ACTIVE_TESTS.find(t => t.id === parsed.testId && t.active);
            if (test) {
                const variant = test.variants.find(v => v.id === parsed.variantId);
                if (variant) {
                    userVariant = { testId: test.id, variant };
                    return userVariant;
                }
            }
        }
    } catch (e) { }

    // Find active test and assign
    const activeTest = ACTIVE_TESTS.find(t => t.active);
    if (!activeTest) return null;

    // Random assignment based on weights
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variant of activeTest.variants) {
        cumulative += variant.weight;
        if (random <= cumulative) {
            userVariant = { testId: activeTest.id, variant };

            // Save assignment
            try {
                localStorage.setItem('ab_test_assignment', JSON.stringify({
                    testId: activeTest.id,
                    variantId: variant.id,
                    assignedAt: Date.now()
                }));
            } catch (e) { }

            console.log('🧪 [A/B Test] Assigned to variant:', variant.name);
            return userVariant;
        }
    }

    // Fallback to first variant
    userVariant = { testId: activeTest.id, variant: activeTest.variants[0] };
    return userVariant;
}

/**
 * Get current test configuration
 */
export function getTestConfig(): ABTestVariant['config'] | null {
    const assignment = getABTestVariant();
    return assignment?.variant.config || null;
}

/**
 * Check if sandbox should be used based on A/B test
 */
export function shouldUseSandboxForTest(): boolean {
    const config = getTestConfig();
    return config?.useSandbox ?? true;
}

/**
 * Get sandbox permissions from A/B test
 */
export function getSandboxPermissionsForTest(): string[] {
    const config = getTestConfig();
    return config?.sandboxPermissions || ['allow-scripts', 'allow-same-origin', 'allow-presentation', 'allow-forms'];
}

/**
 * Check if click shield should be used based on A/B test
 */
export function shouldUseClickShieldForTest(): boolean {
    const config = getTestConfig();
    return config?.useClickShield ?? true;
}

// ============================================
// RESULT TRACKING
// ============================================

const testResults: ABTestResult[] = [];

/**
 * Track test result
 */
export function trackTestResult(metrics: ABTestResult['metrics']): void {
    const assignment = getABTestVariant();
    if (!assignment) return;

    const result: ABTestResult = {
        testId: assignment.testId,
        variantId: assignment.variant.id,
        sessionId: getSessionId(),
        timestamp: Date.now(),
        metrics
    };

    testResults.push(result);

    // Send to server periodically
    if (testResults.length >= 10) {
        flushTestResults();
    }

    console.log('🧪 [A/B Test] Result tracked:', result.variantId, metrics);
}

function getSessionId(): string {
    if (typeof sessionStorage === 'undefined') return 'unknown';
    let id = sessionStorage.getItem('session_id');
    if (!id) {
        id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('session_id', id);
    }
    return id;
}

async function flushTestResults(): Promise<void> {
    if (testResults.length === 0) return;

    const results = [...testResults];
    testResults.length = 0;

    try {
        await fetch('/api/analytics/ab-test-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ results }),
            keepalive: true
        });
    } catch (e) {
        console.warn('🧪 [A/B Test] Failed to send results');
    }
}

// Flush on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flushTestResults);
}
