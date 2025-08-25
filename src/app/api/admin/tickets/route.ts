import { NextRequest, NextResponse } from 'next/server';
import { getAllSupportTickets } from '@/lib/support/tickets';
import type { TicketStatus, TicketPriority } from '@/types/support';

/**
 * Admin API to get all support tickets with filters
 * Usage: GET /api/admin/tickets?status=open&priority=high&limit=50
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Parse query parameters
    const status = url.searchParams.get('status') as TicketStatus | null;
    const priority = url.searchParams.get('priority') as TicketPriority | null;
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    console.log('[ADMIN] Fetching tickets with filters:', {
      status,
      priority,
      limit,
      offset,
    });

    // Get filtered tickets using existing admin function
    const { tickets, total } = await getAllSupportTickets({
      status: status || undefined,
      priority: priority || undefined,
      limit,
      offset,
    });

    // Add summary stats
    const statusCounts = tickets.reduce(
      (acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      success: true,
      tickets,
      total,
      summary: {
        statusCounts,
        showing: tickets.length,
        offset,
        hasMore: offset + limit < total,
      },
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
        nextOffset: offset + limit < total ? offset + limit : null,
      },
    });
  } catch (error) {
    console.error('Admin tickets fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch tickets',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
