import { supabaseAdmin } from '@/lib/supabase/client';
import type {
  SupportTicket,
  SupportTicketMessage,
  CreateTicketData,
  TicketWithMessages,
  TicketPriority,
  TicketStatus,
} from '@/types/support';
import type { SubscriptionTier } from '@/lib/subscription/usage-tracking';

/**
 * Create a new support ticket
 */
export async function createSupportTicket(
  userId: string,
  subscriptionTier: SubscriptionTier,
  ticketData: CreateTicketData
): Promise<SupportTicket> {
  // Auto-assign priority based on subscription tier
  let priority: TicketPriority = 'normal';
  if (subscriptionTier === 'sage_plus' || subscriptionTier === 'sage_pro') {
    priority = 'high';
  }

  const { data, error } = await supabaseAdmin
    .from('support_tickets')
    .insert({
      user_id: userId,
      subscription_tier: subscriptionTier,
      priority,
      category: ticketData.category,
      subject: ticketData.subject,
      message: ticketData.message,
      user_email: ticketData.user_email,
      user_name: ticketData.user_name,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating support ticket:', error);
    throw new Error('Failed to create support ticket');
  }

  return data as SupportTicket;
}

/**
 * Get user's support tickets
 */
export async function getUserSupportTickets(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    status?: TicketStatus;
  } = {}
): Promise<{ tickets: SupportTicket[]; total: number }> {
  const { limit = 20, offset = 0, status } = options;

  let query = supabaseAdmin
    .from('support_tickets')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching support tickets:', error);
    throw new Error('Failed to fetch support tickets');
  }

  return {
    tickets: data as SupportTicket[],
    total: count || 0,
  };
}

/**
 * Get a specific support ticket with messages
 */
export async function getSupportTicketWithMessages(
  ticketId: string,
  userId: string
): Promise<TicketWithMessages | null> {
  // Get the ticket
  const { data: ticket, error: ticketError } = await supabaseAdmin
    .from('support_tickets')
    .select('*')
    .eq('id', ticketId)
    .eq('user_id', userId)
    .single();

  if (ticketError || !ticket) {
    console.error('Error fetching support ticket:', ticketError);
    return null;
  }

  // Get the messages
  const { data: messages, error: messagesError } = await supabaseAdmin
    .from('support_ticket_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .eq('is_internal', false) // Only public messages
    .order('created_at', { ascending: true });

  if (messagesError) {
    console.error('Error fetching ticket messages:', messagesError);
    return { ...ticket, messages: [] } as TicketWithMessages;
  }

  return {
    ...ticket,
    messages: messages as SupportTicketMessage[],
  } as TicketWithMessages;
}

/**
 * Add a message to a support ticket
 */
export async function addTicketMessage(
  ticketId: string,
  userId: string,
  message: string
): Promise<SupportTicketMessage> {
  // Verify user owns the ticket
  const { data: ticket, error: ticketError } = await supabaseAdmin
    .from('support_tickets')
    .select('id')
    .eq('id', ticketId)
    .eq('user_id', userId)
    .single();

  if (ticketError || !ticket) {
    throw new Error('Ticket not found or access denied');
  }

  const { data, error } = await supabaseAdmin
    .from('support_ticket_messages')
    .insert({
      ticket_id: ticketId,
      sender_type: 'user',
      sender_id: userId,
      message,
      is_internal: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding ticket message:', error);
    throw new Error('Failed to add message');
  }

  // Update ticket status to indicate user response
  await supabaseAdmin
    .from('support_tickets')
    .update({
      status: 'open', // Reset to open if it was waiting_user
      updated_at: new Date().toISOString(),
    })
    .eq('id', ticketId)
    .eq('user_id', userId);

  return data as SupportTicketMessage;
}

/**
 * Get support statistics for user's subscription tier
 */
export function getSupportStats(subscriptionTier: SubscriptionTier) {
  if (subscriptionTier === 'sage_plus' || subscriptionTier === 'sage_pro') {
    return {
      responseTime: '24 hours',
      supportLevel: 'priority' as const,
      features: [
        'Priority email support',
        '24-hour response guarantee',
        'Direct support channel',
        'Ticket history tracking',
      ],
    };
  }

  return {
    responseTime: '48-72 hours',
    supportLevel: 'standard' as const,
    features: [
      'Email support',
      'FAQ and help center',
      'Community resources',
      'Basic ticket tracking',
    ],
  };
}

/**
 * Admin function to get all tickets (requires admin privileges)
 */
export async function getAllSupportTickets(
  options: {
    limit?: number;
    offset?: number;
    priority?: TicketPriority;
    status?: TicketStatus;
    subscriptionTier?: SubscriptionTier;
  } = {}
) {
  const {
    limit = 50,
    offset = 0,
    priority,
    status,
    subscriptionTier,
  } = options;

  let query = supabaseAdmin
    .from('support_tickets')
    .select('*', { count: 'exact' })
    .order('priority', { ascending: false }) // Urgent first
    .order('created_at', { ascending: true }); // Older first within priority

  if (priority) query = query.eq('priority', priority);
  if (status) query = query.eq('status', status);
  if (subscriptionTier) query = query.eq('subscription_tier', subscriptionTier);

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching all support tickets:', error);
    throw new Error('Failed to fetch tickets');
  }

  return {
    tickets: data as SupportTicket[],
    total: count || 0,
  };
}
