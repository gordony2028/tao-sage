import { supabase } from './client';

export interface UserEvent {
  id?: string;
  user_id?: string;
  event_type: string;
  event_data?: Record<string, any>;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

/**
 * Track a user event for analytics
 */
export async function trackEvent(event: UserEvent): Promise<void> {
  const { error } = await supabase.from('user_events').insert(event);

  if (error) {
    // Log error but don't throw - analytics should not break the app
    console.error('Failed to track event:', error.message);
  }
}

/**
 * Track consultation creation
 */
export async function trackConsultationCreated(
  userId: string,
  consultationId: string,
  hexagramNumber: number,
  sessionId?: string
): Promise<void> {
  const eventData: UserEvent = {
    user_id: userId,
    event_type: 'consultation_created',
    event_data: {
      consultation_id: consultationId,
      hexagram_number: hexagramNumber,
    },
  };

  if (sessionId) {
    eventData.session_id = sessionId;
  }

  await trackEvent(eventData);
}

/**
 * Track daily guidance view
 */
export async function trackDailyGuidanceViewed(
  userId: string,
  hexagramNumber: number,
  sessionId?: string
): Promise<void> {
  const eventData: UserEvent = {
    user_id: userId,
    event_type: 'daily_guidance_viewed',
    event_data: {
      hexagram_number: hexagramNumber,
    },
  };

  if (sessionId) {
    eventData.session_id = sessionId;
  }

  await trackEvent(eventData);
}

/**
 * Track user sign up
 */
export async function trackUserSignUp(
  userId: string,
  signUpMethod: string = 'email',
  sessionId?: string
): Promise<void> {
  const eventData: UserEvent = {
    user_id: userId,
    event_type: 'user_signup',
    event_data: {
      signup_method: signUpMethod,
    },
  };

  if (sessionId) {
    eventData.session_id = sessionId;
  }

  await trackEvent(eventData);
}

/**
 * Track user sign in
 */
export async function trackUserSignIn(
  userId: string,
  signInMethod: string = 'email',
  sessionId?: string
): Promise<void> {
  const eventData: UserEvent = {
    user_id: userId,
    event_type: 'user_signin',
    event_data: {
      signin_method: signInMethod,
    },
  };

  if (sessionId) {
    eventData.session_id = sessionId;
  }

  await trackEvent(eventData);
}

/**
 * Get user events (for debugging or admin purposes)
 */
export async function getUserEvents(
  userId: string,
  eventType?: string,
  limit: number = 50
): Promise<UserEvent[]> {
  let query = supabase
    .from('user_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (eventType) {
    query = query.eq('event_type', eventType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
