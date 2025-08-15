-- Sage I Ching Application Database Schema
-- This script sets up the complete database structure for the Sage application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE consultation_status AS ENUM ('active', 'archived');

-- ============================================================================
-- USERS AND PROFILES
-- ============================================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    
    -- Preferences
    preferred_language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    notification_preferences JSONB DEFAULT '{"daily_guidance": true, "consultation_reminders": true}',
    
    -- Subscription and usage
    subscription_tier TEXT DEFAULT 'free', -- free, premium, pro
    subscription_status TEXT DEFAULT 'active',
    consultation_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- I CHING CONSULTATIONS
-- ============================================================================

-- Main consultations table
CREATE TABLE IF NOT EXISTS consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Consultation data
    question TEXT NOT NULL,
    hexagram_number INTEGER NOT NULL CHECK (hexagram_number >= 1 AND hexagram_number <= 64),
    hexagram_name TEXT NOT NULL,
    lines INTEGER[] NOT NULL CHECK (array_length(lines, 1) = 6),
    changing_lines INTEGER[] DEFAULT '{}',
    
    -- AI interpretation (JSONB for flexibility)
    interpretation JSONB NOT NULL,
    
    -- Metadata
    consultation_method TEXT DEFAULT 'digital_coins', -- digital_coins, manual_entry
    ip_address INET,
    user_agent TEXT,
    
    -- Status and organization
    status consultation_status DEFAULT 'active',
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER EVENTS AND ANALYTICS
-- ============================================================================

-- User events for analytics and patterns
CREATE TABLE IF NOT EXISTS user_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Event data
    event_type TEXT NOT NULL, -- consultation_created, daily_guidance_viewed, etc.
    event_data JSONB DEFAULT '{}',
    
    -- Context
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Consultations indexes
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at);
CREATE INDEX IF NOT EXISTS idx_consultations_hexagram_number ON consultations(hexagram_number);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_user_created ON consultations(user_id, created_at DESC);

-- User events indexes
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- User profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Consultations policies
DROP POLICY IF EXISTS "Users can view own consultations" ON consultations;
CREATE POLICY "Users can view own consultations" ON consultations
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own consultations" ON consultations;
CREATE POLICY "Users can insert own consultations" ON consultations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own consultations" ON consultations;
CREATE POLICY "Users can update own consultations" ON consultations
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own consultations" ON consultations;
CREATE POLICY "Users can delete own consultations" ON consultations
    FOR DELETE USING (auth.uid() = user_id);

-- User events policies
DROP POLICY IF EXISTS "Users can view own events" ON user_events;
CREATE POLICY "Users can view own events" ON user_events
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own events" ON user_events;
CREATE POLICY "Users can insert own events" ON user_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultations_updated_at ON consultations;
CREATE TRIGGER update_consultations_updated_at
    BEFORE UPDATE ON consultations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment consultation count
CREATE OR REPLACE FUNCTION increment_consultation_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles 
    SET consultation_count = consultation_count + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to increment consultation count
DROP TRIGGER IF EXISTS increment_user_consultation_count ON consultations;
CREATE TRIGGER increment_user_consultation_count
    AFTER INSERT ON consultations
    FOR EACH ROW
    EXECUTE FUNCTION increment_consultation_count();

-- ============================================================================
-- SEED DATA (Optional - for development)
-- ============================================================================

-- Note: In production, this should be run separately
-- This section can be uncommented for development seeding

/*
-- Insert sample consultation for testing (requires a real user_id)
-- This will be populated when we have authentication working
*/

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for consultation statistics
CREATE OR REPLACE VIEW consultation_stats AS
SELECT 
    user_id,
    COUNT(*) as total_consultations,
    COUNT(DISTINCT hexagram_number) as unique_hexagrams,
    MAX(created_at) as last_consultation,
    MIN(created_at) as first_consultation
FROM consultations 
WHERE status = 'active'
GROUP BY user_id;

-- View for recent consultations with user info
CREATE OR REPLACE VIEW recent_consultations AS
SELECT 
    c.id,
    c.user_id,
    c.question,
    c.hexagram_number,
    c.hexagram_name,
    c.created_at,
    up.username,
    up.full_name
FROM consultations c
LEFT JOIN user_profiles up ON c.user_id = up.id
WHERE c.status = 'active'
ORDER BY c.created_at DESC;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE user_profiles IS 'Extended user profile information beyond Supabase auth';
COMMENT ON TABLE consultations IS 'I Ching consultation records with hexagram data and AI interpretations';
COMMENT ON TABLE user_events IS 'User interaction events for analytics and pattern recognition';

COMMENT ON COLUMN consultations.lines IS 'Array of 6 integers representing hexagram lines (6=old yin, 7=young yang, 8=young yin, 9=old yang)';
COMMENT ON COLUMN consultations.changing_lines IS 'Array of line positions (1-6) that are changing (old yin/yang)';
COMMENT ON COLUMN consultations.interpretation IS 'JSONB containing AI-generated interpretation with structure: {interpretation, guidance, practicalAdvice, culturalContext}';