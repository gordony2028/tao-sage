import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function addSupportTables() {
  console.log('🎧 Adding support system tables to database...\n');

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
    // Read the support tables SQL file
    const migrationPath = path.join(__dirname, 'add-support-tables.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Executing support tables migration...');

    // Split the SQL into individual statements and execute them
    const statements = migrationSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📊 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(
            `   ${i + 1}/${statements.length}: ${statement.substring(0, 60)}...`
          );

          // Use RPC call to execute SQL
          const { error } = await supabase.rpc('exec', {
            sql: statement + ';', // Add semicolon back
          });

          if (error) {
            throw error;
          }
        } catch (stmtError: any) {
          console.error(
            `❌ Error executing statement ${i + 1}:`,
            stmtError.message
          );
          console.error(`   Statement: ${statement.substring(0, 100)}...`);

          // Continue with other statements unless it's a critical error
          if (
            stmtError.message.includes('already exists') ||
            stmtError.message.includes('IF NOT EXISTS')
          ) {
            console.log('   ℹ️  Table/policy already exists, continuing...');
          } else {
            throw stmtError;
          }
        }
      }
    }

    console.log('✅ Support tables migration completed!');
    console.log('\n📊 Verifying support tables...');

    // Verify that support tables were created
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['support_tickets', 'support_ticket_messages']);

    if (tablesError) {
      console.warn(
        '⚠️  Could not verify tables, but migration likely succeeded'
      );
      console.warn('   Error:', tablesError.message);
    } else {
      console.log('✅ Support tables verified:');
      tables?.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }

    // Test basic connectivity
    console.log('\n🔗 Testing support system connectivity...');

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('count')
        .limit(1);

      if (error) {
        throw error;
      }

      console.log('✅ Support tickets table accessible');
    } catch (testError: any) {
      console.warn('⚠️  Support tickets table test failed:', testError.message);
    }

    console.log('\n🎉 Support system setup complete!');
    console.log('\nThe support system should now be fully functional.');
  } catch (error: any) {
    console.error('❌ Support tables migration failed:', error.message);
    console.error('\n💡 Manual setup instructions:');
    console.error('1. Open Supabase Dashboard → SQL Editor');
    console.error(
      '2. Copy and paste contents of scripts/add-support-tables.sql'
    );
    console.error('3. Execute the SQL');
    console.error('4. Restart your development server');
    process.exit(1);
  }
}

if (require.main === module) {
  addSupportTables();
}

export { addSupportTables };
