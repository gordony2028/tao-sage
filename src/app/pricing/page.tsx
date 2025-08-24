'use client';

import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import PricingCard from '@/components/subscription/PricingCard';
import Button from '@/components/ui/Button';
import { SUBSCRIPTION_PLANS } from '@/types/subscription';

export default function PricingPage() {
  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      // Redirect to signup
      window.location.href = '/auth/signup';
    } else {
      // Redirect to subscription flow (to be implemented)
      console.log(`Selected plan: ${planId}`);
      // TODO: Implement Stripe integration
      alert(
        'Subscription flow coming soon! For now, you can start with our free tier.'
      );
      window.location.href = '/auth/signup';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-paper-white to-gentle-silver/20 py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-mountain-stone lg:text-5xl">
              Choose Your Path
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-soft-gray">
              Begin your journey with ancient wisdom. Start free, upgrade when
              you&apos;re ready for deeper insights.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto mb-12 grid max-w-4xl gap-8 md:grid-cols-2">
            <PricingCard
              plan={SUBSCRIPTION_PLANS.free}
              onSelect={handlePlanSelect}
            />
            <PricingCard
              plan={SUBSCRIPTION_PLANS.sage_plus}
              featured={true}
              onSelect={handlePlanSelect}
            />
          </div>

          {/* Coming Soon - Sage Pro */}
          <div className="mx-auto mb-12 max-w-2xl">
            <div className="rounded-lg border-2 border-dashed border-gentle-silver/30 p-8 text-center">
              <h3 className="mb-2 text-xl font-bold text-mountain-stone">
                Sage Pro - Coming Soon
              </h3>
              <p className="mb-4 text-soft-gray">
                Advanced features including pattern recognition, calendar
                integration, and professional tools will be available in future
                releases.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
                <span>🔮</span>
                Advanced pattern recognition in development
              </div>
            </div>
          </div>

          {/* Enterprise Section */}
          <Card
            variant="elevated"
            className="mx-auto mb-12 max-w-4xl text-center"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <span className="text-2xl">💎</span>
                Enterprise & Partnerships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 leading-relaxed text-soft-gray">
                Custom solutions for life coaches, therapists, corporate
                wellness programs, and educational institutions. White-label
                options available.
              </p>
              <Button variant="outline">Contact Sales</Button>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-mountain-stone">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <Card variant="default">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    What happens when I exceed my free tier limits?
                  </h3>
                  <p className="text-sm text-soft-gray">
                    Your free tier resets weekly (3 consultations per week). If
                    you need more consultations before the reset, you can
                    upgrade to Sage+ for unlimited access. Your consultation
                    history remains accessible regardless of your tier.
                  </p>
                </CardContent>
              </Card>

              <Card variant="default">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    How do the AI-enhanced interpretations work?
                  </h3>
                  <p className="text-sm text-soft-gray">
                    Sage+ users receive AI-enhanced interpretations that
                    consider your personal question and context while
                    maintaining traditional I Ching wisdom. Free users receive
                    traditional interpretations only. All AI content is
                    culturally validated and respects ancient teachings.
                  </p>
                </CardContent>
              </Card>

              <Card variant="default">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    Can I cancel anytime?
                  </h3>
                  <p className="text-sm text-soft-gray">
                    Yes, you can cancel your subscription at any time.
                    You&apos;ll continue to have access to premium features
                    until the end of your billing period, then automatically
                    return to the free tier.
                  </p>
                </CardContent>
              </Card>

              <Card variant="default">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-medium text-mountain-stone">
                    Is my spiritual data private and secure?
                  </h3>
                  <p className="text-sm text-soft-gray">
                    Absolutely. We understand the deeply personal nature of
                    spiritual guidance. Your questions and consultations are
                    encrypted and never shared. Read our{' '}
                    <a
                      href="/privacy"
                      className="text-flowing-water hover:text-mountain-stone"
                    >
                      privacy policy
                    </a>{' '}
                    for full details.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 border-t border-gentle-silver/20 pt-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-soft-gray">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                Privacy Focused
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">✓</span>
                Cancel Anytime
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🏮</span>
                Culturally Authentic
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                Scholar Reviewed
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
