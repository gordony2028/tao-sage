# Sage Coding Standards
## Next.js + Supabase + OpenAI Stack Standards

**Version:** 1.0  
**Date:** July 30, 2025  
**Stack:** Next.js 14, TypeScript, Supabase, OpenAI, Tailwind CSS  
**Philosophy:** Cultural respect, accessibility-first, performance-conscious  

---

## Table of Contents

1. [Project Philosophy](#1-project-philosophy)
2. [TypeScript Standards](#2-typescript-standards)
3. [Next.js App Router Conventions](#3-nextjs-app-router-conventions)
4. [React Component Standards](#4-react-component-standards)
5. [Supabase Integration Standards](#5-supabase-integration-standards)
6. [OpenAI Integration Standards](#6-openai-integration-standards)
7. [Styling Standards](#7-styling-standards)
8. [API Route Standards](#8-api-route-standards)
9. [Error Handling Standards](#9-error-handling-standards)
10. [Performance Standards](#10-performance-standards)
11. [Security Standards](#11-security-standards)
12. [Cultural Sensitivity Standards](#12-cultural-sensitivity-standards)
13. [Accessibility Standards](#13-accessibility-standards)
14. [Code Organization](#14-code-organization)
15. [Git Workflow](#15-git-workflow)

---

## 1. Project Philosophy

### 1.1 Core Development Principles

**Wu Wei (無為) - Effortless Development**
- Write code that is self-evident and requires minimal explanation
- Leverage managed services over custom implementations
- Choose simplicity over cleverness
- Let TypeScript and tooling handle complexity

**Cultural Authenticity**
- All I Ching related content must be culturally accurate
- Chinese characters and terms require expert validation
- Respectful representation of ancient wisdom traditions
- Code comments should reflect understanding, not assumptions

**Accessibility First**
- Every component must meet WCAG 2.1 AA standards
- Screen reader compatibility is non-negotiable
- Keyboard navigation must be intuitive
- Performance impacts accessibility

### 1.2 Technology Decision Framework

Before adding any new dependency, ask:
1. **Managed Service First**: Can Supabase/Vercel handle this?
2. **Bundle Impact**: Does this add <100KB to the bundle?
3. **Maintenance Burden**: Can one person maintain this?
4. **Cultural Sensitivity**: Does this respect our spiritual context?

---

## 2. TypeScript Standards

### 2.1 Type Definitions

**Core Domain Types**
```typescript
// types/i-ching.ts - Core spiritual domain types
export interface Hexagram {
  readonly number: number; // 1-64
  readonly name: string;
  readonly chinese: string;
  readonly symbol: string;
  readonly upperTrigram: Trigram;
  readonly lowerTrigram: Trigram;
  readonly meaning: string;
  readonly judgment: string;
  readonly image: string;
  readonly lines: readonly HexagramLine[];
}

export interface HexagramLine {
  readonly position: 1 | 2 | 3 | 4 | 5 | 6;
  readonly type: 'yang' | 'yin';
  readonly changing: boolean;
  readonly interpretation: string;
}

export interface Consultation {
  readonly id: string;
  readonly userId: string;
  readonly question: string;
  readonly category: ConsultationCategory;
  readonly hexagram: Hexagram;
  readonly changingLines: readonly number[];
  readonly interpretations: {
    readonly traditional: string;
    readonly ai: string;
    readonly practical: string;
  };
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type ConsultationCategory = 
  | 'general' 
  | 'career' 
  | 'relationships' 
  | 'health' 
  | 'spiritual'
  | 'decision';
```

**Database Types (Supabase)**
```typescript
// types/database.ts - Generated from Supabase
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          display_name: string | null;
          preferences: Json;
          subscription_tier: 'free' | 'sage_plus' | 'sage_pro';
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          preferences?: Json;
          subscription_tier?: 'free' | 'sage_plus' | 'sage_pro';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          preferences?: Json;
          subscription_tier?: 'free' | 'sage_plus' | 'sage_pro';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
```

### 2.2 Naming Conventions

**Variables and Functions**
```typescript
// ✅ Good - Descriptive and context-aware
const hexagramInterpretation = await generateAIInterpretation(question, hexagram);
const isConsultationComplete = user.consultations.length > 0;
const dailyGuidanceHexagram = await generateDailyGuidance(userId);

// ❌ Bad - Generic or unclear
const data = await getStuff();
const result = processData(input);
const thing = someFunction();
```

**Constants**
```typescript
// ✅ Good - Semantic and cultural
const I_CHING_HEXAGRAM_COUNT = 64;
const TRIGRAM_NAMES = {
  HEAVEN: '乾 (Qián)',
  EARTH: '坤 (Kūn)',
  THUNDER: '震 (Zhèn)',
  // ...
} as const;

const CONSULTATION_LIMITS = {
  FREE_TIER: 3,
  SAGE_PLUS: Infinity,
  SAGE_PRO: Infinity,
} as const;
```

### 2.3 Type Safety Rules

**Strict TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Utility Types Usage**
```typescript
// ✅ Good - Explicit type transformations
type CreateConsultationData = Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>;
type PartialUserProfile = Partial<Pick<UserProfile, 'display_name' | 'preferences'>>;

// AI Response handling with proper error types
type AIInterpretationResult = 
  | { success: true; interpretation: string; tokens: number }
  | { success: false; error: 'rate_limit' | 'invalid_input' | 'service_unavailable' };
```

---

## 3. Next.js App Router Conventions

### 3.1 File Structure Standards

**App Router Organization**
```
src/
├── app/
│   ├── (auth)/                 # Route groups for auth
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── consultation/
│   │   ├── page.tsx           # Consultation interface
│   │   ├── [id]/
│   │   │   └── page.tsx       # Individual consultation
│   │   └── loading.tsx        # Consultation loading UI
│   ├── api/
│   │   ├── consultation/
│   │   │   ├── create/
│   │   │   │   └── route.ts   # POST /api/consultation/create
│   │   │   └── [id]/
│   │   │       └── route.ts   # GET/PUT /api/consultation/[id]
│   │   ├── ai/
│   │   │   └── interpret/
│   │   │       └── route.ts   # POST /api/ai/interpret
│   │   └── user/
│   │       └── profile/
│   │           └── route.ts   # GET/PUT /api/user/profile
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home/Dashboard
│   ├── loading.tsx            # Global loading UI
│   ├── error.tsx              # Global error UI
│   └── not-found.tsx          # 404 page
```

### 3.2 Page Component Standards

**Page Components**
```typescript
// app/consultation/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ConsultationInterface } from '@/components/consultation/ConsultationInterface';
import { ConsultationHistory } from '@/components/consultation/ConsultationHistory';

export const metadata: Metadata = {
  title: 'I Ching Consultation | Sage',
  description: 'Seek wisdom through authentic I Ching consultation with AI-powered insights.',
  openGraph: {
    title: 'I Ching Consultation | Sage',
    description: 'Ancient wisdom for modern decisions',
    type: 'website',
  },
};

export default function ConsultationPage() {
  return (
    <main className="consultation-page">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<ConsultationSkeleton />}>
          <ConsultationInterface />
        </Suspense>
        
        <Suspense fallback={<HistorySkeleton />}>
          <ConsultationHistory />
        </Suspense>
      </div>
    </main>
  );
}

// Loading component
function ConsultationSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-morning-mist rounded-lg"></div>
      <div className="h-32 bg-morning-mist rounded-lg"></div>
    </div>
  );
}
```

### 3.3 Layout Standards

**Root Layout**
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { Navigation } from '@/components/navigation/Navigation';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Sage',
    default: 'Sage - AI-Powered I Ching Guidance'
  },
  description: 'Ancient Chinese wisdom meets modern AI for personalized life guidance.',
  keywords: ['I Ching', 'wisdom', 'guidance', 'AI', 'spiritual', 'decision making'],
  authors: [{ name: 'Sage Team' }],
  creator: 'Sage',
  publisher: 'Sage',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-br from-morning-mist to-cloud-white font-inter antialiased">
        <AuthProvider>
          <Navigation />
          <main className="pt-20 pb-8">
            {children}
          </main>
          <Toaster position="top-right" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 4. React Component Standards

### 4.1 Component Architecture

**Component Types**
```typescript
// 1. Server Components (default in App Router)
export default async function ConsultationHistory({ userId }: { userId: string }) {
  const consultations = await getConsultations(userId);
  
  return (
    <section className="consultation-history">
      {consultations.map(consultation => (
        <ConsultationCard key={consultation.id} consultation={consultation} />
      ))}
    </section>
  );
}

// 2. Client Components (interactive)
'use client';
import { useState } from 'react';

export function CoinCastingInterface() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lines, setLines] = useState<HexagramLine[]>([]);
  
  const castCoins = async () => {
    setIsAnimating(true);
    // Animation and logic
    setIsAnimating(false);
  };
  
  return (
    <div className="coin-casting">
      {/* Interactive elements */}
    </div>
  );
}
```

### 4.2 Component Patterns

**Props Interface Design**
```typescript
// ✅ Good - Explicit and extensible
interface WisdomCardProps {
  readonly hexagram: Hexagram;
  readonly interpretation: string;
  readonly isLoading?: boolean;
  readonly onSave?: (hexagramId: number) => void;
  readonly className?: string;
  readonly 'data-testid'?: string;
}

export function WisdomCard({ 
  hexagram, 
  interpretation, 
  isLoading = false,
  onSave,
  className = '',
  'data-testid': testId,
}: WisdomCardProps) {
  return (
    <article 
      className={`wisdom-card ${className}`}
      data-testid={testId}
      aria-label={`Hexagram ${hexagram.number}: ${hexagram.name}`}
    >
      {/* Component content */}
    </article>
  );
}
```

**Custom Hooks**
```typescript
// hooks/use-consultation.ts
export function useConsultation() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateConsultation = useCallback(async (question: string, category: ConsultationCategory) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/consultation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, category }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate consultation');
      }
      
      const consultation: Consultation = await response.json();
      return consultation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  return {
    generateConsultation,
    isGenerating,
    error,
  };
}
```

### 4.3 Event Handling Standards

**User Interactions**
```typescript
// ✅ Good - Explicit event types and error handling
interface ConsultationFormProps {
  onSubmit: (data: { question: string; category: ConsultationCategory }) => Promise<void>;
}

export function ConsultationForm({ onSubmit }: ConsultationFormProps) {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<ConsultationCategory>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (question.trim().length < 10) {
      toast.error('Please provide a more detailed question for better guidance.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({ question: question.trim(), category });
      setQuestion('');
      toast.success('Your consultation has been generated!');
    } catch (error) {
      toast.error('Failed to generate consultation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleQuestionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(event.target.value);
  };
  
  return (
    <form onSubmit={handleSubmit} className="consultation-form">
      {/* Form elements */}
    </form>
  );
}
```

---

## 5. Supabase Integration Standards

### 5.1 Client Configuration

**Supabase Client Setup**
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server-side client (for API routes)
export const createServerClient = () => {
  return createClient<Database>(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
};
```

### 5.2 Database Operations

**CRUD Operations**
```typescript
// lib/supabase/consultations.ts
import { supabase } from './client';
import type { Consultation, CreateConsultationData } from '@/types/i-ching';

export async function createConsultation(
  data: CreateConsultationData
): Promise<Consultation> {
  const { data: consultation, error } = await supabase
    .from('consultations')
    .insert({
      user_id: data.userId,
      question: data.question,
      category: data.category,
      hexagram_data: data.hexagram,
      interpretations: data.interpretations,
    })
    .select()
    .single();
    
  if (error) {
    console.error('Failed to create consultation:', error);
    throw new Error('Failed to save consultation');
  }
  
  return transformDatabaseConsultation(consultation);
}

export async function getUserConsultations(
  userId: string,
  limit = 20
): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Failed to fetch consultations:', error);
    throw new Error('Failed to load consultations');
  }
  
  return data.map(transformDatabaseConsultation);
}

// Transform database row to domain type
function transformDatabaseConsultation(row: any): Consultation {
  return {
    id: row.id,
    userId: row.user_id,
    question: row.question,
    category: row.category,
    hexagram: row.hexagram_data,
    interpretations: row.interpretations,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
```

### 5.3 Authentication Integration

**Auth Hook**
```typescript
// hooks/use-auth.ts
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };
  
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };
  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };
  
  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

## 6. OpenAI Integration Standards

### 6.1 AI Client Configuration

**OpenAI Setup**
```typescript
// lib/ai/client.ts
import { OpenAI } from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting configuration
export const AI_CONFIG = {
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  MODEL: 'gpt-4' as const,
  MAX_REQUESTS_PER_MINUTE: 50,
  TIMEOUT_MS: 30000,
} as const;
```

### 6.2 Prompt Engineering Standards

**I Ching Interpretation Prompts**
```typescript
// lib/ai/prompts.ts
import type { Hexagram, ConsultationCategory } from '@/types/i-ching';

export function createInterpretationPrompt(
  question: string,
  hexagram: Hexagram,
  category: ConsultationCategory,
  userContext?: string
): string {
  const basePrompt = `You are a wise I Ching interpreter with deep understanding of ancient Chinese wisdom and modern practical application.

Context:
- Question: "${question}"
- Category: ${category}
- Hexagram: ${hexagram.number} - ${hexagram.name} (${hexagram.chinese})
- Traditional Meaning: ${hexagram.meaning}
${userContext ? `- User Context: ${userContext}` : ''}

Guidelines:
1. Honor traditional I Ching wisdom and cultural authenticity
2. Provide practical, actionable guidance for modern life
3. Address the specific question with relevant insights
4. Maintain respectful, contemplative tone
5. Avoid fortune-telling; focus on wisdom and reflection
6. Keep response to 200-300 words

Provide a thoughtful interpretation that bridges ancient wisdom with practical modern guidance:`;

  return basePrompt;
}

export function createDailyGuidancePrompt(
  userPatterns: any[], // Simplified for brevity
  upcomingEvents: any[]
): string {
  return `Generate daily I Ching guidance based on user patterns and upcoming events...`;
}
```

### 6.3 AI Response Handling

**Streaming Responses**
```typescript
// lib/ai/interpretations.ts
import { openai, AI_CONFIG } from './client';
import { createInterpretationPrompt } from './prompts';
import type { Hexagram, ConsultationCategory } from '@/types/i-ching';

export async function generateAIInterpretation(
  question: string,
  hexagram: Hexagram,
  category: ConsultationCategory,
  userContext?: string
): Promise<{ interpretation: string; tokensUsed: number }> {
  try {
    const prompt = createInterpretationPrompt(question, hexagram, category, userContext);
    
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a wise I Ching interpreter focused on authentic wisdom and practical guidance.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: AI_CONFIG.MAX_TOKENS,
      temperature: AI_CONFIG.TEMPERATURE,
      timeout: AI_CONFIG.TIMEOUT_MS,
    });
    
    const interpretation = completion.choices[0]?.message?.content;
    const tokensUsed = completion.usage?.total_tokens ?? 0;
    
    if (!interpretation) {
      throw new Error('No interpretation generated');
    }
    
    // Cultural sensitivity validation
    validateCulturalContent(interpretation);
    
    return {
      interpretation: interpretation.trim(),
      tokensUsed,
    };
  } catch (error) {
    console.error('AI interpretation failed:', error);
    
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        throw new Error('Service temporarily unavailable. Please try again in a moment.');
      }
      if (error.status === 401) {
        throw new Error('Authentication error. Please contact support.');
      }
    }
    
    throw new Error('Failed to generate AI interpretation. Please try again.');
  }
}

function validateCulturalContent(content: string): void {
  // Basic validation for cultural sensitivity
  const problematicTerms = ['fortune', 'predict the future', 'guaranteed outcome'];
  
  for (const term of problematicTerms) {
    if (content.toLowerCase().includes(term)) {
      console.warn(`Potentially problematic content detected: ${term}`);
      // Could trigger additional review or fallback
    }
  }
}
```

---

## 7. Styling Standards

### 7.1 Tailwind CSS Conventions

**Class Organization**
```typescript
// ✅ Good - Organized by property type
<div className={cn(
  // Layout
  'relative flex flex-col items-center',
  // Spacing
  'px-6 py-8 gap-4',
  // Appearance
  'bg-cloud-white rounded-3xl shadow-water-shadow',
  // State
  'hover:shadow-floating-shadow transition-all duration-300',
  // Responsive
  'sm:px-8 md:py-12',
  // Conditional
  isActive && 'ring-2 ring-flowing-water',
  className
)}`}>

// ❌ Bad - Random order
<div className="bg-white p-4 hover:shadow-lg flex rounded transition-all relative items-center">
```

**Custom CSS Classes**
```css
/* styles/components/wisdom-card.css */
.wisdom-card {
  @apply relative overflow-hidden rounded-3xl bg-cloud-white p-6 shadow-water-shadow transition-all duration-300;
}

.wisdom-card::before {
  @apply absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-flowing-water via-bamboo-green to-sunset-gold opacity-0 transition-opacity duration-300;
  content: '';
}

.wisdom-card:hover::before {
  @apply opacity-100;
}

.wisdom-card:hover {
  @apply -translate-y-2 shadow-floating-shadow;
}
```

### 7.2 Design Token Usage

**CSS Custom Properties**
```css
/* Use design tokens from the design system */
:root {
  --mountain-stone: #4a5c6a;
  --flowing-water: #6b8caf;
  --bamboo-green: #7ba05b;
  /* ... other tokens */
}

/* Component styles using tokens */
.consultation-form {
  color: var(--mountain-stone);
  background: linear-gradient(135deg, var(--morning-mist), var(--cloud-white));
}
```

### 7.3 Responsive Design Patterns

**Mobile-First Approach**
```typescript
// ✅ Good - Mobile-first with progressive enhancement
<div className={cn(
  // Mobile (default)
  'grid grid-cols-1 gap-4 p-4',
  // Tablet
  'sm:grid-cols-2 sm:gap-6 sm:p-6',
  // Desktop
  'lg:grid-cols-3 lg:gap-8 lg:p-8',
  // Large desktop
  'xl:max-w-7xl xl:mx-auto'
)}>

// Container queries where supported
<div className="@container">
  <div className="@sm:grid-cols-2 @lg:grid-cols-3">
    {/* Content */}
  </div>
</div>
```

---

## 8. API Route Standards

### 8.1 Route Structure

**API Route Organization**
```typescript
// app/api/consultation/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateAIInterpretation } from '@/lib/ai/interpretations';
import { generateHexagram } from '@/lib/i-ching/hexagram-generator';
import { validateConsultationRequest } from '@/lib/validation/consultation';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    // Parse and validate request
    const body = await request.json();
    const validationResult = validateConsultationRequest(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.errors },
        { status: 400 }
      );
    }
    
    const { question, category } = validationResult.data;
    
    // Generate hexagram
    const hexagram = generateHexagram();
    
    // Generate AI interpretation
    const { interpretation, tokensUsed } = await generateAIInterpretation(
      question,
      hexagram,
      category
    );
    
    // Save to database
    const consultation = await createConsultation({
      userId: user.id,
      question,
      category,
      hexagram,
      interpretations: {
        traditional: hexagram.meaning,
        ai: interpretation,
        practical: generatePracticalGuidance(hexagram, question),
      },
    });
    
    // Log usage for billing
    await logAIUsage(user.id, tokensUsed);
    
    return NextResponse.json(consultation);
    
  } catch (error) {
    console.error('Consultation creation failed:', error);
    
    // Return appropriate error response
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Invalid input', message: error.message },
        { status: 400 }
      );
    }
    
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Please try again later' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
```

### 8.2 Input Validation

**Request Validation**
```typescript
// lib/validation/consultation.ts
import { z } from 'zod';

const consultationSchema = z.object({
  question: z
    .string()
    .min(10, 'Question must be at least 10 characters')
    .max(500, 'Question must not exceed 500 characters')
    .refine(
      (q) => q.trim().split(/\s+/).length >= 3,
      'Question must contain at least 3 words for meaningful guidance'
    ),
  category: z.enum(['general', 'career', 'relationships', 'health', 'spiritual', 'decision']),
});

export function validateConsultationRequest(data: unknown) {
  const result = consultationSchema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
}
```

### 8.3 Error Handling

**Standardized Error Responses**
```typescript
// lib/api/errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, public errors: any[]) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

export function handleAPIError(error: unknown): NextResponse {
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.code || 'API_ERROR',
        message: error.message,
        ...(error instanceof ValidationError && { errors: error.errors }),
      },
      { status: error.statusCode }
    );
  }
  
  console.error('Unhandled API error:', error);
  
  return NextResponse.json(
    {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}
```

---

## 9. Error Handling Standards

### 9.1 Error Boundaries

**React Error Boundary**
```typescript
// components/error/ErrorBoundary.tsx
'use client';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report to monitoring service
    if (typeof window !== 'undefined') {
      // Sentry or similar
      reportError(error, errorInfo);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary p-6 text-center">
          <h2 className="text-xl font-semibold text-mountain-stone mb-4">
            Something went wrong
          </h2>
          <p className="text-soft-gray mb-6">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
          >
            Refresh Page
          </Button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

function reportError(error: Error, errorInfo: ErrorInfo) {
  // Implementation for error reporting
  console.error('Reporting error:', { error, errorInfo });
}
```

### 9.2 Toast Notifications

**User-Friendly Error Messages**
```typescript
// lib/notifications/toast.ts
import { toast } from 'sonner';

export const notifications = {
  error: {
    consultation: (error?: string) => {
      toast.error('Unable to generate consultation', {
        description: error || 'Please check your connection and try again.',
        action: {
          label: 'Retry',
          onClick: () => window.location.reload(),
        },
      });
    },
    
    auth: (error?: string) => {
      toast.error('Authentication failed', {
        description: error || 'Please check your credentials and try again.',
      });
    },
    
    network: () => {
      toast.error('Connection issue', {
        description: 'Please check your internet connection.',
      });
    },
  },
  
  success: {
    consultation: () => {
      toast.success('Consultation generated', {
        description: 'Your I Ching guidance is ready.',
      });
    },
    
    saved: () => {
      toast.success('Saved successfully', {
        description: 'Your changes have been saved.',
      });
    },
  },
};
```

---

## 10. Performance Standards

### 10.1 Core Web Vitals Targets

**Performance Metrics**
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **First Input Delay (FID):** < 100 milliseconds
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 3.5 seconds

### 10.2 Code Splitting

**Dynamic Imports**
```typescript
// ✅ Good - Lazy load heavy components
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const HexagramVisualizer = dynamic(
  () => import('@/components/consultation/HexagramVisualizer'),
  {
    loading: () => <HexagramSkeleton />,
    ssr: false, // Client-side only for animations
  }
);

const AIInterpretationGenerator = dynamic(
  () => import('@/components/ai/InterpretationGenerator'),
  {
    loading: () => <div>Generating wisdom...</div>,
  }
);

export default function ConsultationPage() {
  return (
    <main>
      <Suspense fallback={<ConsultationSkeleton />}>
        <HexagramVisualizer />
        <AIInterpretationGenerator />
      </Suspense>
    </main>
  );
}
```

### 10.3 Image Optimization

**Next.js Image Usage**
```typescript
import Image from 'next/image';

// ✅ Good - Optimized images
<Image
  src="/images/i-ching-symbols.svg"
  alt="I Ching trigram symbols representing the eight natural forces"
  width={400}
  height={300}
  priority={true} // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..."
  className="rounded-lg"
/>

// For dynamic images
<Image
  src={hexagram.imageUrl}
  alt={`Hexagram ${hexagram.number}: ${hexagram.name}`}
  width={200}
  height={200}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

---

## 11. Security Standards

### 11.1 Environment Variables

**Security Configuration**
```typescript
// lib/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

### 11.2 Input Sanitization

**Content Security**
```typescript
// lib/security/sanitization.ts
import DOMPurify from 'dompurify';

export function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return dirty.replace(/<[^>]*>/g, '');
  }
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeQuestion(question: string): string {
  return question
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS
    .substring(0, 500); // Limit length
}
```

### 11.3 Rate Limiting

**API Protection**
```typescript
// lib/security/rate-limit.ts
import { NextRequest } from 'next/server';

interface RateLimitOptions {
  interval: number; // milliseconds
  requests: number;
}

export function createRateLimit({ interval, requests }: RateLimitOptions) {
  const cache = new Map<string, { count: number; resetTime: number }>();
  
  return function rateLimit(request: NextRequest): boolean {
    const ip = request.ip ?? 'anonymous';
    const now = Date.now();
    const key = `${ip}:${interval}`;
    
    const record = cache.get(key);
    
    if (!record || now > record.resetTime) {
      cache.set(key, { count: 1, resetTime: now + interval });
      return true;
    }
    
    if (record.count >= requests) {
      return false;
    }
    
    record.count++;
    return true;
  };
}

// Usage in API routes
const consultationRateLimit = createRateLimit({
  interval: 60 * 1000, // 1 minute
  requests: 10, // 10 consultations per minute
});

export async function POST(request: NextRequest) {
  if (!consultationRateLimit(request)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // Continue with request handling
}
```

---

## 12. Cultural Sensitivity Standards

### 12.1 Content Guidelines

**Respectful Representation**
```typescript
// lib/i-ching/cultural-validation.ts
export interface CulturalGuidelines {
  // Traditional Chinese characters must be accurate
  validateChineseCharacters(text: string): boolean;
  
  // Interpretations must respect traditional meanings
  validateInterpretation(interpretation: string): boolean;
  
  // Avoid fortune-telling language
  avoidDivinationClaims(content: string): boolean;
}

export const culturalValidator: CulturalGuidelines = {
  validateChineseCharacters(text: string): boolean {
    // Validate against known I Ching characters
    const validCharacters = /^[\u4e00-\u9fff\s\(\)\-]+$/;
    return validCharacters.test(text);
  },
  
  validateInterpretation(interpretation: string): boolean {
    // Check for problematic fortune-telling language
    const problematicTerms = [
      'will definitely',
      'guaranteed to happen',
      'your future will be',
      'you will definitely',
    ];
    
    return !problematicTerms.some(term => 
      interpretation.toLowerCase().includes(term)
    );
  },
  
  avoidDivinationClaims(content: string): boolean {
    const divinationWords = ['predict', 'foretell', 'prophesy'];
    return !divinationWords.some(word => 
      content.toLowerCase().includes(word)
    );
  },
};
```

### 12.2 Attribution Standards

**Cultural Attribution**
```typescript
// components/cultural/Attribution.tsx
export function CulturalAttribution() {
  return (
    <footer className="cultural-attribution mt-12 p-6 bg-morning-mist rounded-lg">
      <p className="text-sm text-soft-gray text-center">
        The I Ching (易經) is an ancient Chinese divination text and among the oldest 
        of the Chinese classics. We honor this 5,000-year-old tradition with respect 
        and authenticity, guided by traditional scholars and practitioners.
      </p>
      
      <div className="mt-4 text-center">
        <a 
          href="/cultural-acknowledgments" 
          className="text-flowing-water hover:underline"
        >
          Cultural Acknowledgments & Sources
        </a>
      </div>
    </footer>
  );
}
```

---

## 13. Accessibility Standards

### 13.1 Semantic HTML

**Proper Structure**
```typescript
// ✅ Good - Semantic structure
export function ConsultationInterface() {
  return (
    <main>
      <header>
        <h1>I Ching Consultation</h1>
        <p>Seek ancient wisdom for modern decisions</p>
      </header>
      
      <section aria-labelledby="question-heading">
        <h2 id="question-heading">Your Question</h2>
        <form role="form" aria-label="Consultation form">
          <label htmlFor="question-input">
            What guidance do you seek?
            <span className="text-sm text-soft-gray block mt-1">
              Ask a specific question for clearer wisdom
            </span>
          </label>
          <textarea 
            id="question-input"
            aria-describedby="question-help"
            required
          />
          <div id="question-help" className="sr-only">
            Your question should be thoughtful and specific for better guidance
          </div>
        </form>
      </section>
      
      <section aria-labelledby="hexagram-heading">
        <h2 id="hexagram-heading">Your Hexagram</h2>
        <div 
          role="img" 
          aria-label="Hexagram 11: Peace - Earth above Heaven"
          className="hexagram-display"
        >
          {/* Hexagram visualization */}
        </div>
      </section>
    </main>
  );
}
```

### 13.2 ARIA Implementation

**Screen Reader Support**
```typescript
// components/hexagram/HexagramDisplay.tsx
interface HexagramDisplayProps {
  hexagram: Hexagram;
  isAnimating?: boolean;
}

export function HexagramDisplay({ hexagram, isAnimating }: HexagramDisplayProps) {
  return (
    <div 
      className="hexagram-container"
      role="img"
      aria-label={`Hexagram ${hexagram.number}: ${hexagram.name}. ${hexagram.meaning}`}
      aria-describedby={`hexagram-${hexagram.number}-description`}
    >
      <div className="hexagram-lines" aria-hidden="true">
        {hexagram.lines.map((line, index) => (
          <div
            key={index}
            className={cn(
              'hexagram-line',
              line.type === 'yin' && 'broken',
              line.changing && 'changing'
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      
      <div 
        id={`hexagram-${hexagram.number}-description`} 
        className="sr-only"
      >
        This hexagram consists of {hexagram.lines.length} lines representing 
        {hexagram.upperTrigram.name} above {hexagram.lowerTrigram.name}.
        Traditional meaning: {hexagram.meaning}
      </div>
      
      {isAnimating && (
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Generating your hexagram guidance...
        </div>
      )}
    </div>
  );
}
```

### 13.3 Keyboard Navigation

**Focus Management**
```typescript
// hooks/use-focus-management.ts
import { useRef, useEffect } from 'react';

export function useFocusManagement(isVisible: boolean) {
  const firstFocusableRef = useRef<HTMLElement>(null);
  const lastFocusableRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (isVisible && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isVisible]);
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstFocusableRef.current) {
        event.preventDefault();
        lastFocusableRef.current?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableRef.current) {
        event.preventDefault();
        firstFocusableRef.current?.focus();
      }
    }
    
    if (event.key === 'Escape') {
      // Handle escape key
      onClose?.();
    }
  };
  
  return {
    firstFocusableRef,
    lastFocusableRef,
    handleKeyDown,
  };
}
```

---

## 14. Code Organization

### 14.1 Directory Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Route groups
│   ├── api/                   # API routes
│   ├── consultation/          # Feature pages
│   └── globals.css           # Global styles
├── components/                # React components
│   ├── ui/                   # Base UI components
│   ├── consultation/         # Feature components
│   ├── navigation/           # Navigation components
│   └── cultural/             # Cultural components
├── lib/                      # Utilities and integrations
│   ├── supabase/            # Database client
│   ├── ai/                  # OpenAI integration
│   ├── i-ching/             # I Ching logic
│   ├── auth/                # Authentication
│   ├── validation/          # Input validation
│   └── utils/               # Utility functions
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
├── styles/                  # CSS files
└── constants/               # App constants
```

### 14.2 Import Organization

**Import Order**
```typescript
// 1. React and Next.js imports
import React, { useState, useEffect } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import dynamic from 'next/dynamic';

// 2. Third-party libraries
import { clsx } from 'clsx';
import { toast } from 'sonner';

// 3. Internal utilities and hooks
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils/classnames';

// 4. Internal components
import { Button } from '@/components/ui/Button';
import { WisdomCard } from '@/components/consultation/WisdomCard';

// 5. Types
import type { Hexagram, Consultation } from '@/types/i-ching';
```

---

## 15. Git Workflow

### 15.1 Commit Standards

**Conventional Commits**
```bash
# Format: type(scope): description

# Types:
feat(consultation): add AI interpretation generation
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(ui): improve button hover animations
refactor(api): simplify consultation route logic
test(hooks): add tests for useConsultation hook
chore(deps): update Next.js to 14.1.0

# Breaking changes:
feat(api)!: change consultation response format

# Examples:
git commit -m "feat(i-ching): implement hexagram generation logic"
git commit -m "fix(ui): resolve mobile navigation overflow"
git commit -m "docs(contributing): add cultural sensitivity guidelines"
```

### 15.2 Branch Strategy

**Git Flow**
```bash
# Main branches
main                    # Production ready code
develop                 # Development integration

# Feature branches
feature/consultation-ui # New features
feature/ai-integration  # AI improvements
fix/auth-redirect      # Bug fixes
hotfix/security-patch  # Critical fixes

# Branch naming convention
feature/[feature-name]
fix/[issue-description]
hotfix/[critical-fix]
docs/[documentation-update]
```

### 15.3 Code Review Checklist

**Review Requirements**
- [ ] **Cultural Sensitivity**: I Ching content is respectful and accurate
- [ ] **Accessibility**: WCAG 2.1 AA compliance verified
- [ ] **Performance**: No unnecessary re-renders or heavy computations
- [ ] **TypeScript**: Strong typing, no `any` types
- [ ] **Security**: Input validation, no XSS vulnerabilities
- [ ] **Testing**: Critical paths have test coverage
- [ ] **Documentation**: Complex logic is well-commented
- [ ] **Error Handling**: Graceful error states and user feedback

---

## Conclusion

These coding standards ensure that Sage maintains high quality, cultural authenticity, and accessibility while leveraging modern web technologies effectively. The standards prioritize:

1. **Cultural Respect**: Authentic representation of I Ching wisdom
2. **User Experience**: Accessibility and performance first
3. **Maintainability**: Clear, typed, and well-organized code
4. **Scalability**: Patterns that grow with the application
5. **Developer Experience**: Tooling and conventions that enhance productivity

By following these standards, we create a codebase that honors ancient wisdom while embracing modern development practices.

---

**Document Status:** Active  
**Last Updated:** July 30, 2025  
**Next Review:** Monthly  
**Maintained By:** Development Team