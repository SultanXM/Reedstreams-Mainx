import { NextRequest, NextResponse } from 'next/server';

/**
 * 🛡️ Shield Telemetry API
 * 
 * Receives telemetry events from the ad shield.
 * Stores data for analysis and monitoring.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { events, timestamp } = body;

        // Log summary
        const summary = {
            totalEvents: events?.length || 0,
            byType: {} as Record<string, number>,
            byDevice: {} as Record<string, number>,
            byProvider: {} as Record<string, number>,
            successRate: 0
        };

        let successCount = 0;
        let totalCount = 0;

        events?.forEach((event: any) => {
            // Count by type
            summary.byType[event.type] = (summary.byType[event.type] || 0) + 1;
            // Count by device
            summary.byDevice[event.device] = (summary.byDevice[event.device] || 0) + 1;
            // Count by provider
            summary.byProvider[event.provider] = (summary.byProvider[event.provider] || 0) + 1;

            // Track success rate
            if (event.type === 'load') {
                totalCount++;
                if (event.success) successCount++;
            }
        });

        summary.successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 100;

        console.log('📊 [Telemetry API] Received events:', summary);

        // TODO: Store in database for long-term analysis
        // await db.telemetryEvents.createMany({ data: events });

        return NextResponse.json({
            success: true,
            received: events?.length || 0,
            summary
        });
    } catch (error) {
        console.error('📊 [Telemetry API] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process telemetry' },
            { status: 500 }
        );
    }
}
