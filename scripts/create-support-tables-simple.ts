import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function createSupportTables() {
  console.log('🎧 Creating support system tables...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Create support_tickets table
    console.log('1. Creating support_tickets table...');
    const { error: ticketsError } = await supabase.rpc('query', {
      query: `
        CREATE TABLE IF NOT EXISTS public.support_tickets (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          subscription_tier TEXT NOT NULL DEFAULT 'free',
          priority TEXT NOT NULL DEFAULT 'normal',
          status TEXT NOT NULL DEFAULT 'open',
          category TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          user_email TEXT NOT NULL,
          user_name TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,
    });

    if (ticketsError) {
      console.log('❌ Failed with RPC, trying direct approach...');
      // Try with direct SQL approach using Supabase client
      throw new Error('RPC not available, need manual setup');
    }

    console.log('✅ Support tables created successfully!');
  } catch (error: any) {
    console.error('❌ Automated creation failed:', error.message);
    console.log('\n📋 MANUAL SETUP REQUIRED');
    console.log('================================\n');
    console.log('Please follow these steps:\n');
    console.log(
      '1. Open your Supabase dashboard: https://supabase.com/dashboard'
    );
    console.log('2. Navigate to your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste this SQL:\n');

    console.log(`-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'sage_plus', 'sage_pro', 'premium')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')),
    category TEXT NOT NULL CHECK (category IN ('technical', 'billing', 'feature_request', 'consultation_help', 'cultural_question', 'general')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_ticket_messages table
CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own support tickets" ON public.support_tickets;
CREATE POLICY "Users can view own support tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create support tickets" ON public.support_tickets;
CREATE POLICY "Users can create support tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own ticket messages" ON public.support_ticket_messages;
CREATE POLICY "Users can view own ticket messages" ON public.support_ticket_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.support_tickets 
            WHERE id = ticket_id AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create ticket messages" ON public.support_ticket_messages;
CREATE POLICY "Users can create ticket messages" ON public.support_ticket_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.support_tickets 
            WHERE id = ticket_id AND user_id = auth.uid()
        )
    );`);

    console.log('\n5. Click "Run" to execute the SQL');
    console.log('6. Restart your development server (Ctrl+C then pnpm dev)');
    console.log('\nOnce completed, the support system will work properly.');
  }
}

if (require.main === module) {
  createSupportTables();
}

export { createSupportTables };
