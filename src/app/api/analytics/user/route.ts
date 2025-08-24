import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { getUserAnalytics } from '@/lib/analytics/events';

export async function GET(request: NextRequest) {
  try {
    // For this API, we'll need to get user ID from headers or token
    // For now, let's make this endpoint require user_id as a query parameter
    const userId = request.nextUrl.searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user analytics
    const analytics = await getUserAnalytics(userId);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
