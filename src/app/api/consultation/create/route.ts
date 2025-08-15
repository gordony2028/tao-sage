import { NextRequest, NextResponse } from 'next/server';
import { createConsultation } from '@/lib/consultation/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, userId, metadata } = body;

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

    // Extract IP address for metadata
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded
      ? forwarded.split(',')[0]
      : request.headers.get('x-real-ip') || 'unknown';

    // Create consultation with metadata
    const consultationInput = {
      question: question.trim(),
      userId,
      metadata: {
        method: metadata?.method || 'digital_coins',
        ...(ip !== 'unknown' && { ipAddress: ip }),
        ...(metadata?.userAgent && { userAgent: metadata.userAgent }),
      },
    };

    const result = await createConsultation(consultationInput);

    return NextResponse.json({
      success: true,
      consultation: {
        id: result.consultation.id,
        question: result.consultation.question,
        hexagram: result.hexagram,
        createdAt: result.consultation.createdAt,
      },
      hexagram: result.hexagram,
      interpretation: result.interpretation,
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
