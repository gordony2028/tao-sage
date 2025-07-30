# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sage is an AI-powered I Ching (Yijing) life guidance application that transforms ancient Chinese wisdom into a modern, proactive spiritual guidance platform. The project uses a simplified Next.js + Supabase + OpenAI stack optimized for solo development.

## Architecture

### Technology Stack

- **Frontend**: Next.js 14 (App Router) with React and Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase PostgreSQL with JSONB for flexible data
- **AI/ML**: OpenAI GPT-4 API for personalized interpretations
- **Hosting**: Vercel for deployment and edge functions
- **Authentication**: Supabase Auth with social login support

### Current State

This is an early-stage project with a complete HTML/CSS prototype (`index.html`) and comprehensive documentation. The actual Next.js application is not yet implemented.

## File Structure

```
tao-sage/
├── index.html              # Complete HTML/CSS prototype with Taoist design
├── sage_demo_1.html        # Alternative demo version
├── docs/                   # Comprehensive project documentation
│   ├── prd.md              # Product Requirements Document (1400+ lines)
│   ├── modules.md          # Simplified module breakdown for solo dev
│   ├── api_contracts.md    # API specifications
│   ├── coding_standards.md # Development guidelines
│   ├── ui.md               # UI/UX specifications
│   ├── market.md           # Market analysis
│   ├── roadmap.md          # Development roadmap
│   └── testing.md          # Testing strategy
└── CLAUDE.md              # This file
```

## Development Commands

The project is now set up with Next.js, TypeScript, and all development tools.

### Core Commands

```bash
# Development
pnpm dev             # Start development server (http://localhost:3000)
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm lint:fix        # Run ESLint with auto-fix
pnpm type-check      # Run TypeScript type checking
pnpm format          # Format code with Prettier
pnpm format:check    # Check code formatting

# Testing
pnpm test            # Run Jest tests
pnpm test:watch      # Run tests in watch mode
pnpm test:ci         # Run tests in CI mode with coverage
pnpm test:e2e        # Run Playwright E2E tests
pnpm test:coverage   # Run tests with coverage report

# Git Hooks (automatic)
pre-commit           # Runs lint-staged (ESLint + Prettier)
commit-msg           # Validates commit messages with commitlint

# Utilities
pnpm clean           # Clean build artifacts and caches
pnpm analyze         # Analyze bundle size
pnpm health-check    # Run project health checks
```

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your API keys:
   - Supabase URL and keys
   - OpenAI API key
   - Optional: Cultural Expert API key

## Core Concepts

### I Ching Integration

- **64 Hexagrams**: Complete traditional hexagram system with interpretations
- **Digital Consultation**: Modern interface for ancient coin-casting ritual
- **AI Enhancement**: GPT-4 provides personalized interpretations while respecting cultural authenticity
- **Three-Tier Interpretation**: Traditional wisdom, AI insights, and practical guidance

### User Experience Philosophy

- **Wu Wei Design**: Interface promotes calm, effortless interaction
- **Cultural Authenticity**: Respectful representation of Chinese wisdom traditions
- **Progressive Disclosure**: Complex features revealed as users grow in understanding
- **Mobile-First**: Optimized for contemplative mobile usage

### Data Architecture

The application uses a simplified PostgreSQL schema with JSONB for flexibility:

```sql
-- Core tables
user_profiles       # User preferences and subscription tiers
consultations       # I Ching readings with JSONB interpretations
user_events         # Analytics and usage tracking
```

### AI Integration Pattern

```typescript
// Typical AI consultation flow
1. User poses question
2. Generate hexagram (traditional algorithm)
3. Query OpenAI with context:
   - User's question
   - Hexagram traditional meaning
   - User's consultation history (patterns)
4. Return culturally authentic interpretation
5. Store consultation with metadata
```

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled for type safety
- **Tailwind CSS**: Utility-first styling with custom Taoist color palette
- **Component Structure**: Server Components by default, Client Components when needed
- **Error Handling**: Graceful degradation with meaningful user messages

### Cultural Sensitivity

- Partner with I Ching scholars for authenticity
- Provide proper attribution and historical context
- Avoid appropriation through respectful representation
- Include educational content about I Ching significance

### Performance Requirements

- **App Launch**: <3 seconds cold start
- **Consultation Generation**: <2 seconds including AI
- **Offline Capability**: Core consultations work without internet
- **Mobile Optimization**: Smooth 60fps animations on minimum spec devices

## Key Features to Implement

### MVP Features (First 4 weeks)

1. **Core Consultation Engine**: Digital I Ching with all 64 hexagrams
2. **Daily Guidance Dashboard**: Personalized daily hexagram
3. **User Authentication**: Supabase Auth with social login
4. **AI Interpretations**: OpenAI-powered personalized insights
5. **Consultation History**: User's spiritual journey tracking

### Premium Features (Weeks 5-8)

1. **Calendar Integration**: Proactive guidance based on schedule
2. **Pattern Recognition**: AI identifies recurring life themes
3. **Advanced Analytics**: Personal timeline with hexagram correlations
4. **Subscription System**: Freemium model with Stripe integration

### Pro Features (Weeks 9-12)

1. **Proactive Monitoring**: AI agent provides unsolicited guidance
2. **Health Integration**: Correlate guidance with wellness data
3. **Community Features**: Anonymous wisdom sharing
4. **White-label Solutions**: B2B offerings for coaches

## Testing Strategy

### Unit Testing

- Core I Ching calculation algorithms
- AI prompt engineering and response parsing
- Database query functions
- Authentication flows

### Integration Testing

- OpenAI API integration and error handling
- Supabase database operations
- Payment processing flows
- Calendar API integrations

### Cultural Testing

- I Ching scholar review of interpretations
- Cultural authenticity validation
- Traditional accuracy verification

## Deployment

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Analytics
VERCEL_ANALYTICS_ID=
```

### Vercel Configuration

```json
{
  "framework": "nextjs",
  "functions": {
    "app/api/consultation/create/route.ts": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/daily-guidance",
      "schedule": "0 6 * * *"
    }
  ]
}
```

## Important Notes

- **Cultural Respect**: Always prioritize authentic representation over commercial interests
- **Privacy First**: Spiritual guidance is deeply personal - implement strong privacy controls
- **Gradual Rollout**: Start with core consultation features before adding AI complexity
- **Community Input**: Engage I Ching practitioners and Chinese cultural experts throughout development
- **Quality Over Speed**: Take time to get cultural representation right

## Resources

- **I Ching Reference**: Wilhelm-Baynes translation for traditional interpretations
- **Cultural Consultation**: Advisory board of Chinese philosophy scholars
- **Design Inspiration**: Traditional Chinese aesthetics with modern minimalism
- **User Research**: Meditation app users and spiritual wellness communities
