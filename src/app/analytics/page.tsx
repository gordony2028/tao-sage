'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import PerformanceDashboard from '@/components/analytics/PerformanceDashboard';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
          <p className="text-soft-gray">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card variant="default">
          <CardContent className="p-8 text-center">
            <div className="mb-4 text-4xl">🔒</div>
            <h2 className="mb-4 text-xl font-semibold text-mountain-stone">
              Authentication Required
            </h2>
            <p className="mb-6 text-soft-gray">
              Please sign in to access performance analytics and monitoring
              features.
            </p>
            <Button
              onClick={() => (window.location.href = '/auth')}
              variant="default"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-ink-black">
          Performance Analytics 性能分析
        </h1>
        <p className="text-soft-gray">
          Monitor your I Ching application&apos;s performance, frame rates,
          memory usage, and Core Web Vitals for an optimal spiritual practice
          experience.
        </p>
      </div>

      {/* Navigation breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-soft-gray">
          <a href="/" className="hover:text-mountain-stone">
            Home
          </a>
          <span className="mx-2">›</span>
          <a href="/profile" className="hover:text-mountain-stone">
            Profile
          </a>
          <span className="mx-2">›</span>
          <span className="text-mountain-stone">Performance Analytics</span>
        </nav>
      </div>

      {/* Performance Dashboard */}
      <PerformanceDashboard />

      {/* Cultural Context Notice */}
      <div className="mt-8">
        <Card variant="default">
          <CardContent className="pt-6">
            <div className="rounded-lg border-l-4 border-flowing-water bg-flowing-water/5 p-4">
              <h4 className="mb-2 flex items-center font-medium text-mountain-stone">
                <span className="mr-2">⚡</span>
                Performance & Spiritual Practice 性能与精神修行
              </h4>
              <div className="space-y-2 text-sm text-soft-gray">
                <p>
                  A smooth, responsive interface enhances your connection with
                  the ancient wisdom of the I Ching. Performance analytics help
                  ensure that technical issues don&apos;t interfere with your
                  spiritual practice and contemplation.
                </p>
                <p>
                  Just as the I Ching teaches balance and harmony, we strive for
                  optimal performance that supports mindful interaction with
                  this profound system of guidance.
                </p>
                <p className="italic">
                  &ldquo;The superior man is modest in his speech but exceeds in
                  his actions.&rdquo; - I Ching, Hexagram 41
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4">
        <Card variant="default">
          <CardContent className="pt-6">
            <div className="rounded-lg bg-gentle-silver/10 p-4">
              <h4 className="mb-2 flex items-center font-medium text-mountain-stone">
                <span className="mr-2">🔒</span>
                Privacy Notice 隐私声明
              </h4>
              <div className="space-y-2 text-sm text-soft-gray">
                <p>
                  • Performance data is collected locally in your browser and
                  used only to improve your experience
                </p>
                <p>
                  • No personal spiritual content or consultation data is
                  included in performance metrics
                </p>
                <p>
                  • You can export, clear, or disable performance monitoring at
                  any time through your preferences
                </p>
                <p>
                  • All data respects your privacy settings and cultural
                  sensitivity preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
