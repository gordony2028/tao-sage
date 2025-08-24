import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { trackEvent } from '@/lib/analytics/events';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headersList = headers();

    // Get client IP and user agent
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || request.ip;
    const userAgent = headersList.get('user-agent');

    // Track the event with additional metadata
    await trackEvent({
      ...body,
      ip_address: ip,
      user_agent: userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
