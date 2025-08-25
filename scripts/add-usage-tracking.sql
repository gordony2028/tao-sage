-- Add usage tracking columns to user_profiles table
-- This migration adds support for the freemium model with weekly consultation limits

-- Add consultations_this_week column to track weekly usage
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS consultations_this_week INTEGER DEFAULT 0;

-- Add week_reset_date to track when the weekly counter should reset
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS week_reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ensure subscription_tier column exists with proper default
-- (This may already exist from your initial schema)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'subscription_tier'
    ) THEN
        ALTER TABLE user_profiles 
        ADD COLUMN subscription_tier TEXT DEFAULT 'free';
    END IF;
END $$;

-- Add check constraint for subscription tiers
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS valid_subscription_tier;

ALTER TABLE user_profiles 
ADD CONSTRAINT valid_subscription_tier 
CHECK (subscription_tier IN ('free', 'sage_plus', 'premium'));

-- Create an index for efficient weekly reset queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_week_reset_date 
ON user_profiles(week_reset_date);

-- Create an index for subscription tier queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier 
ON user_profiles(subscription_tier);

-- Update RLS policies to allow users to read their own usage data
-- (These should already exist, but we're ensuring they include the new columns)

-- Ensure users can read their own profile including usage data
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Ensure users can update their own profile (but not subscription_tier directly)
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create a function to automatically reset weekly usage
-- This can be called by a cron job or trigger
CREATE OR REPLACE FUNCTION reset_weekly_usage()
RETURNS void AS $$
BEGIN
    UPDATE user_profiles
    SET consultations_this_week = 0,
        week_reset_date = date_trunc('week', CURRENT_TIMESTAMP)
    WHERE week_reset_date < date_trunc('week', CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to reset weekly usage
-- (Requires pg_cron extension - check if your Supabase plan supports it)
-- SELECT cron.schedule(
--     'reset-weekly-usage',
--     '0 0 * * 1', -- Every Monday at midnight
--     'SELECT reset_weekly_usage();'
-- );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_profiles TO authenticated;