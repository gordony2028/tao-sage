# Feature Implementation Plan - Pricing Tiers

This document outlines the implementation strategy for the features promised in our pricing tiers.

## Implementation Phases

### Phase 1: MVP Foundation (Weeks 1-4) 🎯 **CURRENT PHASE**

**Status**: Core features needed for free tier and basic functionality

#### Free Tier - "Seeker" ✅

- [x] 3 consultations per week (basic usage limits)
- [x] Daily guiding hexagram (simple random hexagram)
- [x] Basic educational content (existing Learn section)
- [ ] Simple journal (30-day history) - **NEEDS IMPLEMENTATION**
- [ ] Community access (read-only) - **NEEDS IMPLEMENTATION**

#### Core Infrastructure Needed for All Tiers

- [ ] User subscription management system
- [ ] Consultation usage tracking
- [ ] Basic I Ching hexagram generation (core business logic)
- [ ] Database schema for consultations and user data

### Phase 2: Sage+ Premium Features (Weeks 5-8)

**Status**: Features that differentiate paid tier from free

#### Sage+ ($6.99/month) - **PRIORITIZED FOR REVENUE**

- [ ] Unlimited consultations (remove usage limits)
- [ ] AI-powered personalized insights (OpenAI integration)
- [ ] Full calendar integration (Google Calendar API)
- [ ] Advanced pattern recognition (AI analysis of consultation history)
- [ ] Complete learning curriculum (expanded Learn section)
- [ ] Unlimited consultation history (database optimization)
- [ ] Community participation (comments, discussions)
- [ ] Email support (support ticket system)

### Phase 3: Sage Pro Advanced Features (Weeks 9-12)

**Status**: Premium business features, lower priority for initial launch

#### Sage Pro ($16.99/month) - **ADVANCED USERS**

- [ ] Proactive wisdom reminders (smart notifications based on patterns)
- [ ] Advanced calendar analysis (AI insights from calendar data)
- [ ] Wellness app integration (Apple Health, Google Fit APIs)
- [ ] Custom consultation templates (user-defined question formats)
- [ ] Export & backup tools (PDF/CSV export, data portability)
- [ ] White-label for professionals (coaching/therapy integration)
- [ ] Priority support (dedicated support channel)
- [ ] API access (REST API for developers)

## Implementation Strategy

### Immediate Actions (Next 2 weeks)

#### 1. Core I Ching Engine 🔥 **CRITICAL**

```typescript
// Priority: HIGHEST - Needed for any functionality
src/lib/iching/
├── hexagram.ts          // Core hexagram generation
├── interpretation.ts    // Traditional interpretations
└── consultation.ts      // Full consultation flow
```

#### 2. Basic Subscription System 🔥 **CRITICAL FOR REVENUE**

```typescript
// Priority: HIGHEST - Needed for paid tiers
src/lib/subscription/
├── usage-tracking.ts    // Track consultation usage
├── tier-validation.ts   // Check user access levels
└── billing.ts          // Stripe integration (future)
```

#### 3. User Consultation History 🔥 **CRITICAL**

```sql
-- Database schema needed immediately
consultations (
  id, user_id, question, hexagram_number,
  interpretation, created_at, tier_used
)

user_usage (
  user_id, consultations_this_week,
  week_start_date, subscription_tier
)
```

### Medium Priority (Weeks 3-6)

#### 4. AI Integration for Sage+ ⚡ **REVENUE DRIVER**

- OpenAI API integration for personalized interpretations
- Pattern recognition from consultation history
- Cultural sensitivity validation

#### 5. Community Features 📱 **USER ENGAGEMENT**

- Basic forum/discussion system
- Read-only access for free users
- Full participation for paid users

#### 6. Calendar Integration 📅 **SAGE+ FEATURE**

- Google Calendar API integration
- Proactive guidance based on upcoming events
- Calendar-aware hexagram selection

### Lower Priority (Weeks 7-12)

#### 7. Advanced Analytics & Patterns 📊

- User journey tracking
- Hexagram frequency analysis
- Personalized insights dashboard

#### 8. Professional Features 💼 **SAGE PRO**

- White-label customization
- API access for third-party integrations
- Advanced export capabilities

## Technical Implementation Notes

### Authentication & Subscription Management

```typescript
// User object enhancement needed
interface User {
  id: string;
  email: string;
  subscription: {
    tier: 'free' | 'sage_plus' | 'sage_pro';
    status: 'active' | 'trial' | 'cancelled';
    consultations_used_this_week: number;
    week_reset_date: Date;
  };
}
```

### Feature Gating Strategy

```typescript
// Implementation pattern for all features
function canAccessFeature(user: User, feature: string): boolean {
  const plan = SUBSCRIPTION_PLANS[user.subscription.tier];
  return plan.limitations[feature];
}

// Usage in components
{canAccessFeature(user, 'aiInsights') && (
  <AIInsightsPanel />
)}
```

### Database Schema Priority

```sql
-- Phase 1: Essential tables
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  subscription_tier TEXT DEFAULT 'free',
  consultations_this_week INT DEFAULT 0,
  week_reset_date TIMESTAMP
);

CREATE TABLE consultations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  question TEXT,
  hexagram_number INT,
  interpretation JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Phase 2: Community and patterns
CREATE TABLE user_patterns (
  user_id UUID,
  pattern_type TEXT,
  pattern_data JSONB,
  identified_at TIMESTAMP
);

-- Phase 3: Professional features
CREATE TABLE api_keys (
  user_id UUID,
  api_key TEXT,
  permissions JSONB,
  created_at TIMESTAMP
);
```

## Launch Strategy

### Minimum Viable Product (MVP) Launch

**Target**: 4-6 weeks from now

**Must-Have Features**:

- ✅ Basic hexagram generation
- ✅ Free tier with usage limits
- ✅ User authentication
- [ ] Consultation history (30 days for free)
- [ ] Sage+ subscription with unlimited consultations
- [ ] Basic AI interpretations (OpenAI)

**Nice-to-Have for Launch**:

- [ ] Calendar integration
- [ ] Community features
- [ ] Advanced pattern recognition

### Post-Launch Priorities (Based on User Feedback)

1. **Month 1**: Focus on Sage+ conversion features
2. **Month 2**: Community and engagement features
3. **Month 3**: Sage Pro professional features

## Risk Mitigation

### Over-Promising Features

**Risk**: Pricing page promises features we can't deliver quickly
**Mitigation**:

- Add "Coming Soon" badges to unreleased features
- Implement basic versions first, enhance over time
- Clear communication about feature timeline

### Technical Complexity

**Risk**: Advanced features (AI, calendar) are complex
**Mitigation**:

- Start with simple implementations
- Use third-party services (OpenAI, Google APIs)
- Progressive enhancement approach

### Revenue Dependency

**Risk**: Need paid features working quickly for revenue
**Mitigation**:

- Prioritize Sage+ features over Sage Pro
- Focus on unlimited consultations first (easier to implement)
- AI integration second (clear value proposition)

## Success Metrics

### Phase 1 Success

- [ ] Free users can complete 3 consultations/week
- [ ] Basic consultation history working
- [ ] User can upgrade to Sage+ (even if features limited)

### Phase 2 Success

- [ ] 10%+ conversion from free to Sage+
- [ ] AI interpretations providing clear value
- [ ] User engagement increasing (return visits)

### Phase 3 Success

- [ ] Sage Pro users getting value from advanced features
- [ ] Professional users (coaches/therapists) adopting white-label
- [ ] API usage by developers/partners

## Development Team Allocation

**Priority 1 (This Month)**:

- Core I Ching engine and consultation flow
- Basic subscription and usage tracking
- AI integration for interpretations

**Priority 2 (Next Month)**:

- Calendar integration and proactive features
- Community system and user engagement
- Advanced analytics and pattern recognition

**Priority 3 (Month 3)**:

- Professional and enterprise features
- API development
- White-label customization

This phased approach ensures we can launch with core value proposition while building towards the full feature set promised in our pricing tiers.
