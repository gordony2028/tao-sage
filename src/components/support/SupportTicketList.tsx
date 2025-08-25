'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { SupportTicket, TicketStatus } from '@/types/support';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  SUPPORT_CATEGORIES,
} from '@/types/support';

interface SupportTicketListProps {
  userId: string;
}

export default function SupportTicketList({ userId }: SupportTicketListProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const ITEMS_PER_PAGE = 10;

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: ((currentPage - 1) * ITEMS_PER_PAGE).toString(),
      });

      if (filter !== 'all') {
        params.append('status', filter);
      }

      // Get the current session for authentication
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: Record<string, string> = {};

      // Add authorization header as fallback
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`/api/support/tickets?${params}`, {
        credentials: 'same-origin', // Include cookies for authentication
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to load support tickets');
      }

      const data = await response.json();
      setTickets(data.tickets);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading support tickets:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to load tickets'
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    loadTickets();
  }, [currentPage, filter, loadTickets]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'waiting_user':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-flowing-water"></div>
        <p className="text-soft-gray">Loading your support tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="default" className="py-8 text-center">
        <CardContent>
          <div className="mb-4 text-4xl">⚠️</div>
          <h3 className="mb-2 text-lg font-medium text-mountain-stone">
            Failed to Load Tickets
          </h3>
          <p className="mb-4 text-soft-gray">{error}</p>
          <Button onClick={loadTickets} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            'all',
            'open',
            'in_progress',
            'waiting_user',
            'resolved',
            'closed',
          ] as const
        ).map(status => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setCurrentPage(1);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-flowing-water text-white'
                : 'bg-gentle-silver/20 text-soft-gray hover:bg-gentle-silver/30'
            }`}
          >
            {status === 'all'
              ? 'All Tickets'
              : STATUS_LABELS[status as TicketStatus]}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <Card variant="default" className="py-12 text-center">
          <CardContent>
            <div className="mb-4 text-4xl">📭</div>
            <h3 className="mb-2 text-lg font-medium text-mountain-stone">
              No Support Tickets Found
            </h3>
            <p className="text-soft-gray">
              {filter === 'all'
                ? "You haven't submitted any support tickets yet."
                : `No tickets found with status: ${
                    STATUS_LABELS[filter as TicketStatus]
                  }`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <Card
              key={ticket.id}
              variant="default"
              className="transition-shadow hover:shadow-lg"
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="truncate text-lg font-semibold text-mountain-stone">
                        {ticket.subject}
                      </h3>
                      <span className="text-xs text-soft-gray">
                        #{ticket.id.slice(0, 8)}
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-2 py-1 text-xs ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {PRIORITY_LABELS[ticket.priority]}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {STATUS_LABELS[ticket.status]}
                      </span>
                      <span className="rounded-full border border-stone-gray/20 bg-gentle-silver/20 px-2 py-1 text-xs text-mountain-stone">
                        {SUPPORT_CATEGORIES[ticket.category]}
                      </span>
                    </div>

                    <p className="mb-3 line-clamp-2 text-sm text-soft-gray">
                      {ticket.message}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-soft-gray">
                      <span>Created: {formatDate(ticket.created_at)}</span>
                      <span>Updated: {formatDate(ticket.updated_at)}</span>
                      {ticket.subscription_tier === 'sage_plus' && (
                        <span className="font-medium text-sunset-gold">
                          ⭐ Priority
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    <Link href={`/support/tickets/${ticket.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-soft-gray">
            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, total)}-
            {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} tickets
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage * ITEMS_PER_PAGE >= total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
