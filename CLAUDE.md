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

**Phase: Test-Driven Development Foundation Complete ✅**

The project has evolved from documentation and prototypes to a fully scaffolded Next.js application with comprehensive test coverage:

- **✅ Complete Next.js 14 Setup**: App Router, TypeScript, Tailwind CSS with custom Taoist design system
- **✅ API Integrations Ready**: Supabase (database/auth) and OpenAI clients configured and tested
- **✅ Development Tooling**: ESLint, Prettier, Husky pre-commit hooks, Jest + Playwright testing
- **✅ TDD Foundation**: Comprehensive test suites for I Ching logic, AI integration, and database operations
- **🔄 Implementation Phase**: Ready to implement core features following test-driven development

**Next Steps**: Implement the core I Ching library, OpenAI consultation service, and Supabase database functions to make the failing tests pass.

## File Structure

```
tao-sage/
├── src/                    # Next.js application source
│   ├── app/                # App Router pages and layouts
│   │   ├── layout.tsx      # Root layout with Taoist typography
│   │   ├── page.tsx        # Homepage component
│   │   └── globals.css     # Global styles with custom CSS variables
│   ├── components/         # Reusable React components (to be implemented)
│   ├── lib/                # Core business logic and integrations
│   │   ├── iching/         # I Ching calculation engine (to be implemented)
│   │   ├── openai/         # AI consultation service (to be implemented)
│   │   └── supabase/       # Database client and operations (to be implemented)
│   ├── hooks/              # Custom React hooks (to be implemented)
│   ├── types/              # TypeScript type definitions (to be implemented)
│   └── styles/             # Additional styling utilities
├── __tests__/              # Test suites (TDD foundation complete)
│   ├── unit/lib/           # Unit tests for core business logic
│   │   ├── iching/         # I Ching calculation tests
│   │   ├── openai/         # AI integration tests
│   │   └── supabase/       # Database operation tests
│   └── utils/              # Test utilities and helpers
├── e2e/                    # End-to-end tests (Playwright)
│   └── homepage.spec.ts    # Homepage functionality and accessibility tests
├── docs/                   # Comprehensive project documentation
│   ├── prd.md              # Product Requirements Document (1400+ lines)
│   ├── modules.md          # Simplified module breakdown for solo dev
│   ├── setup.md            # Development environment setup guide
│   ├── enhanced_ui.md      # Complete UI Design System (merged from ui.md)
│   ├── api_contracts.md    # Complete API specification (merged from enhanced-backend-api.md)
│   └── [other docs...]     # Architecture, testing, coding standards
├── scripts/                # Development and deployment utilities
│   ├── check-connections.ts # API connectivity validation
│   └── validate-env.ts     # Environment variable validation
├── public/                 # Static assets
├── index.html              # Original HTML/CSS prototype (reference)
├── sage_demo_1.html        # Alternative demo version (reference)
├── package.json            # Dependencies and scripts
├── playwright.config.ts    # E2E testing configuration
├── jest.config.js          # Unit testing configuration
├── tailwind.config.js      # Tailwind CSS with custom Taoist theme
├── tsconfig.json           # TypeScript configuration (strict mode)
├── .eslintrc.js            # Code linting rules
├── .prettierrc.json        # Code formatting rules
└── CLAUDE.md              # This file
```

## Development Commands

The project uses pnpm as the package manager. All development tools are configured and ready.

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
pnpm test:e2e        # Run Playwright E2E tests
pnpm test:e2e:ui     # Run Playwright tests with UI
pnpm test:coverage   # Run tests with coverage report

# Git Hooks (automatic)
pre-commit           # Runs lint-staged (ESLint + Prettier)
commit-msg           # Validates commit messages with commitlint

# Connection Validation
pnpm check-connections # Test Supabase and OpenAI API connectivity

# Utilities
pnpm clean           # Clean build artifacts and caches
pnpm analyze         # Analyze bundle size
pnpm setup           # Run project setup script
pnpm health-check    # Run comprehensive system health check
pnpm db:generate-types # Generate TypeScript types from Supabase schema

# Cultural & AI Validation
pnpm cultural:validate # Validate cultural content for authenticity
pnpm ai:validate     # Validate AI responses for cultural sensitivity
```

### Environment Setup

1. **Install Dependencies**: `pnpm install`
2. **Environment Variables**: Create `.env.local` with these required variables:

   ```bash
   # Supabase (database/auth)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # OpenAI (AI interpretations)
   OPENAI_API_KEY=your_openai_api_key

   # App configuration
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Verify Setup**: Run `pnpm check-connections` to test API connectivity
4. **Start Development**: `pnpm dev` to launch on http://localhost:3000

**API Status**: ✅ All connections verified and working (when environment variables are set)

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

**Current Status: TDD Foundation Complete ✅**

The project follows a comprehensive test-driven development approach with complete test coverage for all core functionality.

### Unit Testing (Jest)

**✅ Implemented Tests**:

- **I Ching Core Logic** (`__tests__/unit/lib/iching/hexagram.test.ts`)
  - Hexagram generation and validation (6 lines, 64 hexagrams)
  - Traditional changing lines calculation
  - Randomness and authenticity validation
- **OpenAI Integration** (`__tests__/unit/lib/openai/consultation.test.ts`)
  - AI interpretation generation with cultural sensitivity
  - Prompt formatting and error handling
  - Input validation and API failure scenarios
- **Supabase Database** (`__tests__/unit/lib/supabase/consultations.test.ts`)
  - Consultation saving and retrieval
  - User history management
  - Database error handling and edge cases

### End-to-End Testing (Playwright)

**✅ Implemented Tests** (`e2e/homepage.spec.ts`):

- Cross-browser compatibility (Chrome, Firefox, Safari, Mobile)
- Responsive design and mobile optimization
- Accessibility compliance (WCAG 2.1)
- Performance monitoring and error detection
- Taoist design system validation

### Test Utilities

**✅ Comprehensive Framework** (`__tests__/utils/test-helpers.ts`):

- Mock data generators for hexagrams and consultations
- Cultural sensitivity validation helpers
- API response mocking utilities
- Data validation and structure verification

### Cultural Testing

**✅ Built-in Framework**:

- Cultural sensitivity validation in test utilities
- Respectful language detection and enforcement
- Traditional accuracy verification through test cases
- **Planned**: I Ching scholar review process

### Running Tests

```bash
# Unit tests (Jest) - Currently failing (TDD red phase) ⚠️
pnpm test            # Shows exactly what needs to be implemented

# E2E tests (Playwright) - Requires browser installation
pnpm exec playwright install  # One-time setup
pnpm test:e2e        # Full cross-browser testing

# Coverage and quality
pnpm test:coverage   # Test coverage reports
pnpm test:ci         # CI-ready test execution
```

**TDD Status**: Tests are written and failing ⚠️ - ready for implementation phase to make them pass ✅

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
```

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

## Implementation Status

**Current Phase: Test-Driven Implementation 🔄**

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

**Tip**: Run individual test files while implementing to get immediate feedback

## Important Notes

- **Cultural Respect**: Always prioritize authentic representation over commercial interests
- **Test-Driven Quality**: All implementations must pass existing tests before adding new features
- **Privacy First**: Spiritual guidance is deeply personal - implement strong privacy controls
- **Gradual Enhancement**: Start with core consultation features before adding AI complexity
- **Community Input**: Engage I Ching practitioners and Chinese cultural experts throughout development
- **Quality Over Speed**: Take time to get cultural representation right

**Development Philosophy**: Let the tests guide implementation - they encode both functional requirements and cultural sensitivity standards.

## Resources

- **I Ching Reference**: Wilhelm-Baynes translation for traditional interpretations
- **Cultural Consultation**: Advisory board of Chinese philosophy scholars
- **Design Inspiration**: Traditional Chinese aesthetics with modern minimalism
- **User Research**: Meditation app users and spiritual wellness communities
