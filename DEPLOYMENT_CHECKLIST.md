# Vercel Deployment Checklist

## Pre-Deployment Steps ✅

### 1. Environment Variables Setup

Add these to Vercel dashboard (Settings → Environment Variables):

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (Required)
OPENAI_API_KEY=your_openai_api_key

# Email (Required)
RESEND_API_KEY=re_fgwMjaNR_MWtRnDK4epJgy8Z1kvgxVRe4
ADMIN_EMAIL=gordony2028@gmail.com

# App Config
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 2. Database Setup

```sql
-- Run these migrations in Supabase SQL editor:
-- 1. User profiles table (if not exists)
-- 2. Consultations table
-- 3. Support tickets tables
-- 4. Enable RLS policies
```

### 3. Build Test

```bash
# Test production build locally
pnpm build
pnpm start
```

## Deployment Steps 🚀

### Option A: GitHub Integration (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Connect GitHub repo
4. Add environment variables
5. Deploy

### Option B: Vercel CLI

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Post-Deployment ✅

### 1. Update URLs

- [ ] Update NEXT_PUBLIC_APP_URL in Vercel env vars
- [ ] Update Supabase redirect URLs (Auth → URL Configuration)
- [ ] Update Google OAuth redirect URLs

### 2. Test Critical Features

- [ ] User signup/signin
- [ ] Create consultation (free tier: 3/week)
- [ ] View consultation history
- [ ] Support ticket creation
- [ ] Email notifications

### 3. Monitor

- [ ] Check Vercel Functions logs
- [ ] Monitor Supabase usage
- [ ] Set up error tracking (Sentry)

## Domain Setup (Optional)

1. Add custom domain in Vercel
2. Update DNS records
3. Wait for SSL certificate
4. Update all URLs to use custom domain
