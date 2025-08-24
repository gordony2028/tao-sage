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

### High-Level Request Flow

1. **User Interaction** → Next.js App Router (React Server Components)
2. **API Call** → Next.js API Routes (`/app/api/*`)
3. **Business Logic** → Service Layer (`/lib/*`)
4. **External Services**:
   - **Database**: Supabase PostgreSQL (auth, consultations, user data)
   - **AI**: OpenAI GPT-4 (personalized interpretations)
   - **Auth**: Supabase Auth (social login, JWT tokens)
5. **Response** → Streaming or JSON response to client

### Key Architectural Decisions

- **Server Components First**: Use React Server Components by default, Client Components only when needed (interactivity)
- **Streaming AI Responses**: Use Vercel AI SDK for real-time AI streaming
- **JSONB for Flexibility**: Store complex data (interpretations, metadata) in PostgreSQL JSONB columns
- **Edge Functions**: Deploy API routes as Vercel Edge Functions for global performance
- **Cultural Authenticity**: All AI prompts include cultural context and sensitivity guidelines

### Module Architecture

```
Core Business Logic (TDD-driven):
├── lib/iching/         # I Ching calculation engine
│   ├── hexagram.ts     # Core hexagram generation & validation
│   └── meanings.ts     # Traditional interpretations database
├── lib/openai/         # AI integration layer
│   ├── consultation.ts # AI interpretation generation
│   └── prompts.ts      # Cultural-aware prompt templates
├── lib/supabase/       # Database operations
│   ├── client.ts       # Supabase client singleton
│   ├── consultations.ts # Consultation CRUD operations
│   └── auth.ts         # Authentication helpers
└── lib/consultation/   # Business orchestration
    └── service.ts      # Combines I Ching + AI + DB
```

## Development Commands

The project uses pnpm as the package manager.

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
pnpm test:unit       # Run Jest unit tests only
pnpm test:ci         # Run tests in CI mode with coverage
pnpm test:e2e        # Run Playwright E2E tests (requires: pnpm exec playwright install)
pnpm test:e2e:ui     # Run Playwright tests with UI
pnpm test:coverage   # Run tests with coverage report

# Database & API Validation
pnpm check-connections # Test Supabase and OpenAI API connectivity
pnpm db:generate-types # Generate TypeScript types from Supabase schema
pnpm db:setup        # Setup database schema
pnpm db:verify       # Verify Supabase connection
pnpm db:test-tables  # Test database tables

# Utilities
pnpm clean           # Clean build artifacts and caches
pnpm analyze         # Analyze bundle size (ANALYZE=true pnpm build)
pnpm setup           # Run project setup script
pnpm health-check    # Run comprehensive system health check

# Cultural & AI Validation
pnpm cultural:validate # Validate cultural content for authenticity
pnpm ai:validate     # Validate AI responses for cultural sensitivity
```

### Running Individual Tests

```bash
# Run specific test file
pnpm test __tests__/unit/lib/iching/hexagram.test.ts

# Run tests matching pattern
pnpm test --testNamePattern="generateHexagram"

# Run tests for specific directory
pnpm test __tests__/unit/lib/

# Debug failing tests
pnpm test --verbose --no-coverage

# Run single E2E test
pnpm test:e2e homepage.spec.ts

# Run E2E tests with specific browser
pnpm test:e2e --project=chromium
```

## Current State & Implementation Status

**Phase: Test-Driven Development Foundation Complete ✅**

The project has comprehensive tests written but core implementations are missing. Run `pnpm test` to see exactly what needs to be implemented.

### Missing Core Files (Required to Pass Tests)

1. **`src/lib/iching/hexagram.ts`** - Core I Ching engine

   - `generateHexagram()` - Generate random hexagram with 6 lines
   - `getHexagramName(number)` - Get traditional hexagram names (1-64)
   - `calculateChangingLines(lines)` - Identify changing lines (6 and 9)

2. **`src/lib/openai/consultation.ts`** - AI integration

   - `generateInterpretation()` - Create culturally sensitive AI responses
   - Prompt formatting with hexagram context
   - Error handling for API failures

3. **`src/lib/supabase/consultations.ts`** - Database operations

   - `saveConsultation()` - Persist consultations with metadata
   - `getUserConsultations()` - Retrieve user history
   - Database schema integration

4. **`src/types/iching.ts`** - TypeScript definitions
   - Hexagram interface with lines, number, changingLines
   - Consultation interface with question, hexagram, interpretation

### Implementation Priority

1. **Start with I Ching core** (`hexagram.ts` + `types/iching.ts`)
2. **Add AI integration** (`consultation.ts`)
3. **Implement database layer** (`consultations.ts`)
4. **Build UI components** to connect everything

## Code Quality Standards

### Testing Requirements

- **Minimum Coverage**: 80% lines, 80% functions, 75% branches
- **Test Categories**:
  - Unit tests (Jest): Business logic, utilities, API handlers
  - E2E tests (Playwright): User flows, cross-browser compatibility
  - Cultural tests: Validate respectful language and authenticity
- **TDD Workflow**: Write tests first → Implement to pass → Refactor

### TypeScript Standards

- **Strict Mode**: Enabled in `tsconfig.json`
- **No `any` types**: Use proper typing or `unknown` when necessary
- **Interface over Type**: Prefer interfaces for object shapes
- **Explicit Return Types**: Always define function return types

### Component Patterns

```typescript
// Server Component (default)
export default async function ConsultationList() {
  const consultations = await getConsultations();
  return <div>{/* render */}</div>;
}

// Client Component (when needed)
'use client';
export default function InteractiveHexagram() {
  const [lines, setLines] = useState<Line[]>([]);
  return <div>{/* interactive UI */}</div>;
}
```

### Tailwind CSS Custom Theme

The project uses a custom Taoist-inspired color palette:

- `mountain-stone`: #4a5c6a
- `flowing-water`: #6b8caf
- `bamboo-green`: #7ba05b
- `sunset-gold`: #d4a574
- `earth-brown`: #8b7355
- `morning-mist`: #e8f1f5
- `cloud-white`: #fefefe
- `yin`: #1a1a1a
- `yang`: #f9f9f9

Custom animations: `natural-spin`, `fade-in`, `slide-in-right`
Custom shadows: `water-shadow`, `mist-glow`, `earth-shadow`, `floating-shadow`

## Common Development Tasks

### Adding a New Feature

1. **Write Tests First**: Create test file in `__tests__/unit/lib/`
2. **Run Failing Tests**: `pnpm test:watch path/to/test`
3. **Implement Feature**: Add code in `src/lib/`
4. **Make Tests Pass**: Iterate until all tests green
5. **Add E2E Test**: Create scenario in `e2e/`
6. **Update Types**: Add TypeScript definitions in `src/types/`

### Working with Supabase

```bash
# Generate types from schema
pnpm db:generate-types

# Test database connection
pnpm db:verify

# Run database migrations (when available)
supabase migration up
```

### Environment Setup

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App config
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Performance Targets

- **Initial Load**: <3s on 3G networks
- **AI Response**: <2s for consultation generation
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Mobile Performance**: 60fps animations, <100MB memory

## Important Principles

- **Cultural Respect**: Always prioritize authentic representation over commercial interests
- **Test-Driven Quality**: All implementations must pass existing tests before adding new features
- **Privacy First**: Spiritual guidance is deeply personal - implement strong privacy controls
- **Mobile-First**: Optimize for contemplative mobile usage
- **Gradual Enhancement**: Start with core consultation features before adding AI complexity
