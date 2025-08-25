'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { TicketWithMessages, SupportTicketMessage } from '@/types/support';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  SUPPORT_CATEGORIES,
} from '@/types/support';

interface TicketDetailPageProps {
  params: { ticketId: string };
}

export default function TicketDetailPage({ params }: TicketDetailPageProps) {
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [ticket, setTicket] = useState<TicketWithMessages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [submittingMessage, setSubmittingMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/auth/signin');
        return;
      }

      setUser(user);
      setUserLoading(false);
    };

    getUser();
  }, [router]);

  const loadTicket = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/support/tickets/${params.ticketId}/messages?user_id=${user.id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Support ticket not found or access denied');
        } else {
          throw new Error('Failed to load support ticket');
        }
        return;
      }

      const data = await response.json();
      setTicket(data.ticket);
    } catch (error) {
      console.error('Error loading support ticket:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to load ticket'
      );
    } finally {
      setLoading(false);
    }
  }, [user, params.ticketId]);

  useEffect(() => {
    if (user) {
      loadTicket();
    }
  }, [user, params.ticketId, loadTicket]);

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || submittingMessage) return;

    try {
      setSubmittingMessage(true);

      const response = await fetch(
        `/api/support/tickets/${params.ticketId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: newMessage.trim(),
            userId: user.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();

      // Add the new message to the ticket
      if (ticket) {
        setTicket({
          ...ticket,
          messages: [...ticket.messages, result.message],
        });
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error toast here
    } finally {
      setSubmittingMessage(false);
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

  if (userLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-paper-white to-gentle-silver/10">
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
            <p className="text-soft-gray">Loading support ticket...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="bg-yang px-4 py-8">
          <div className="container mx-auto max-w-4xl">
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-flowing-water"></div>
              <p className="text-soft-gray">
                Loading support ticket details...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !ticket) {
    return (
      <Layout>
        <div className="bg-yang px-4 py-8">
          <div className="container mx-auto max-w-4xl">
            <Card variant="default" className="py-12 text-center">
              <CardContent>
                <div className="mb-4 text-4xl">⚠️</div>
                <h3 className="mb-2 text-lg font-medium text-mountain-stone">
                  {error || 'Support ticket not found'}
                </h3>
                <p className="mb-6 text-soft-gray">
                  The support ticket you&apos;re looking for doesn&apos;t exist
                  or you don&apos;t have permission to view it.
                </p>
                <Link href="/support">
                  <Button variant="outline">Back to Support Center</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-yang px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/support"
              className="text-sm text-flowing-water hover:underline"
            >
              ← Back to Support Center
            </Link>
          </div>

          {/* Ticket Header */}
          <Card variant="default" className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-2 text-xl">
                    {ticket.subject}
                  </CardTitle>
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
                    {ticket.subscription_tier === 'sage_plus' && (
                      <span className="rounded-full border border-sunset-gold/30 bg-sunset-gold/20 px-2 py-1 text-xs text-sunset-gold">
                        ⭐ Priority Support
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-soft-gray">
                  <div>Ticket #{ticket.id.slice(0, 8)}</div>
                  <div>Created: {formatDate(ticket.created_at)}</div>
                  <div>Updated: {formatDate(ticket.updated_at)}</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Original Message */}
          <Card variant="default" className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-flowing-water text-sm font-bold text-white">
                  {ticket.user_name?.charAt(0)?.toUpperCase() ||
                    ticket.user_email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-mountain-stone">
                    {ticket.user_name || ticket.user_email}
                  </div>
                  <div className="text-sm text-soft-gray">
                    {formatDate(ticket.created_at)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{ticket.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          {ticket.messages.length > 0 && (
            <div className="mb-6 space-y-4">
              {ticket.messages.map(message => (
                <Card
                  key={message.id}
                  variant="default"
                  className={
                    message.sender_type === 'admin'
                      ? 'border-blue-200 bg-blue-50'
                      : ''
                  }
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          message.sender_type === 'admin'
                            ? 'bg-blue-600 text-white'
                            : 'bg-flowing-water text-white'
                        }`}
                      >
                        {message.sender_type === 'admin'
                          ? '🎧'
                          : ticket.user_name?.charAt(0)?.toUpperCase() ||
                            ticket.user_email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-mountain-stone">
                          {message.sender_type === 'admin'
                            ? 'Support Team'
                            : ticket.user_name || ticket.user_email}
                        </div>
                        <div className="text-sm text-soft-gray">
                          {formatDate(message.created_at)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{message.message}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Reply Form */}
          {ticket.status !== 'closed' && (
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  Add Reply
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  <div>
                    <textarea
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-flowing-water"
                      placeholder="Type your message here..."
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-soft-gray">
                      {ticket.subscription_tier === 'sage_plus'
                        ? 'Priority support - expect a response within 24 hours'
                        : 'Standard support - expect a response within 48-72 hours'}
                    </p>

                    <Button
                      type="submit"
                      disabled={submittingMessage || !newMessage.trim()}
                      className={
                        ticket.subscription_tier === 'sage_plus'
                          ? 'bg-sunset-gold hover:bg-sunset-gold/90'
                          : ''
                      }
                    >
                      {submittingMessage ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        'Send Reply'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Closed Ticket Notice */}
          {ticket.status === 'closed' && (
            <Card variant="default" className="border-gray-200 bg-gray-50">
              <CardContent className="pt-6 text-center">
                <div className="mb-2 text-4xl">🔒</div>
                <h3 className="mb-2 font-medium text-gray-700">
                  This ticket has been closed
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  If you need further assistance, please create a new support
                  ticket.
                </p>
                <Link href="/support">
                  <Button variant="outline" size="sm">
                    Create New Ticket
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
