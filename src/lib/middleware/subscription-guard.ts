/**
 * Subscription Guard Middleware
 *
 * Enforces subscription tier limits across all consultation endpoints.
 * Prevents unlimited consultations by checking both database state and subscription tier.
 */

import { supabaseAdmin } from '@/lib/supabase/client';

export interface SubscriptionTier {
  tier: 'free' | 'sage_plus' | 'premium';
  consultationsPerWeek: number;
  isUnlimited: boolean;
}

export interface SubscriptionCheck {
  allowed: boolean;
  tier: SubscriptionTier;
  currentUsage: number;
  remaining: number;
  upgradeRequired: boolean;
  resetDate: string;
}

const SUBSCRIPTION_LIMITS = {
  free: { consultationsPerWeek: 3, isUnlimited: false },
  sage_plus: { consultationsPerWeek: Infinity, isUnlimited: true },
  premium: { consultationsPerWeek: Infinity, isUnlimited: true },
} as const;

/**
 * Get the start of the current week (Monday 00:00:00)
 */
function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Check if user can create consultation based on subscription tier
 */
export async function checkSubscriptionLimits(
  userId: string
): Promise<SubscriptionCheck> {
  try {
    // Get or create user profile with subscription info using admin client
    let { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('subscription_tier, consultations_this_week, week_reset_date')
      .eq('id', userId)
      .single();

    // Create profile if doesn't exist
    if (error && error.code === 'PGRST116') {
      const weekStart = getWeekStart();

      // First check if user exists in auth.users
      const { data: authUser, error: authError } =
        await supabaseAdmin.auth.admin.getUserById(userId);

      if (authError || !authUser.user) {
        throw new Error(
          `Invalid user ID: ${userId}. User not found in auth.users.`
        );
      }

      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: userId,
          subscription_tier: 'free',
          consultations_this_week: 0,
          week_reset_date: weekStart.toISOString(),
        })
        .select('subscription_tier, consultations_this_week, week_reset_date')
        .single();

      if (createError) {
        console.error('Profile creation error details:', createError);
        throw new Error(
          `Failed to create user profile: ${createError.message}`
        );
      }
      profile = newProfile;
    } else if (error) {
      throw new Error(`Failed to check subscription limits: ${error.message}`);
    }

    const subscriptionTier =
      (profile?.subscription_tier as 'free' | 'sage_plus' | 'premium') ||
      'free';
    const limits = SUBSCRIPTION_LIMITS[subscriptionTier];

    // Check if week has reset
    const weekResetDate = profile?.week_reset_date || new Date().toISOString();
    const weekStart = getWeekStart();
    const shouldReset = new Date(weekResetDate) < weekStart;

    const currentUsage = shouldReset
      ? 0
      : profile?.consultations_this_week || 0;
    const remaining = limits.isUnlimited
      ? Infinity
      : Math.max(0, limits.consultationsPerWeek - currentUsage);

    // Auto-reset weekly counter if needed
    if (shouldReset && profile) {
      await supabaseAdmin
        .from('user_profiles')
        .update({
          consultations_this_week: 0,
          week_reset_date: weekStart.toISOString(),
        })
        .eq('id', userId);
    }

    return {
      allowed: limits.isUnlimited || remaining > 0,
      tier: {
        tier: subscriptionTier,
        consultationsPerWeek: limits.consultationsPerWeek,
        isUnlimited: limits.isUnlimited,
      },
      currentUsage,
      remaining,
      upgradeRequired: !limits.isUnlimited && remaining <= 0,
      resetDate: weekStart.toISOString(),
    };
  } catch (error) {
    console.error('Subscription check error:', error);
    // Fail secure - deny access if check fails
    return {
      allowed: false,
      tier: { tier: 'free', consultationsPerWeek: 3, isUnlimited: false },
      currentUsage: 999,
      remaining: 0,
      upgradeRequired: true,
      resetDate: getWeekStart().toISOString(),
    };
  }
}

/**
 * Track consultation usage after successful creation
 */
export async function trackConsultationUsage(userId: string): Promise<void> {
  try {
    // Get current profile using admin client
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('consultations_this_week, week_reset_date')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to track consultation usage:', error);
      return;
    }

    // Check if week has reset since subscription check
    const weekResetDate = profile?.week_reset_date || new Date().toISOString();
    const weekStart = getWeekStart();
    const shouldReset = new Date(weekResetDate) < weekStart;

    const currentCount = shouldReset
      ? 0
      : profile?.consultations_this_week || 0;
    const newCount = currentCount + 1;
    const resetDate = shouldReset ? weekStart.toISOString() : weekResetDate;

    // Update usage count using admin client
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        consultations_this_week: newCount,
        week_reset_date: resetDate,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Failed to update consultation count:', updateError);
      throw new Error('Failed to track consultation usage');
    }
  } catch (error) {
    console.error('Track consultation usage error:', error);
    throw error;
  }
}

/**
 * Get user subscription status and usage data
 */
export async function getUserSubscriptionStatus(userId: string) {
  return await checkSubscriptionLimits(userId);
}
