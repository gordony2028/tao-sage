/**
 * Daily Guidance API Endpoint
 * Provides consistent daily hexagrams with user progress tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateDailyGuidance,
  hasAccessedDailyGuidance,
  calculateDailyStreak,
} from '@/lib/iching/daily';
import { supabaseAdmin } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics/events';

// Force Node.js runtime for better performance with database operations
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const startTime = performance.now();

  try {
    // Get user from query parameters or headers
    const userId = request.nextUrl.searchParams.get('user_id');
    const timezone = request.nextUrl.searchParams.get('timezone') || 'UTC';

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user's daily guidance history
    const { data: guidanceHistory, error: historyError } = await supabaseAdmin
      .from('user_events')
      .select('created_at')
      .eq('user_id', userId)
      .eq('event_type', 'daily_guidance_accessed')
      .order('created_at', { ascending: false });

    if (historyError) {
      console.error('Error fetching guidance history:', historyError);
    }

    // Calculate streak
    const accessDates = (guidanceHistory || []).map(event => event.created_at);
    const currentStreak = calculateDailyStreak(accessDates, timezone);

    // Check if accessed today
    const lastAccessed = accessDates[0] || null;
    const accessedToday = hasAccessedDailyGuidance(lastAccessed, timezone);

    // Generate today's guidance
    const dailyGuidance = generateDailyGuidance(
      userId,
      undefined,
      timezone,
      currentStreak
    );

    // Track access if not accessed today
    if (!accessedToday) {
      await trackEvent({
        user_id: userId,
        event_type: 'daily_guidance_accessed',
        event_data: {
          hexagram_number: dailyGuidance.hexagram.number,
          streak: currentStreak,
          timezone,
        },
      });
    }

    const responseTime = performance.now() - startTime;

    // Track performance metrics
    console.log(
      `Daily guidance API response time: ${responseTime.toFixed(2)}ms`
    );

    return NextResponse.json({
      guidance: dailyGuidance,
      accessed_today: accessedToday,
      streak: currentStreak,
      _performance: {
        responseTime: Math.round(responseTime),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Daily guidance error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate daily guidance',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();

  try {
    const body = await request.json();
    const { user_id, action, data } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    switch (action) {
      case 'mark_reflection_complete':
        // Track reflection completion
        await trackEvent({
          user_id,
          event_type: 'daily_reflection_completed',
          event_data: {
            hexagram_number: data?.hexagram_number,
            reflection_text: data?.reflection_text,
            completion_time: data?.completion_time,
          },
        });
        break;

      case 'share_daily_wisdom':
        // Track wisdom sharing
        await trackEvent({
          user_id,
          event_type: 'daily_wisdom_shared',
          event_data: {
            hexagram_number: data?.hexagram_number,
            share_platform: data?.platform,
            share_type: data?.type,
          },
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const responseTime = performance.now() - startTime;

    return NextResponse.json({
      success: true,
      _performance: {
        responseTime: Math.round(responseTime),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Daily guidance action error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process action',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
