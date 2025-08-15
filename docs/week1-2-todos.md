# Week 1-2 Development Todo List

Based on the roadmap analysis from `docs/roadmap.md`, this document outlines the specific tasks for the first two weeks of development.

## Week 1: Foundation Setup

**Goal**: Complete development environment and core infrastructure

### Monday-Tuesday: Database & Auth

- [ ] Set up Supabase project
- [ ] Configure database schema (consultations, user_profiles, user_events)
- [ ] Set up Row Level Security (RLS) policies
- [ ] Test authentication flow

### Wednesday-Thursday: Next.js App

- [x] Create Next.js 14 project with App Router (already done)
- [x] Set up Tailwind CSS with design system (already done)
- [ ] Implement basic navigation and layout
- [x] Configure Supabase client (already done)

### Friday: Integration Testing

- [ ] Test database connections
- [ ] Verify authentication flow
- [ ] Set up development environment
- [ ] Deploy to Vercel staging

### Week 1 Success Criteria

- [ ] User can sign up and sign in
- [ ] Database stores user data
- [ ] App deploys successfully
- [ ] Basic navigation works

---

## Week 2: Core I Ching Engine

**Goal**: Implement authentic I Ching consultation system

### Monday-Tuesday: Hexagram Engine

- [ ] Implement coin casting algorithm
- [ ] Create hexagram calculation logic
- [ ] Build all 64 hexagrams database
- [ ] Add changing lines calculation

### Wednesday-Thursday: Traditional Interpretations

- [ ] Add traditional hexagram meanings
- [ ] Implement interpretation display
- [ ] Create hexagram line visualization
- [ ] Cultural consultant review session

### Friday: UI Implementation

- [ ] Build coin casting animation
- [ ] Create hexagram display component
- [ ] Implement question input form
- [ ] Basic consultation flow

### Week 2 Success Criteria

- [ ] User can cast coins and get hexagram
- [ ] Traditional interpretations display correctly
- [ ] Cultural authenticity validated
- [ ] Consultation saves to database

---

## Current Project Status

**Completed:**

- ✅ Next.js 14 setup with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS with custom Taoist design system
- ✅ Test-driven development foundation (comprehensive test suites)
- ✅ Development tooling (ESLint, Prettier, Husky)
- ✅ Supabase and OpenAI client configuration

**Next Priority:**

1. **Database setup** - Create Supabase tables and authentication
2. **Core I Ching engine** - Implement the functions tested in `__tests__/unit/lib/iching/hexagram.test.ts`
3. **AI integration** - Implement functions tested in `__tests__/unit/lib/openai/consultation.test.ts`
4. **Database operations** - Implement functions tested in `__tests__/unit/lib/supabase/consultations.test.ts`

**Development Commands:**

```bash
# Run tests to see what needs implementation
pnpm test

# Run specific test file
pnpm test __tests__/unit/lib/iching/hexagram.test.ts

# Start development server
pnpm dev

# Check API connections (requires environment variables)
pnpm check-connections
```

**Note**: Tests are currently failing because the implementation files don't exist yet. This is expected in the TDD (Test-Driven Development) approach - tests define what needs to be built.
