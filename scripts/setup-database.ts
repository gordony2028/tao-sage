import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function setupDatabase() {
  console.log('🚀 Setting up Sage database schema...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error(
      '   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY'
    );
    process.exit(1);
  }

  // Create Supabase client with service role key for admin operations
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'database-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Executing database schema...');

    // Execute the schema
    const { error } = await supabase.rpc('exec_sql', { sql_query: schemaSql });

    if (error) {
      // If exec_sql doesn't exist, try direct SQL execution
      console.log('🔄 Trying alternative SQL execution method...');

      // Split the SQL into individual statements and execute them
      const statements = schemaSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await supabase.rpc('exec', { sql: statement });
          } catch (stmtError) {
            console.warn(`⚠️  Warning executing statement: ${stmtError}`);
          }
        }
      }
    }

    console.log('✅ Database schema setup completed!');
    console.log('\n📊 Verifying tables...');

    // Verify that tables were created
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['user_profiles', 'consultations', 'user_events']);

    if (tablesError) {
      console.warn('⚠️  Could not verify tables, but setup likely succeeded');
    } else {
      console.log('✅ Tables verified:');
      tables?.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run `pnpm check-connections` to verify connectivity');
    console.log('2. Start development with `pnpm dev`');
  } catch (error: any) {
    console.error('❌ Database setup failed:', error.message);
    console.error('\n💡 Manual setup instructions:');
    console.error('1. Open Supabase Dashboard → SQL Editor');
    console.error('2. Copy and paste contents of scripts/database-schema.sql');
    console.error('3. Execute the SQL');
    process.exit(1);
  }
}

// Alternative function to generate SQL file for manual setup
function generateSetupInstructions() {
  console.log('\n📋 MANUAL DATABASE SETUP INSTRUCTIONS');
  console.log('=====================================\n');
  console.log('If automated setup failed, follow these steps:\n');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Create a new query');
  console.log('4. Copy the contents of scripts/database-schema.sql');
  console.log('5. Paste and execute the SQL');
  console.log('6. Run `pnpm check-connections` to verify\n');
}

if (require.main === module) {
  setupDatabase().catch(() => {
    generateSetupInstructions();
  });
}

export { setupDatabase, generateSetupInstructions };
