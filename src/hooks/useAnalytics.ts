'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

/**
 * Custom hook for client-side analytics tracking
 */
export function useAnalytics() {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);

  // Generate session ID on mount
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }
  }, []);

  // Track page views
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'page_view',
            user_id: user?.id,
            event_data: {
              page: pathname,
            },
            session_id: sessionIdRef.current,
          }),
        });
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [pathname]);

  // Return tracking functions
  const trackEvent = async (
    eventType: string,
    eventData?: Record<string, any>
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          user_id: user?.id,
          event_data: eventData || {},
          session_id: sessionIdRef.current,
        }),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  const trackConsultationCreated = (consultationData: {
    hexagram_number: number;
    consultation_method: string;
    has_changing_lines: boolean;
    question_length: number;
  }) => {
    trackEvent('consultation_created', consultationData);
  };

  const trackFeatureUsage = (feature: string, data?: Record<string, any>) => {
    trackEvent('feature_usage', { feature, ...data });
  };

  return {
    trackEvent,
    trackConsultationCreated,
    trackFeatureUsage,
  };
}
