import { z } from 'zod';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

try {
  envSchema.parse(process.env);
  console.log('✅ Environment variables are valid');

  // Check if we have all the required API keys
  const hasSupabase = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  if (hasSupabase && hasOpenAI) {
    console.log('✅ All API keys are configured');
  }
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    error.errors.forEach(err => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
  } else {
    console.error('❌ Invalid environment variables:', error);
  }
  console.log(
    '\nℹ️  Please update your .env.local file with the required variables'
  );
  console.log('   You can copy .env.example as a template');

  // Don't exit with error code during postinstall
  if (process.env.npm_lifecycle_event !== 'postinstall') {
    process.exit(1);
  }
}
