import { NextRequest, NextResponse } from 'next/server';
import { getUserUsageData } from '@/lib/subscription/usage-tracking';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const usageData = await getUserUsageData(userId);

    return NextResponse.json({
      success: true,
      usageData,
    });
  } catch (error) {
    console.error('Usage data fetch error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to fetch usage data.' },
    { status: 405 }
  );
}
