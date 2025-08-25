import { NextRequest, NextResponse } from 'next/server';
import { createConsultation } from '@/lib/consultation/service';
import {
  checkUsageLimit,
  trackConsultation,
  getUserUsageData,
} from '@/lib/subscription/usage-tracking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, userId, hexagram, metadata } = body;

    // Debug logging to track hexagram data flow
    if (process.env.NODE_ENV === 'development') {
      console.log('=== CONSULTATION API DEBUG ===');
      console.log(
        'Received hexagram from UI:',
        hexagram
          ? {
              number: hexagram.number,
              name: hexagram.name,
              changingLines: hexagram.changingLines,
            }
          : 'NO HEXAGRAM'
      );
    }

    // Validate required fields
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'User ID is required and must be a string' },
        { status: 400 }
      );
    }

    // Check usage limits for freemium model
    const canCreate = await checkUsageLimit(userId);
    if (!canCreate) {
      const usageData = await getUserUsageData(userId);

      return NextResponse.json(
        {
          error: 'Usage limit reached',
          message:
            usageData.subscriptionTier === 'free'
              ? 'You have reached your weekly limit of 3 consultations. Upgrade to Sage+ for unlimited access!'
              : 'Please check your subscription status.',
          usageData,
          upgradeRequired: true,
        },
        { status: 429 } // Too Many Requests
      );
    }

    // Extract IP address for metadata
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded
      ? forwarded.split(',')[0]
      : request.headers.get('x-real-ip') || 'unknown';

    // Create consultation with metadata - optionally use provided hexagram
    const consultationInput = {
      question: question.trim(),
      userId,
      ...(hexagram && { hexagram }), // Pass hexagram if provided by UI
      metadata: {
        method: metadata?.method || 'digital_coins',
        ...(ip !== 'unknown' && { ipAddress: ip }),
        ...(metadata?.userAgent && { userAgent: metadata.userAgent }),
      },
    };

    // Create and save consultation to database
    const result = await createConsultation(consultationInput);

    // Track the consultation usage for freemium limits
    try {
      await trackConsultation(userId);
    } catch (trackingError) {
      console.error('Usage tracking failed (non-fatal):', trackingError);
      // Don't fail the consultation if tracking fails
    }

    // Get updated usage data to return to client
    const usageData = await getUserUsageData(userId);

    return NextResponse.json({
      success: true,
      consultation: result.consultation,
      hexagram: result.hexagram,
      interpretation: result.interpretation,
      usageData,
    });
  } catch (error) {
    console.error('Consultation creation error:', error);

    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Consultation failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred during consultation' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create a consultation.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create a consultation.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create a consultation.' },
    { status: 405 }
  );
}
