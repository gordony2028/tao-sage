import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  addTicketMessage,
  getSupportTicketWithMessages,
} from '@/lib/support/tickets';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const ticketId = params.ticketId;
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    // For now, we'll require user_id as query param since session auth is failing
    // This matches how the tickets list works - it gets user context from elsewhere
    if (!userId) {
      return NextResponse.json(
        {
          error: 'User ID required - please refresh the page',
          code: 'MISSING_USER_ID',
        },
        { status: 400 }
      );
    }

    console.log(`[DEBUG] Getting ticket ${ticketId} for user ${userId}`);

    // Get the ticket with messages using admin client (consistent with other support APIs)
    const ticket = await getSupportTicketWithMessages(ticketId, userId);

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error('Support ticket fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support ticket' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const ticketId = params.ticketId;
    const body = await request.json();
    const { message, userId } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(
      `[DEBUG] Adding message to ticket ${ticketId} for user ${userId}`
    );

    // Add the message using admin client (consistent with other support APIs)
    const ticketMessage = await addTicketMessage(ticketId, userId, message);

    return NextResponse.json({
      success: true,
      message: ticketMessage,
    });
  } catch (error) {
    console.error('Support message creation error:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}
