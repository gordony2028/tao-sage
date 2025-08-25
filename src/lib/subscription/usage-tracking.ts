/**
 * Usage Tracking System for Freemium Model
 *
 * Manages consultation limits for free and paid tiers:
 * - Free tier: 3 consultations per week
 * - Sage+ tier: Unlimited consultations
 */

import { supabase } from '@/lib/supabase/client';

export type SubscriptionTier = 'free' | 'sage_plus' | 'premium';

export interface UsageData {
  consultationsThisWeek: number;
  weekResetDate: string;
  subscriptionTier: SubscriptionTier;
  consultationsRemaining: number;
  canCreateConsultation: boolean;
  isUnlimited: boolean;
}

export interface UsageUpdate {
  consultations_this_week: number;
  week_reset_date: string;
}

// Constants
const FREE_TIER_WEEKLY_LIMIT = 3;
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Get the start of the current week (Monday 00:00:00)
 */
function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Check if a date is in the current week
 */
function isCurrentWeek(dateString: string): boolean {
  const date = new Date(dateString);
  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart.getTime() + WEEK_IN_MS);
  return date >= weekStart && date < weekEnd;
}

/**
 * Track a consultation usage
 */
export async function trackConsultation(userId: string): Promise<void> {
  let { data: profile, error } = await supabase
    .from('user_profiles')
    .select('consultations_this_week, week_reset_date, subscription_tier')
    .eq('id', userId)
    .single();

  // If profile doesn't exist, create it with default values
  if (error && error.code === 'PGRST116') {
    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        consultations_this_week: 0,
        week_reset_date: getWeekStart().toISOString(),
        subscription_tier: 'free',
      })
      .select('consultations_this_week, week_reset_date, subscription_tier')
      .single();

    if (createError) {
      console.error('Error creating user profile:', createError);
      throw new Error('Failed to create user profile for tracking');
    }

    profile = newProfile;
  } else if (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to track consultation');
  }

  // Check if we need to reset the weekly counter
  const weekResetDate = profile?.week_reset_date || new Date().toISOString();
  const shouldReset = !isCurrentWeek(weekResetDate);

  const currentCount = shouldReset ? 0 : profile?.consultations_this_week || 0;
  const newCount = currentCount + 1;
  const newResetDate = shouldReset
    ? getWeekStart().toISOString()
    : weekResetDate;

  // Update the usage count
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({
      consultations_this_week: newCount,
      week_reset_date: newResetDate,
    } as UsageUpdate)
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating consultation count:', updateError);
    throw new Error('Failed to update consultation count');
  }
}

/**
 * Check if user can create a consultation based on their tier and usage
 */
export async function checkUsageLimit(userId: string): Promise<boolean> {
  const usage = await getUserUsageData(userId);
  return usage.canCreateConsultation;
}

/**
 * Reset weekly usage for a specific user (if needed)
 */
export async function resetWeeklyUsage(userId: string): Promise<void> {
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('week_reset_date')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return;
  }

  // Only reset if the week has actually changed
  if (profile?.week_reset_date && !isCurrentWeek(profile.week_reset_date)) {
    await supabase
      .from('user_profiles')
      .update({
        consultations_this_week: 0,
        week_reset_date: getWeekStart().toISOString(),
      } as UsageUpdate)
      .eq('id', userId);
  }
}

/**
 * Get consultations remaining for the user
 */
export async function getConsultationsRemaining(
  userId: string
): Promise<number> {
  const usage = await getUserUsageData(userId);
  return usage.consultationsRemaining;
}

/**
 * Get user's current subscription tier
 */
export async function getUserSubscriptionTier(
  userId: string
): Promise<SubscriptionTier> {
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return 'free'; // Default to free tier
  }

  return (profile.subscription_tier as SubscriptionTier) || 'free';
}

/**
 * Get complete usage data for a user
 */
export async function getUserUsageData(userId: string): Promise<UsageData> {
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('consultations_this_week, week_reset_date, subscription_tier')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    // Return default free tier data if profile not found
    return {
      consultationsThisWeek: 0,
      weekResetDate: getWeekStart().toISOString(),
      subscriptionTier: 'free',
      consultationsRemaining: FREE_TIER_WEEKLY_LIMIT,
      canCreateConsultation: true,
      isUnlimited: false,
    };
  }

  // Check if we need to reset the weekly counter
  const shouldReset = profile.week_reset_date
    ? !isCurrentWeek(profile.week_reset_date)
    : true;
  const consultationsThisWeek = shouldReset
    ? 0
    : profile.consultations_this_week || 0;
  const subscriptionTier =
    (profile.subscription_tier as SubscriptionTier) || 'free';

  // Calculate remaining consultations based on tier
  const isUnlimited = subscriptionTier !== 'free';
  const consultationsRemaining = isUnlimited
    ? Infinity
    : Math.max(0, FREE_TIER_WEEKLY_LIMIT - consultationsThisWeek);

  const canCreateConsultation = isUnlimited || consultationsRemaining > 0;

  // Auto-reset if needed
  if (shouldReset && consultationsThisWeek > 0) {
    // Fire and forget - don't wait for this
    resetWeeklyUsage(userId).catch(console.error);
  }

  return {
    consultationsThisWeek,
    weekResetDate: profile.week_reset_date || getWeekStart().toISOString(),
    subscriptionTier,
    consultationsRemaining,
    canCreateConsultation,
    isUnlimited,
  };
}

/**
 * Update user's subscription tier
 */
export async function updateSubscriptionTier(
  userId: string,
  tier: SubscriptionTier
): Promise<void> {
  const { error } = await supabase
    .from('user_profiles')
    .update({ subscription_tier: tier })
    .eq('id', userId);

  if (error) {
    console.error('Error updating subscription tier:', error);
    throw new Error('Failed to update subscription tier');
  }
}

/**
 * Reset all users' weekly usage (for cron job)
 */
export async function resetAllWeeklyUsage(): Promise<void> {
  const weekStart = getWeekStart();

  // Reset all users whose week_reset_date is not in the current week
  const { error } = await supabase
    .from('user_profiles')
    .update({
      consultations_this_week: 0,
      week_reset_date: weekStart.toISOString(),
    } as UsageUpdate)
    .lt('week_reset_date', weekStart.toISOString());

  if (error) {
    console.error('Error resetting weekly usage for all users:', error);
    throw new Error('Failed to reset weekly usage');
  }
}
