/**
 * Free Tier Restrictions
 * Enforces limitations for free users across the application
 */

import { supabaseAdmin } from '@/lib/supabase/client';

// Free tier accessible hexagrams (1-30 only)
export const FREE_TIER_HEXAGRAMS = Array.from({ length: 30 }, (_, i) => i + 1);

// Free tier learning materials
export const FREE_TIER_LEARNING = [
  'basics', // /learn/basics
  'faq', // /learn/faq
  // Philosophy and advanced hexagrams are paid only
];

/**
 * Check if user can access a specific hexagram
 */
export async function canAccessHexagram(
  userId: string,
  hexagramNumber: number
): Promise<boolean> {
  // Get user tier
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  const tier = profile?.subscription_tier || 'free';

  // Paid users can access all hexagrams
  if (tier !== 'free') return true;

  // Free users can only access hexagrams 1-30
  return FREE_TIER_HEXAGRAMS.includes(hexagramNumber);
}

/**
 * Filter consultation history based on tier
 */
export async function getFilteredConsultationHistory(
  userId: string,
  consultations: any[]
): Promise<any[]> {
  // Get user tier
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  const tier = profile?.subscription_tier || 'free';

  // Paid users see all history
  if (tier !== 'free') return consultations;

  // Free users only see last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return consultations.filter(c => new Date(c.created_at) >= thirtyDaysAgo);
}

/**
 * Check if user can access learning content
 */
export function canAccessLearningContent(
  tier: string,
  contentPath: string
): boolean {
  if (tier !== 'free') return true;

  // Extract the content type from path (e.g., /learn/basics -> basics)
  const contentType = contentPath.split('/').pop();
  return FREE_TIER_LEARNING.includes(contentType || '');
}

/**
 * Get tier-appropriate AI interpretation
 */
export function getTierBasedInterpretation(
  tier: string,
  fullInterpretation: string,
  basicInterpretation: string
): string {
  // Free users get basic interpretation only
  if (tier === 'free') {
    return (
      basicInterpretation ||
      'Basic interpretation available. Upgrade to Sage+ for personalized AI insights.'
    );
  }

  // Paid users get full AI interpretation
  return fullInterpretation;
}
