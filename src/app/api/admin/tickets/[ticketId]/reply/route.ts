import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { sendTicketReplyNotification } from '@/lib/email/notifications';

/**
 * Admin API to reply to support tickets
 * Usage: POST /api/admin/tickets/[ticketId]/reply
 * Body: { message: string, isInternal?: boolean }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { message, isInternal = false } = await request.json();
    const ticketId = params.ticketId;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Message content is required',
        },
        { status: 400 }
      );
    }

    console.log(`[ADMIN] Adding admin reply to ticket ${ticketId}`);

    // First, get the ticket to verify it exists and get user info
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        {
          error: 'Ticket not found',
        },
        { status: 404 }
      );
    }

    // Add admin message
    const { data: adminMessage, error: messageError } = await supabaseAdmin
      .from('support_ticket_messages')
      .insert({
        ticket_id: ticketId,
        sender_type: 'admin',
        sender_id: '00000000-0000-0000-0000-000000000000', // System admin UUID
        message: message.trim(),
        is_internal: isInternal,
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error adding admin message:', messageError);
      return NextResponse.json(
        {
          error: 'Failed to add admin message',
          details: messageError.message,
        },
        { status: 500 }
      );
    }

    // Update ticket status and timestamp
    const newStatus = isInternal ? ticket.status : 'waiting_user';
    await supabaseAdmin
      .from('support_tickets')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId);

    // Send email notification to user (only if not internal message)
    if (!isInternal) {
      try {
        await sendTicketReplyNotification(ticket, message, 'admin');
        console.log('✅ User notification sent for admin reply');
      } catch (emailError) {
        console.error('❌ Failed to send user notification:', emailError);
        // Don't fail the whole request if email fails
      }
    }

    console.log(`✅ Admin reply added to ticket ${ticketId}`);

    return NextResponse.json({
      success: true,
      message: adminMessage,
      ticketStatus: newStatus,
      notification: isInternal
        ? 'Internal message - no user notification'
        : 'User notified via email',
    });
  } catch (error) {
    console.error('Admin reply error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
