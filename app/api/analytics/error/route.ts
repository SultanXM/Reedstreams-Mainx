import { NextRequest, NextResponse } from 'next/server';

/**
 * ❌ Error Logging API
 * 
 * Receives error reports from the client-side ad shield.
 * Used for debugging and monitoring system health.
 */
export async function POST(request: NextRequest) {
    try {
        const errorData = await request.json();
        const { error, stack, componentStack, timestamp, userAgent, url } = errorData;

        // Log error (always, even in production)
        console.error('❌ [Client Error]', {
            error,
            url,
            userAgent: userAgent?.substring(0, 50),
            time: new Date(timestamp).toISOString()
        });

        // In production, forward to error tracking service (Sentry, etc.)
        // if (process.env.SENTRY_DSN) {
        //     Sentry.captureException(new Error(error), {
        //         extra: { stack, componentStack, userAgent, url }
        //     });
        // }

        return NextResponse.json({
            success: true,
            message: 'Error logged'
        });
    } catch (error) {
        console.error('❌ [Error API] Failed to log error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to log error' },
            { status: 500 }
        );
    }
}
