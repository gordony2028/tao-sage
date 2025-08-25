/**
 * Usage Display Component
 * Shows consultation usage and subscription status
 */

'use client';

import { useUsageTracking } from '@/hooks/useUsageTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface UsageDisplayProps {
  userId: string;
  showUpgradeButton?: boolean;
  compact?: boolean;
}

export default function UsageDisplay({
  userId,
  showUpgradeButton = true,
  compact = false,
}: UsageDisplayProps) {
  const { usageData, isLoading, error, refreshUsage } = useUsageTracking({
    userId,
    autoRefresh: true,
  });

  if (isLoading && !usageData) {
    return (
      <div className="flex items-center gap-2 text-sm text-soft-gray">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-flowing-water border-t-transparent"></div>
        Loading usage data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        Unable to load usage data
        <button
          onClick={refreshUsage}
          className="ml-2 text-flowing-water underline hover:text-mountain-stone"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!usageData) {
    return null;
  }

  const {
    subscriptionTier,
    consultationsThisWeek,
    consultationsRemaining,
    isUnlimited,
  } = usageData;

  // Compact display for header/navigation
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Subscription Badge */}
        <div
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            subscriptionTier === 'sage_plus'
              ? 'bg-sunset-gold/20 text-sunset-gold'
              : 'bg-gentle-silver/20 text-soft-gray'
          }`}
        >
          {subscriptionTier === 'sage_plus' ? '✨ Sage+' : '🆓 Free'}
        </div>

        {/* Usage Info */}
        {!isUnlimited && (
          <div className="text-sm text-soft-gray">
            {consultationsRemaining > 0 ? (
              <span>
                <span className="font-medium text-mountain-stone">
                  {consultationsRemaining}
                </span>{' '}
                left this week
              </span>
            ) : (
              <span className="font-medium text-red-600">Limit reached</span>
            )}
          </div>
        )}

        {/* Upgrade Button for Free Users */}
        {subscriptionTier === 'free' && showUpgradeButton && (
          <Link href="/pricing">
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
          </Link>
        )}
      </div>
    );
  }

  // Full card display
  return (
    <Card variant="elevated" className="border border-gentle-silver/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span
            className={
              subscriptionTier === 'sage_plus'
                ? 'text-sunset-gold'
                : 'text-mountain-stone'
            }
          >
            {subscriptionTier === 'sage_plus'
              ? '✨ Sage+ Plan'
              : '🆓 Free Plan'}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-soft-gray">This Week</span>
            <span className="font-medium text-mountain-stone">
              {consultationsThisWeek} consultation
              {consultationsThisWeek !== 1 ? 's' : ''}
            </span>
          </div>

          {!isUnlimited && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-soft-gray">Remaining</span>
              <span
                className={`font-medium ${
                  consultationsRemaining > 0
                    ? 'text-bamboo-green'
                    : 'text-red-600'
                }`}
              >
                {consultationsRemaining} consultation
                {consultationsRemaining !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {isUnlimited && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-soft-gray">Access</span>
              <span className="font-medium text-sunset-gold">∞ Unlimited</span>
            </div>
          )}
        </div>

        {/* Progress Bar for Free Users */}
        {!isUnlimited && (
          <div className="space-y-1">
            <div className="h-2 w-full rounded-full bg-gentle-silver/20">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  consultationsRemaining > 0 ? 'bg-bamboo-green' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.max(10, (consultationsThisWeek / 3) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-soft-gray">
              Free plan: 3 consultations per week
            </p>
          </div>
        )}

        {/* Upgrade CTA for Free Users */}
        {subscriptionTier === 'free' && showUpgradeButton && (
          <div className="border-t border-gentle-silver/20 pt-2">
            <div className="space-y-2">
              <p className="text-sm text-soft-gray">
                Want unlimited consultations with AI insights?
              </p>
              <Link href="/pricing">
                <Button className="w-full">
                  Upgrade to Sage+ - $7.99/month
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Premium User Benefits */}
        {subscriptionTier === 'sage_plus' && (
          <div className="border-t border-gentle-silver/20 pt-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-sunset-gold">
                ✨ Sage+ Benefits Active
              </p>
              <ul className="space-y-1 text-xs text-soft-gray">
                <li>• Unlimited consultations</li>
                <li>• Enhanced AI interpretations</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
        )}

        {/* Weekly Reset Info */}
        {!isUnlimited && (
          <div className="text-xs text-soft-gray">
            Usage resets every Monday at midnight
          </div>
        )}
      </CardContent>
    </Card>
  );
}
