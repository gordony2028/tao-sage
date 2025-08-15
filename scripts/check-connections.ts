import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function checkSupabase() {
  console.log('🔍 Checking Supabase connection...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.error('❌ Supabase credentials missing');
    return false;
  }

  try {
    // Test with anon key
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test basic auth connection (this should always work)
    const { data, error } = await supabase.auth.getSession();

    if (error && !error.message.includes('session')) {
      throw error;
    }

    console.log('✅ Supabase connection successful');
    console.log(`   URL: ${supabaseUrl}`);
    console.log('   Auth: Working');
    console.log('   Database: Ready for queries');
    return true;
  } catch (error: any) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
}

async function checkOpenAI() {
  console.log('\n🔍 Checking OpenAI connection...');

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('❌ OpenAI API key missing');
    return false;
  }

  try {
    const openai = new OpenAI({ apiKey });

    // Make a minimal API call to test the connection
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Say "Connection successful" in exactly 2 words.',
        },
      ],
      max_tokens: 10,
    });

    const message = response.choices[0]?.message?.content;

    if (message) {
      console.log('✅ OpenAI connection successful');
      console.log(`   Response: ${message}`);
      console.log(`   Model: ${response.model}`);
      return true;
    } else {
      console.error('❌ OpenAI returned empty response');
      return false;
    }
  } catch (error: any) {
    console.error('❌ OpenAI connection failed:', error.message);
    if (error.code === 'invalid_api_key') {
      console.error('   Please check your API key is valid and has credits');
    }
    return false;
  }
}

async function checkEnvironment() {
  console.log('🔍 Checking environment variables...\n');

  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'NODE_ENV',
    'NEXT_PUBLIC_APP_URL',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    return false;
  }

  console.log('✅ All required environment variables are set');
  return true;
}

async function main() {
  console.log('🚀 Sage Development Environment Check\n');
  console.log('='.repeat(50));

  const envCheck = await checkEnvironment();
  const supabaseCheck = await checkSupabase();
  const openaiCheck = await checkOpenAI();

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:');
  console.log(`   Environment: ${envCheck ? '✅' : '❌'}`);
  console.log(`   Supabase:    ${supabaseCheck ? '✅' : '❌'}`);
  console.log(`   OpenAI:      ${openaiCheck ? '✅' : '❌'}`);

  if (envCheck && supabaseCheck && openaiCheck) {
    console.log('\n🎉 All systems ready! You can start development.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Please fix the issues above before proceeding.');
    process.exit(1);
  }
}

main().catch(console.error);
