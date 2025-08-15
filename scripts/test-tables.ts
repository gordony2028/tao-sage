import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function testTables() {
  console.log('🔍 Testing database tables...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
  }

  // Use service role key to bypass RLS for admin testing
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const tables = ['user_profiles', 'consultations', 'user_events'];
  const results: Record<string, boolean> = {};

  for (const table of tables) {
    try {
      console.log(`Testing table: ${table}`);
      const { data, error } = await supabase.from(table).select('*').limit(1);

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ Table ${table} does not exist`);
          results[table] = false;
        } else {
          console.log(`✅ Table ${table} exists (${error.message})`);
          results[table] = true;
        }
      } else {
        console.log(`✅ Table ${table} exists and is accessible`);
        results[table] = true;
      }
    } catch (err: any) {
      console.log(`❌ Error testing ${table}: ${err.message}`);
      results[table] = false;
    }
  }

  console.log('\n📊 Results:');
  const allExist = Object.values(results).every(exists => exists);

  for (const [table, exists] of Object.entries(results)) {
    console.log(`   ${exists ? '✅' : '❌'} ${table}`);
  }

  if (allExist) {
    console.log('\n🎉 All tables exist! Database is ready.');
  } else {
    console.log(
      '\n❌ Some tables are missing. Please run the database schema in Supabase Dashboard.'
    );
    console.log('\nInstructions:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Navigate to SQL Editor');
    console.log('4. Copy and paste scripts/database-schema.sql');
    console.log('5. Execute the SQL');
  }

  return allExist;
}

testTables().catch(console.error);
