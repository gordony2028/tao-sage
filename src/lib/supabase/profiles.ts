import { supabase } from './client';

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  preferred_language: string;
  timezone: string;
  notification_preferences: {
    daily_guidance: boolean;
    consultation_reminders: boolean;
  };
  subscription_tier: 'free' | 'premium' | 'pro';
  subscription_status: string;
  consultation_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  preferred_language?: string;
  timezone?: string;
  notification_preferences?: {
    daily_guidance?: boolean;
    consultation_reminders?: boolean;
  };
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return data;
}

/**
 * Create a new user profile (called after user signs up)
 */
export async function createUserProfile(
  userId: string,
  initialData: Partial<ProfileUpdate> = {}
): Promise<UserProfile> {
  const profileData = {
    id: userId,
    preferred_language: 'en',
    timezone: 'UTC',
    notification_preferences: {
      daily_guidance: true,
      consultation_reminders: true,
    },
    subscription_tier: 'free',
    subscription_status: 'active',
    consultation_count: 0,
    ...initialData,
  };

  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profileData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Get or create user profile (useful for ensuring profile exists)
 */
export async function getOrCreateUserProfile(
  userId: string,
  initialData: Partial<ProfileUpdate> = {}
): Promise<UserProfile> {
  let profile = await getUserProfile(userId);

  if (!profile) {
    profile = await createUserProfile(userId, initialData);
  }

  return profile;
}
