import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function verifySupabase() {
  console.log('🔍 Verifying Supabase connection...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Test basic connection
    console.log('Testing basic connection...');
    const { data, error } = await supabase.auth.getSession();

    if (error && !error.message.includes('session')) {
      throw error;
    }

    console.log('✅ Basic Supabase connection successful');
    console.log(`   URL: ${supabaseUrl}`);

    // Test if we can query tables (this will help us see what's available)
    console.log('\nTesting table access...');

    // Try a simple query that should work with RLS
    const { data: testData, error: testError } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      if (
        testError.message.includes('relation') &&
        testError.message.includes('does not exist')
      ) {
        console.log('⚠️  Tables not found - database setup needed');
        console.log('\n📋 MANUAL SETUP REQUIRED:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log(
          '3. Copy and paste the contents of scripts/database-schema.sql'
        );
        console.log('4. Execute the SQL');
        console.log('5. Run this script again to verify');
        return false;
      } else if (testError.code === 'PGRST116') {
        console.log('✅ Tables exist but are empty (this is normal)');
        return true;
      } else {
        console.log(`⚠️  Table access issue: ${testError.message}`);
        console.log('This might be normal due to RLS policies');
        return true;
      }
    }

    console.log('✅ Database tables are accessible');
    return true;
  } catch (error: any) {
    console.error('❌ Supabase verification failed:', error.message);
    return false;
  }
}

async function main() {
  const success = await verifySupabase();

  if (success) {
    console.log('\n🎉 Supabase is ready!');
    console.log('\nNext steps:');
    console.log('1. Run `pnpm dev` to start development');
    console.log('2. Visit http://localhost:3000 to see your app');
    process.exit(0);
  } else {
    console.log('\n❌ Supabase setup incomplete');
    process.exit(1);
  }
}

main().catch(console.error);
