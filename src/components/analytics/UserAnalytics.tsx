'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase/client';

interface UserAnalytics {
  total_events: number;
  consultations_created: number;
  pages_viewed: number;
  last_activity: string | null;
  most_active_day: string | null;
}

export default function UserAnalytics() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get current user first
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/analytics/user?user_id=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Card variant="default">
        <CardHeader>
          <CardTitle>Your Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-flowing-water"></div>
            <p className="text-soft-gray">Loading your analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card variant="default">
        <CardHeader>
          <CardTitle>Your Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-soft-gray">No analytics data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle>Your Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Events */}
          <div className="rounded-lg bg-gentle-silver/10 p-4 text-center">
            <div className="text-2xl font-bold text-flowing-water">
              {analytics.total_events}
            </div>
            <div className="text-sm text-soft-gray">Total Events</div>
          </div>

          {/* Consultations Created */}
          <div className="rounded-lg bg-gentle-silver/10 p-4 text-center">
            <div className="text-2xl font-bold text-bamboo-green">
              {analytics.consultations_created}
            </div>
            <div className="text-sm text-soft-gray">Consultations</div>
          </div>

          {/* Pages Viewed */}
          <div className="rounded-lg bg-gentle-silver/10 p-4 text-center">
            <div className="text-2xl font-bold text-sunset-gold">
              {analytics.pages_viewed}
            </div>
            <div className="text-sm text-soft-gray">Pages Viewed</div>
          </div>

          {/* Last Activity */}
          <div className="rounded-lg bg-gentle-silver/10 p-4 text-center">
            <div className="text-lg font-bold text-mountain-stone">
              {analytics.last_activity
                ? new Date(analytics.last_activity).toLocaleDateString()
                : 'Never'}
            </div>
            <div className="text-sm text-soft-gray">Last Activity</div>
          </div>
        </div>

        {/* Most Active Day */}
        {analytics.most_active_day && (
          <div className="mt-6 rounded-lg border border-flowing-water/20 bg-flowing-water/10 p-4">
            <h4 className="mb-2 font-medium text-mountain-stone">
              Most Active Day
            </h4>
            <p className="text-soft-gray">
              Your most active day was {analytics.most_active_day}
            </p>
          </div>
        )}

        {/* Usage Insights */}
        <div className="mt-6 space-y-4">
          <h4 className="font-medium text-mountain-stone">Insights</h4>
          <div className="space-y-2 text-sm text-soft-gray">
            {analytics.consultations_created > 0 && (
              <p>
                • You&apos;ve created {analytics.consultations_created}{' '}
                consultation{analytics.consultations_created !== 1 ? 's' : ''}
              </p>
            )}
            {analytics.pages_viewed > 0 && (
              <p>
                • You&apos;ve explored {analytics.pages_viewed} different page
                {analytics.pages_viewed !== 1 ? 's' : ''} on your spiritual
                journey
              </p>
            )}
            {analytics.total_events >
              analytics.consultations_created + analytics.pages_viewed && (
              <p>
                • You&apos;ve engaged with{' '}
                {analytics.total_events -
                  analytics.consultations_created -
                  analytics.pages_viewed}{' '}
                other features
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
