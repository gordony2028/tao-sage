import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  createSupportTicket,
  getUserSupportTickets,
} from '@/lib/support/tickets';
import { getUserSubscriptionTier } from '@/lib/subscription/usage-tracking';
import { sendNewTicketNotification } from '@/lib/email/notifications';
import type { CreateTicketData } from '@/types/support';

export async function POST(request: NextRequest) {
  try {
    // Create a Supabase client with the user's session from cookies
    const supabase = createServerSupabaseClient();

    // Get the authenticated user with fallback authentication
    let {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Fallback: Try Authorization header if cookie auth fails
    if (authError || !user) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data: tokenData, error: tokenError } =
          await supabase.auth.getUser(token);
        if (!tokenError && tokenData.user) {
          user = tokenData.user;
          authError = null;
        }
      }
    }

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { category, subject, message, user_email, user_name } = body;

    // Validate required fields
    if (!category || !subject || !message || !user_email) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: category, subject, message, user_email',
        },
        { status: 400 }
      );
    }

    // Get user's subscription tier
    const subscriptionTier = await getUserSubscriptionTier(user.id);
    // Convert 'premium' to 'sage_pro' for compatibility
    const normalizedTier =
      subscriptionTier === 'premium' ? 'sage_pro' : subscriptionTier;

    // Create the ticket data
    const ticketData: CreateTicketData = {
      category,
      subject,
      message,
      user_email,
      user_name,
    };

    // Create the support ticket
    const ticket = await createSupportTicket(
      user.id,
      normalizedTier as any,
      ticketData
    );

    // Send email notification to admin (don't await to avoid blocking user)
    sendNewTicketNotification(ticket).catch(error =>
      console.error('Email notification failed:', error)
    );

    return NextResponse.json({
      success: true,
      ticket,
      supportInfo: {
        responseTime: subscriptionTier === 'free' ? '48-72 hours' : '24 hours',
        priority: ticket.priority,
        ticketId: ticket.id,
      },
    });
  } catch (error) {
    console.error('Support ticket creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Create a Supabase client with the user's session from cookies
    const supabase = createServerSupabaseClient();

    // Get the authenticated user
    let {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Fallback: Try Authorization header if cookie auth fails
    if (authError || !user) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data: tokenData, error: tokenError } =
          await supabase.auth.getUser(token);
        if (!tokenError && tokenData.user) {
          user = tokenData.user;
          authError = null;
        }
      }
    }

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status') as any;

    // Get user's tickets
    const { tickets, total } = await getUserSupportTickets(user.id, {
      limit,
      offset,
      status,
    });

    return NextResponse.json({
      success: true,
      tickets,
      total,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Support tickets fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
}
