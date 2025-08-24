/**
 * Streaming API endpoint for AI consultations
 * Provides real-time streaming responses with cost optimization
 */

import { NextRequest } from 'next/server';
import { streamConsultationInterpretation } from '@/lib/openai/consultation';
import { z } from 'zod';

// Request validation schema
const ConsultationRequestSchema = z.object({
  question: z.string().min(1).max(500),
  hexagram: z.object({
    number: z.number().min(1).max(64),
    name: z.string().min(1),
    lines: z.array(z.number()).length(6),
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
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const consultation = validationResult.data;

    // Get streaming response
    const stream = await streamConsultationInterpretation(consultation);

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

// Enable streaming for this route
export const runtime = 'edge';
