import { NextRequest, NextResponse } from 'next/server';

/**
 * 🧪 A/B Test Results API
 * 
 * Receives A/B test results for analysis.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { results } = body;

        // Aggregate results by variant
        const variantStats: Record<string, {
            count: number;
            adsBlocked: number;
            adsShown: number;
            loadSuccess: number;
            avgLoadTime: number;
            userReports: number;
        }> = {};

        results?.forEach((result: any) => {
            const key = `${result.testId}:${result.variantId}`;

            if (!variantStats[key]) {
                variantStats[key] = {
                    count: 0,
                    adsBlocked: 0,
                    adsShown: 0,
                    loadSuccess: 0,
                    avgLoadTime: 0,
                    userReports: 0
                };
            }

            const stats = variantStats[key];
            stats.count++;
            stats.adsBlocked += result.metrics.adsBlocked || 0;
            stats.adsShown += result.metrics.adsShown || 0;
            stats.loadSuccess += result.metrics.streamLoaded ? 1 : 0;
            stats.avgLoadTime = ((stats.avgLoadTime * (stats.count - 1)) + (result.metrics.loadTime || 0)) / stats.count;
            stats.userReports += result.metrics.userReported ? 1 : 0;
        });

        console.log('🧪 [A/B Test API] Results received:', variantStats);

        // TODO: Store in database
        // await db.abTestResults.createMany({ data: results });

        return NextResponse.json({
            success: true,
            received: results?.length || 0,
            variantStats
        });
    } catch (error) {
        console.error('🧪 [A/B Test API] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process results' },
            { status: 500 }
        );
    }
}
