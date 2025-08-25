/**
 * Streaming API endpoint for AI consultations
 * Provides real-time streaming responses with cost optimization
 */

import { NextRequest } from 'next/server';
import {
  streamConsultationInterpretation,
  ConsultationInput,
} from '@/lib/openai/consultation';
import { Hexagram } from '@/types/iching';
import { z } from 'zod';
import {
  checkSubscriptionLimits,
  trackConsultationUsage,
} from '@/lib/middleware/subscription-guard';

// Force Node.js runtime to avoid Edge Runtime compatibility issues with OpenAI SDK
export const runtime = 'nodejs';

// Request validation schema
const ConsultationRequestSchema = z.object({
  question: z.string().min(1).max(500),
  userId: z.string().uuid('User ID must be a valid UUID'),
  hexagram: z.object({
    number: z.number().min(1).max(64),
    name: z.string().min(1),
    lines: z.tuple([
      z.union([z.literal(6), z.literal(7), z.literal(8), z.literal(9)]),
      z.union([z.literal(6), z.literal(7), z.literal(8), z.literal(9)]),
      z.union([z.literal(6), z.literal(7), z.literal(8), z.literal(9)]),
      z.union([z.literal(6), z.literal(7), z.literal(8), z.literal(9)]),
      z.union([z.literal(6), z.literal(7), z.literal(8), z.literal(9)]),
      z.union([z.literal(6), z.literal(7), z.literal(8), z.literal(9)]),
    ]),
    changingLines: z.array(z.number()),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();

    // Validate input
    const validationResult = ConsultationRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          details: 'Validation failed',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { userId, ...consultationData } = validationResult.data;

    // Ensure required fields are present
    if (!consultationData.question) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          details: 'Question is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check subscription limits for freemium model
    const subscriptionCheck = await checkSubscriptionLimits(userId);
    if (!subscriptionCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Usage limit reached',
          message:
            subscriptionCheck.tier.tier === 'free'
              ? `You have reached your weekly limit of ${subscriptionCheck.tier.consultationsPerWeek} consultations. Upgrade to Sage+ for unlimited access!`
              : 'Please check your subscription status.',
          subscriptionData: subscriptionCheck,
          upgradeRequired: subscriptionCheck.upgradeRequired,
        }),
        {
          status: 429, // Too Many Requests
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get streaming response
    const stream = await streamConsultationInterpretation(
      consultationData as ConsultationInput
    );

    // Track the consultation usage after successful creation
    try {
      await trackConsultationUsage(userId);
    } catch (trackingError) {
      console.error('Usage tracking failed (non-fatal):', trackingError);
      // Don't fail the consultation if tracking fails
    }

    // Return as streaming response
    return new Response(stream as any, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Streaming consultation error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to generate consultation',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
