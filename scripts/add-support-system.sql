-- Support System Database Schema
-- Adds priority support capabilities for Sage+ users

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'sage_plus', 'sage_pro')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    category TEXT NOT NULL CHECK (category IN ('technical', 'billing', 'feature', 'account', 'other')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    user_email TEXT NOT NULL,
    user_name TEXT,
    
    -- Auto-assign priority based on subscription tier
    CONSTRAINT auto_priority_check CHECK (
        (subscription_tier = 'free' AND priority IN ('low', 'normal')) OR
        (subscription_tier IN ('sage_plus', 'sage_pro') AND priority IN ('normal', 'high', 'urgent'))
    )
);

-- Support ticket responses/messages
CREATE TABLE IF NOT EXISTS support_ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
    sender_id UUID, -- NULL for admin messages, user_id for user messages
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE -- Internal admin notes vs user-visible messages
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_subscription_tier ON support_tickets(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_ticket_messages_ticket_id ON support_ticket_messages(ticket_id);

-- Row Level Security (RLS) Policies
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own tickets
CREATE POLICY "Users can create own tickets" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own tickets (limited fields)
CREATE POLICY "Users can update own tickets" ON support_tickets
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can view messages for their own tickets
CREATE POLICY "Users can view own ticket messages" ON support_ticket_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM support_tickets 
            WHERE support_tickets.id = support_ticket_messages.ticket_id 
            AND support_tickets.user_id = auth.uid()
        )
    );

-- Users can create messages for their own tickets
CREATE POLICY "Users can create messages for own tickets" ON support_ticket_messages
    FOR INSERT WITH CHECK (
        sender_type = 'user' AND 
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM support_tickets 
            WHERE support_tickets.id = ticket_id 
            AND support_tickets.user_id = auth.uid()
        )
    );

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_support_tickets_updated_at
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_support_tickets_updated_at();

-- Function to auto-assign priority based on subscription tier
CREATE OR REPLACE FUNCTION auto_assign_ticket_priority()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-assign higher priority for paid users
    IF NEW.subscription_tier IN ('sage_plus', 'sage_pro') THEN
        IF NEW.priority = 'normal' THEN
            NEW.priority = 'high';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-assign priority
CREATE TRIGGER auto_assign_ticket_priority
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_ticket_priority();

COMMENT ON TABLE support_tickets IS 'Support tickets with priority handling based on subscription tier';
COMMENT ON TABLE support_ticket_messages IS 'Messages/responses for support tickets';