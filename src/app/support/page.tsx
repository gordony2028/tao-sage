'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SupportForm from '@/components/support/SupportForm';
import SupportTicketList from '@/components/support/SupportTicketList';
import { getSupportStats } from '@/lib/support/tickets';
import { getUserSubscriptionTier } from '@/lib/subscription/usage-tracking';
import type { SupportStats } from '@/types/support';

type ViewMode = 'new' | 'tickets';

export default function SupportPage() {
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [supportStats, setSupportStats] = useState<SupportStats | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('new');
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(
    null
  );
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

      // Get user's subscription tier and support stats
      try {
        const subscriptionTier = await getUserSubscriptionTier(user.id);
        // Convert 'premium' to 'sage_pro' for compatibility
        const normalizedTier =
          subscriptionTier === 'premium' ? 'sage_pro' : subscriptionTier;
        const stats = getSupportStats(normalizedTier as any);
        setSupportStats(stats);
      } catch (error) {
        console.error('Error loading support stats:', error);
        // Default to free tier support
        setSupportStats(getSupportStats('free'));
      }

      setUserLoading(false);
    };

    getUser();
  }, [router]);

  const handleSubmitSuccess = (ticketId: string) => {
    const successMsg = `Support ticket created successfully! Ticket ID: #${ticketId.slice(
      0,
      8
    )}`;
    setShowSuccessMessage(successMsg);
    setViewMode('tickets');

    // Clear success message after 10 seconds
    setTimeout(() => {
      setShowSuccessMessage(null);
    }, 10000);
  };

  if (userLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-paper-white to-gentle-silver/10">
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
            <p className="text-soft-gray">Loading support center...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || !supportStats) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-yang px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-ink-black">
              <span className="text-3xl">🎧</span>Support Center
            </h1>
            <p className="mb-6 text-lg text-gentle-silver">
              Get help with your spiritual journey. Our team is here to support
              you.
            </p>
          </div>

          {/* Success Message - Enhanced visibility */}
          {showSuccessMessage && (
            <div className="mb-6 rounded-lg border-2 border-green-400 bg-green-100 p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl text-green-600">✅</span>
                <p className="text-lg font-bold text-green-800">
                  {showSuccessMessage}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="flex rounded-lg bg-gentle-silver/20 p-1">
              <button
                onClick={() => setViewMode('new')}
                className={`rounded-md px-6 py-3 text-sm font-medium transition-colors ${
                  viewMode === 'new'
                    ? 'bg-white text-flowing-water shadow-sm'
                    : 'text-soft-gray hover:text-mountain-stone'
                }`}
              >
                Submit New Request
              </button>
              <button
                onClick={() => setViewMode('tickets')}
                className={`rounded-md px-6 py-3 text-sm font-medium transition-colors ${
                  viewMode === 'tickets'
                    ? 'bg-white text-flowing-water shadow-sm'
                    : 'text-soft-gray hover:text-mountain-stone'
                }`}
              >
                My Support Tickets
              </button>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'new' ? (
            <SupportForm
              supportStats={supportStats}
              userEmail={user.email || ''}
              userName={
                user.user_metadata?.full_name || user.user_metadata?.name
              }
              onSubmitSuccess={handleSubmitSuccess}
            />
          ) : (
            <div className="mx-auto max-w-4xl">
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-semibold text-mountain-stone">
                  Your Support Tickets
                </h2>
                <p className="text-soft-gray">
                  Track the status of your support requests and continue
                  conversations with our team.
                </p>
              </div>

              <SupportTicketList userId={user.id} />
            </div>
          )}

          {/* Help Resources */}
          <div className="mt-12">
            <h2 className="mb-6 text-center text-2xl font-semibold text-mountain-stone">
              Self-Help Resources
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              <Card variant="default" className="text-center">
                <CardHeader>
                  <div className="mb-2 text-4xl">📚</div>
                  <CardTitle>FAQ & Guides</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-soft-gray">
                    Find answers to common questions about I Ching consultations
                    and using Tao Sage.
                  </p>
                  <Link href="/learn/faq">
                    <Button variant="outline" className="w-full">
                      Browse FAQ
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card variant="default" className="text-center">
                <CardHeader>
                  <div className="mb-2 text-4xl">🎓</div>
                  <CardTitle>Learning Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-soft-gray">
                    Explore I Ching basics, hexagram meanings, and cultural
                    context.
                  </p>
                  <Link href="/learn">
                    <Button variant="outline" className="w-full">
                      Start Learning
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card variant="default" className="text-center">
                <CardHeader>
                  <div className="mb-2 text-4xl">💬</div>
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-soft-gray">
                    Connect with other practitioners and share your spiritual
                    journey.
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Information */}
          <Card
            variant="elevated"
            className="mt-12 bg-gradient-to-r from-flowing-water/5 to-bamboo-green/5"
          >
            <CardContent className="pt-6 text-center">
              <h3 className="mb-2 text-lg font-semibold text-mountain-stone">
                Need Additional Help?
              </h3>
              <p className="mb-4 text-soft-gray">
                Our support team is committed to helping you on your spiritual
                journey. We approach every inquiry with respect for the sacred
                nature of I Ching wisdom.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-soft-gray">
                <div>
                  Response Time: <strong>{supportStats.responseTime}</strong>
                </div>
                {supportStats.supportLevel === 'priority' && (
                  <div className="text-sunset-gold">
                    <strong>⭐ Priority Support Enabled</strong>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
