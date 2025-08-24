import { supabaseAdmin } from '@/lib/supabase/client';

export interface UserEvent {
  user_id: string;
  event_type: string;
  event_data?: Record<string, any>;
  session_id?: string;
  ip_address?: string | undefined;
  user_agent?: string | undefined;
}

/**
 * Track a user event for analytics
 */
export async function trackEvent(event: UserEvent): Promise<void> {
  try {
    // Get IP address and user agent from request headers if available
    const eventData: UserEvent = {
      ...event,
      event_data: event.event_data || {},
      session_id: event.session_id || generateSessionId(),
      ip_address: event.ip_address || undefined,
      user_agent: event.user_agent || undefined,
    };

    const { error } = await supabaseAdmin.from('user_events').insert(eventData);

    if (error) {
      console.error('Failed to track event:', error);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Track consultation creation
 */
export async function trackConsultationCreated(
  userId: string,
  consultationData: {
    hexagram_number: number;
    consultation_method: string;
    has_changing_lines: boolean;
    question_length: number;
  }
): Promise<void> {
  await trackEvent({
    user_id: userId,
    event_type: 'consultation_created',
    event_data: consultationData,
  });
}

/**
 * Track consultation viewed
 */
export async function trackConsultationViewed(
  userId: string,
  consultationId: string
): Promise<void> {
  await trackEvent({
    user_id: userId,
    event_type: 'consultation_viewed',
    event_data: {
      consultation_id: consultationId,
    },
  });
}

/**
 * Track page view
 */
export async function trackPageView(
  userId: string | null,
  pagePath: string
): Promise<void> {
  if (!userId) return; // Skip tracking if no user ID

  await trackEvent({
    user_id: userId,
    event_type: 'page_view',
    event_data: {
      page: pagePath,
    },
  });
}

/**
 * Track user authentication
 */
export async function trackUserAuth(
  userId: string,
  authType: 'sign_up' | 'sign_in' | 'sign_out'
): Promise<void> {
  await trackEvent({
    user_id: userId,
    event_type: 'user_auth',
    event_data: {
      auth_type: authType,
    },
  });
}

/**
 * Track feature usage
 */
export async function trackFeatureUsage(
  userId: string | null,
  feature: string,
  data?: Record<string, any>
): Promise<void> {
  if (!userId) return; // Skip tracking if no user ID

  await trackEvent({
    user_id: userId,
    event_type: 'feature_usage',
    event_data: {
      feature,
      ...data,
    },
  });
}

/**
 * Generate a simple session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get user analytics summary
 */
export async function getUserAnalytics(userId: string): Promise<{
  total_events: number;
  consultations_created: number;
  pages_viewed: number;
  last_activity: string | null;
  most_active_day: string | null;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_events')
      .select('event_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const events = data || [];
    const consultationsCreated = events.filter(
      e => e.event_type === 'consultation_created'
    ).length;
    const pagesViewed = events.filter(e => e.event_type === 'page_view').length;
    const lastActivity = events.length > 0 ? events[0]?.created_at : null;

    // Calculate most active day
    const dayCount: Record<string, number> = {};
    events.forEach(event => {
      if (event?.created_at) {
        const day = new Date(event.created_at).toDateString();
        dayCount[day] = (dayCount[day] || 0) + 1;
      }
    });

    const mostActiveDay =
      Object.keys(dayCount).length > 0
        ? Object.entries(dayCount).sort(([, a], [, b]) => b - a)[0]?.[0] || null
        : null;

    return {
      total_events: events.length,
      consultations_created: consultationsCreated,
      pages_viewed: pagesViewed,
      last_activity: lastActivity || null,
      most_active_day: mostActiveDay,
    };
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return {
      total_events: 0,
      consultations_created: 0,
      pages_viewed: 0,
      last_activity: null,
      most_active_day: null,
    };
  }
}
