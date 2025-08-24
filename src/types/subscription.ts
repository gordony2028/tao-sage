export type SubscriptionTier = 'free' | 'sage_plus' | 'sage_pro';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  period: 'month' | 'year' | 'forever';
  description: string;
  features: string[];
  limitations: SubscriptionLimits;
}

export interface SubscriptionLimits {
  consultationsPerWeek: number | 'unlimited';
  historyDays: number | 'unlimited';
  aiInsights: boolean;
  patternRecognition: boolean;
  communityAccess: 'read-only' | 'full' | 'none';
  calendarIntegration: boolean;
  proactiveMonitoring: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Seeker',
    price: 0,
    period: 'forever',
    description: 'Perfect for beginning your wisdom journey',
    features: [
      '3 I Ching consultations per week',
      'Daily guiding hexagram',
      'Basic hexagram interpretations only',
      'Simple consultation history (30 days)',
      'I Ching Basics education only',
      'Limited hexagram access',
    ],
    limitations: {
      consultationsPerWeek: 3,
      historyDays: 30,
      aiInsights: false,
      patternRecognition: false,
      communityAccess: 'none',
      calendarIntegration: false,
      proactiveMonitoring: false,
      prioritySupport: false,
      advancedAnalytics: false,
    },
  },
  sage_plus: {
    id: 'sage_plus',
    name: 'Sage+',
    price: 7.99,
    period: 'month',
    description: 'Enhanced wisdom with AI-powered insights',
    features: [
      'Unlimited I Ching consultations',
      'AI-enhanced personalized interpretations',
      'Extended consultation history (1 year)',
      'Email notifications for daily guidance',
      'Full educational content access',
      'Complete 64 hexagram library',
      'Enhanced traditional interpretations',
      'Priority email support',
    ],
    limitations: {
      consultationsPerWeek: 'unlimited',
      historyDays: 365,
      aiInsights: true,
      patternRecognition: false,
      communityAccess: 'none',
      calendarIntegration: false,
      proactiveMonitoring: false,
      prioritySupport: true,
      advancedAnalytics: false,
    },
  },
  sage_pro: {
    id: 'sage_pro',
    name: 'Sage Pro',
    price: 16.99,
    period: 'month',
    description: 'Complete life guidance with advanced personalization',
    features: [
      'All Sage+ features',
      'Proactive wisdom reminders',
      'Advanced calendar analysis',
      'Wellness app integration',
      'Custom consultation templates',
      'Export & backup tools',
      'White-label for professionals',
      'Priority support',
      'API access',
    ],
    limitations: {
      consultationsPerWeek: 'unlimited',
      historyDays: 'unlimited',
      aiInsights: true,
      patternRecognition: true,
      communityAccess: 'full',
      calendarIntegration: true,
      proactiveMonitoring: true,
      prioritySupport: true,
      advancedAnalytics: true,
    },
  },
};

export interface UserSubscription {
  tier: SubscriptionTier;
  status: 'active' | 'trial' | 'cancelled' | 'expired';
  current_period_start: Date;
  current_period_end: Date;
  trial_end?: Date;
  consultations_this_week: number;
  consultations_reset_date: Date;
}

export function canAccessFeature(
  userSubscription: UserSubscription,
  feature: keyof SubscriptionLimits
): boolean {
  const plan = SUBSCRIPTION_PLANS[userSubscription.tier];
  return Boolean(plan.limitations[feature]);
}

export function getConsultationsRemaining(
  userSubscription: UserSubscription
): number | 'unlimited' {
  const plan = SUBSCRIPTION_PLANS[userSubscription.tier];

  if (plan.limitations.consultationsPerWeek === 'unlimited') {
    return 'unlimited';
  }

  return Math.max(
    0,
    plan.limitations.consultationsPerWeek -
      userSubscription.consultations_this_week
  );
}

export function canCreateConsultation(
  userSubscription: UserSubscription
): boolean {
  const remaining = getConsultationsRemaining(userSubscription);
  return remaining === 'unlimited' || remaining > 0;
}
