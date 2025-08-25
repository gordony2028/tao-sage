import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import type { TicketStatus } from '@/types/support';

/**
 * Admin API to update ticket status
 * Usage: PATCH /api/admin/tickets/[ticketId]/status
 * Body: { status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed', adminNote?: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { status, adminNote } = await request.json();
    const ticketId = params.ticketId;

    // Validate status
    const validStatuses: TicketStatus[] = [
      'open',
      'in_progress',
      'waiting_user',
      'resolved',
      'closed',
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: 'Invalid status',
          validStatuses,
        },
        { status: 400 }
      );
    }

    console.log(`[ADMIN] Updating ticket ${ticketId} to status: ${status}`);

    // Update ticket status using admin client
    const { data: ticket, error: updateError } = await supabaseAdmin
      .from('support_tickets')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId)
      .select()
      .single();

    // If adminNote provided, add it as an internal admin message
    if (adminNote && ticket) {
      await supabaseAdmin.from('support_ticket_messages').insert({
        ticket_id: ticketId,
        sender_type: 'admin',
        sender_id: '00000000-0000-0000-0000-000000000000', // System admin UUID
        message: adminNote,
        is_internal: true,
      });
    }

    if (updateError) {
      console.error('Error updating ticket status:', updateError);
      return NextResponse.json(
        {
          error: 'Failed to update ticket status',
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    if (!ticket) {
      return NextResponse.json(
        {
          error: 'Ticket not found',
        },
        { status: 404 }
      );
    }

    // If status is closed/resolved, could trigger notification email here
    console.log(`✅ Ticket ${ticketId} updated to ${status}`);

    return NextResponse.json({
      success: true,
      ticket,
      message: `Ticket status updated to ${status}`,
    });
  } catch (error) {
    console.error('Admin ticket status update error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Get ticket details (admin view)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const ticketId = params.ticketId;

    // Get ticket with messages using admin client
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketError) {
      return NextResponse.json(
        {
          error: 'Ticket not found',
          details: ticketError.message,
        },
        { status: 404 }
      );
    }

    // Get messages
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('support_ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      success: true,
      ticket: {
        ...ticket,
        messages: messages || [],
      },
    });
  } catch (error) {
    console.error('Admin ticket fetch error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
