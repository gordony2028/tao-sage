export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'waiting_user'
  | 'resolved'
  | 'closed';
export type TicketCategory =
  | 'technical'
  | 'billing'
  | 'feature'
  | 'account'
  | 'other';
export type MessageSenderType = 'user' | 'admin';

export interface SupportTicket {
  id: string;
  user_id: string;
  subscription_tier: 'free' | 'sage_plus' | 'sage_pro';
  priority: TicketPriority;
  category: TicketCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  admin_notes?: string;
  user_email: string;
  user_name?: string;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  sender_type: MessageSenderType;
  sender_id?: string;
  message: string;
  created_at: string;
  is_internal: boolean;
}

export interface CreateTicketData {
  category: TicketCategory;
  subject: string;
  message: string;
  user_email: string;
  user_name?: string;
}

export interface SupportStats {
  responseTime: string; // e.g., "24 hours" or "48-72 hours"
  supportLevel: 'standard' | 'priority' | 'premium';
  features: string[];
}

export interface TicketWithMessages extends SupportTicket {
  messages: SupportTicketMessage[];
}

export const SUPPORT_CATEGORIES: Record<TicketCategory, string> = {
  technical: 'Technical Issue',
  billing: 'Billing & Subscriptions',
  feature: 'Feature Request',
  account: 'Account Management',
  other: 'Other',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low Priority',
  normal: 'Normal Priority',
  high: 'High Priority',
  urgent: 'Urgent',
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  waiting_user: 'Waiting for User',
  resolved: 'Resolved',
  closed: 'Closed',
};
