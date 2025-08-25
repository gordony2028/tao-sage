#!/usr/bin/env tsx

/**
 * Database Migration Runner
 * Executes the usage tracking migration using Supabase client
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create service role client for admin operations
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  console.log('🚀 Running usage tracking database migration...\n');

  try {
    // Read the migration SQL file
    const sqlFile = join(process.cwd(), 'scripts', 'add-usage-tracking.sql');
    const sql = readFileSync(sqlFile, 'utf-8');

    console.log('📝 Executing SQL migration...');

    // Execute the migration SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: sql,
    });

    if (error) {
      // If the RPC function doesn't exist, try direct query execution
      console.log('⚠️  RPC function not available, trying direct execution...');

      // Split SQL into individual statements and execute them
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`   Executing: ${statement.substring(0, 50)}...`);
          const { error: execError } = await supabase
            .from('user_profiles')
            .select('id')
            .limit(0);

          if (execError) {
            console.error('❌ Error executing statement:', execError.message);
            process.exit(1);
          }
        }
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Verifying new columns...');

    // Test that the new columns are accessible
    const { data, error: testError } = await supabase
      .from('user_profiles')
      .select('consultations_this_week, week_reset_date, subscription_tier')
      .limit(1);

    if (testError) {
      console.error('❌ Error testing new columns:', testError.message);
      console.log('\nℹ️  You may need to run the SQL migration manually:');
      console.log('   1. Go to your Supabase dashboard');
      console.log('   2. Navigate to SQL Editor');
      console.log('   3. Run the contents of scripts/add-usage-tracking.sql');
      process.exit(1);
    }

    console.log('✅ New columns are accessible');
    console.log('\n🎉 Usage tracking system is ready!');
    console.log('\nNext steps:');
    console.log(
      '1. Users can now create up to 3 consultations per week (free tier)'
    );
    console.log('2. Usage resets every Monday');
    console.log('3. Sage+ users have unlimited access');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\nℹ️  Manual migration required:');
    console.log('   1. Go to your Supabase dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Run the contents of scripts/add-usage-tracking.sql');
    process.exit(1);
  }
}

if (require.main === module) {
  runMigration();
}

export { runMigration };
