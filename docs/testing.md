# Sage Testing Standards
## Comprehensive Testing Strategy for I Ching Guidance App

**Version:** 1.0  
**Date:** July 30, 2025  
**Stack:** Next.js 14, TypeScript, Supabase, OpenAI, Tailwind CSS  
**Philosophy:** Cultural accuracy, accessibility compliance, user-centric testing  

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Testing Pyramid Strategy](#2-testing-pyramid-strategy)
3. [Unit Testing Standards](#3-unit-testing-standards)
4. [Component Testing Standards](#4-component-testing-standards)
5. [Integration Testing Standards](#5-integration-testing-standards)
6. [End-to-End Testing Standards](#6-end-to-end-testing-standards)
7. [API Testing Standards](#7-api-testing-standards)
8. [Cultural Accuracy Testing](#8-cultural-accuracy-testing)
9. [Accessibility Testing Standards](#9-accessibility-testing-standards)
10. [Performance Testing Standards](#10-performance-testing-standards)
11. [Security Testing Standards](#11-security-testing-standards)
12. [AI Integration Testing](#12-ai-integration-testing)
13. [Database Testing Standards](#13-database-testing-standards)
14. [Visual Regression Testing](#14-visual-regression-testing)
15. [Testing Tools & Setup](#15-testing-tools--setup)
16. [CI/CD Testing Pipeline](#16-cicd-testing-pipeline)
17. [Testing Metrics & Coverage](#17-testing-metrics--coverage)

---

## 1. Testing Philosophy

### 1.1 Core Testing Principles

**Wu Wei (無為) - Effortless Testing**
- Tests should be simple, clear, and maintainable
- Favor readable test names over comments
- Test behavior, not implementation details
- Automate repetitive validation processes

**Cultural Integrity Testing**
- Every I Ching interpretation must be culturally validated
- Chinese characters and terminology accuracy is non-negotiable
- Spiritual guidance content requires expert review
- Respect for ancient wisdom traditions in all test scenarios

**User-Centric Approach**
- Test real user workflows, not isolated functions
- Accessibility testing is mandatory for all components
- Performance impacts user experience and must be tested
- Error states should provide helpful, calming guidance

### 1.2 Testing Quality Gates

Before any feature ships:
- [ ] **Cultural Accuracy**: I Ching content validated by expert
- [ ] **Accessibility**: WCAG 2.1 AA compliance verified
- [ ] **Performance**: Core Web Vitals meet targets
- [ ] **Security**: No vulnerabilities in authentication or AI integration
- [ ] **User Experience**: End-to-end user journeys work flawlessly

---

## 2. Testing Pyramid Strategy

### 2.1 Testing Distribution

```
                    🔺 E2E Tests (10%)
                   /   \  Critical user journeys
                  /     \  Cross-browser validation
                 /       \  Performance monitoring
                /         \
               /           \
              🔳 Integration (20%)
             /  \  API contracts
            /    \  Database operations  
           /      \  External service mocks
          /        \  Authentication flows
         /          \
        /            \
       🔳 Component (30%)
      /  \  User interactions
     /    \  State management
    /      \  Props validation
   /        \  Accessibility
  /          \
 /            \
🔳 Unit Tests (40%)
  Business logic
  Utility functions
  I Ching calculations
  Data transformations
```

### 2.2 Test Confidence Levels

**High Confidence (E2E)**: Complete user workflows
- User creates account → completes first consultation → receives guidance
- Daily guidance generation → notification → user interaction
- Premium subscription → advanced features → billing integration

**Medium Confidence (Integration)**: Service interactions
- Supabase authentication flow
- OpenAI API integration with error handling
- Database operations with real data
- Calendar integration with external providers

**Fast Feedback (Unit/Component)**: Individual pieces
- Hexagram generation algorithm accuracy
- AI prompt construction logic
- Component rendering and interactions
- Utility function edge cases

---

## 3. Unit Testing Standards

### 3.1 I Ching Business Logic Testing

**Hexagram Generation Testing**
```typescript
// __tests__/lib/i-ching/hexagram-generator.test.ts
import { generateHexagram, calculateHexagramNumber, castCoin } from '@/lib/i-ching/hexagram-generator';
import { HEXAGRAMS_DB } from '@/lib/i-ching/hexagrams-data';

describe('Hexagram Generation', () => {
  describe('castCoin', () => {
    it('should return yang (3) or yin (2) values only', () => {
      // Run multiple times to test randomness
      for (let i = 0; i < 100; i++) {
        const result = castCoin();
        expect([2, 3]).toContain(result);
      }
    });

    it('should produce roughly equal distribution over many casts', () => {
      const results = Array.from({ length: 1000 }, () => castCoin());
      const yangCount = results.filter(r => r === 3).length;
      const yinCount = results.filter(r => r === 2).length;
      
      // Allow for variance in randomness (40-60% distribution)
      expect(yangCount).toBeGreaterThan(400);
      expect(yangCount).toBeLessThan(600);
      expect(yinCount).toBeGreaterThan(400);
      expect(yinCount).toBeLessThan(600);
    });
  });

  describe('calculateHexagramNumber', () => {
    it('should correctly calculate hexagram 1 (Heaven)', () => {
      const allYangLines = [3, 3, 3, 3, 3, 3];
      expect(calculateHexagramNumber(allYangLines)).toBe(1);
    });

    it('should correctly calculate hexagram 2 (Earth)', () => {
      const allYinLines = [2, 2, 2, 2, 2, 2];
      expect(calculateHexagramNumber(allYinLines)).toBe(2);
    });

    it('should correctly calculate hexagram 11 (Peace)', () => {
      // Earth above Heaven: yin, yin, yin, yang, yang, yang
      const peaceLines = [2, 2, 2, 3, 3, 3];
      expect(calculateHexagramNumber(peaceLines)).toBe(11);
    });

    it('should handle changing lines correctly', () => {
      // Old yang (9) becomes yin, old yin (6) becomes yang
      const changingLines = [6, 7, 8, 9, 6, 9]; // 6=old yin, 9=old yang
      const hexagramNumber = calculateHexagramNumber(changingLines);
      
      expect(hexagramNumber).toBeGreaterThanOrEqual(1);
      expect(hexagramNumber).toBeLessThanOrEqual(64);
    });
  });

  describe('generateHexagram', () => {
    it('should return valid hexagram with all required properties', () => {
      const hexagram = generateHexagram();
      
      expect(hexagram).toHaveProperty('number');
      expect(hexagram).toHaveProperty('name');
      expect(hexagram).toHaveProperty('chinese');
      expect(hexagram).toHaveProperty('lines');
      expect(hexagram).toHaveProperty('changingLines');
      
      expect(hexagram.number).toBeGreaterThanOrEqual(1);
      expect(hexagram.number).toBeLessThanOrEqual(64);
      expect(hexagram.lines).toHaveLength(6);
      expect(Array.isArray(hexagram.changingLines)).toBe(true);
    });

    it('should return hexagram data from database', () => {
      const hexagram = generateHexagram();
      const dbHexagram = HEXAGRAMS_DB[hexagram.number - 1];
      
      expect(hexagram.name).toBe(dbHexagram.name);
      expect(hexagram.chinese).toBe(dbHexagram.chinese);
      expect(hexagram.meaning).toBe(dbHexagram.meaning);
    });
  });
});
```

**Consultation Logic Testing**
```typescript
// __tests__/lib/consultation/consultation-service.test.ts
import { validateQuestion, categorizeQuestion, generateConsultationContext } from '@/lib/consultation/consultation-service';

describe('Consultation Service', () => {
  describe('validateQuestion', () => {
    it('should accept valid thoughtful questions', () => {
      const validQuestions = [
        'Should I accept the new job offer in Seattle?',
        'How can I improve my relationship with my partner?',
        'What is the best approach for starting my own business?',
        'How should I handle the conflict with my colleague?'
      ];

      validQuestions.forEach(question => {
        expect(validateQuestion(question)).toEqual({
          isValid: true,
          errors: []
        });
      });
    });

    it('should reject questions that are too short', () => {
      const shortQuestions = ['Yes?', 'Help', 'What?'];

      shortQuestions.forEach(question => {
        const result = validateQuestion(question);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Question must be at least 10 characters');
      });
    });

    it('should reject fortune-telling style questions', () => {
      const fortuneQuestions = [
        'Will I win the lottery tomorrow?',
        'When will I meet my soulmate?',
        'Will my ex come back to me?'
      ];

      fortuneQuestions.forEach(question => {
        const result = validateQuestion(question);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Please focus on guidance rather than predictions');
      });
    });
  });

  describe('categorizeQuestion', () => {
    it('should correctly categorize career questions', () => {
      const careerQuestions = [
        'Should I quit my job?',
        'How can I advance in my career?',
        'What skills should I develop professionally?'
      ];

      careerQuestions.forEach(question => {
        expect(categorizeQuestion(question)).toBe('career');
      });
    });

    it('should correctly categorize relationship questions', () => {
      const relationshipQuestions = [
        'How can I improve communication with my partner?',
        'Should I forgive my friend?',
        'How do I handle family conflict?'
      ];

      relationshipQuestions.forEach(question => {
        expect(categorizeQuestion(question)).toBe('relationships');
      });
    });

    it('should default to general for unclear questions', () => {
      const generalQuestions = [
        'What should I focus on today?',
        'How can I find more balance?',
        'What direction should I take?'
      ];

      generalQuestions.forEach(question => {
        expect(categorizeQuestion(question)).toBe('general');
      });
    });
  });
});
```

### 3.2 Utility Function Testing

**String and Validation Utilities**
```typescript
// __tests__/lib/utils/validation.test.ts
import { 
  sanitizeQuestion, 
  validateChineseCharacters, 
  formatHexagramName,
  isValidEmail
} from '@/lib/utils/validation';

describe('Validation Utilities', () => {
  describe('sanitizeQuestion', () => {
    it('should remove HTML tags', () => {
      const input = 'Should I <script>alert("xss")</script> accept this job?';
      const expected = 'Should I  accept this job?';
      expect(sanitizeQuestion(input)).toBe(expected);
    });

    it('should trim whitespace', () => {
      expect(sanitizeQuestion('  How should I proceed?  ')).toBe('How should I proceed?');
    });

    it('should limit length to 500 characters', () => {
      const longQuestion = 'a'.repeat(600);
      expect(sanitizeQuestion(longQuestion)).toHaveLength(500);
    });
  });

  describe('validateChineseCharacters', () => {
    it('should accept valid I Ching characters', () => {
      const validCharacters = ['乾', '坤', '震', '巽', '坎', '離', '艮', '兌'];
      validCharacters.forEach(char => {
        expect(validateChineseCharacters(char)).toBe(true);
      });
    });

    it('should accept hexagram names with parentheses', () => {
      expect(validateChineseCharacters('乾 (Qián)')).toBe(true);
      expect(validateChineseCharacters('坤 (Kūn)')).toBe(true);
    });

    it('should reject invalid characters', () => {
      expect(validateChineseCharacters('invalid')).toBe(false);
      expect(validateChineseCharacters('乾<script>')).toBe(false);
    });
  });
});
```

### 3.3 AI Integration Unit Testing

**Prompt Generation Testing**
```typescript
// __tests__/lib/ai/prompts.test.ts
import { createInterpretationPrompt, createDailyGuidancePrompt } from '@/lib/ai/prompts';
import { HEXAGRAMS_DB } from '@/lib/i-ching/hexagrams-data';

describe('AI Prompt Generation', () => {
  const sampleHexagram = HEXAGRAMS_DB[0]; // Hexagram 1: Heaven

  describe('createInterpretationPrompt', () => {
    it('should include question and hexagram information', () => {
      const question = 'Should I start a new business?';
      const category = 'career';
      
      const prompt = createInterpretationPrompt(question, sampleHexagram, category);
      
      expect(prompt).toContain(question);
      expect(prompt).toContain(sampleHexagram.name);
      expect(prompt).toContain(sampleHexagram.chinese);
      expect(prompt).toContain(category);
    });

    it('should include cultural authenticity guidelines', () => {
      const prompt = createInterpretationPrompt(
        'Test question', 
        sampleHexagram, 
        'general'
      );
      
      expect(prompt).toContain('cultural authenticity');
      expect(prompt).toContain('traditional I Ching wisdom');
      expect(prompt).toContain('respectful');
    });

    it('should include user context when provided', () => {
      const userContext = 'User is a software developer with 5 years experience';
      const prompt = createInterpretationPrompt(
        'Career guidance?',
        sampleHexagram,
        'career',
        userContext
      );
      
      expect(prompt).toContain(userContext);
    });

    it('should avoid fortune-telling language in guidelines', () => {
      const prompt = createInterpretationPrompt(
        'Test question',
        sampleHexagram,
        'general'
      );
      
      expect(prompt).toContain('Avoid fortune-telling');
      expect(prompt).toContain('focus on wisdom and reflection');
    });
  });
});
```

---

## 4. Component Testing Standards

### 4.1 React Component Testing Setup

**Testing Library Configuration**
```typescript
// __tests__/setup/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { Toaster } from 'sonner';

// Mock Supabase client for tests
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### 4.2 UI Component Testing

**Button Component Testing**
```typescript
// __tests__/components/ui/Button.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Cast Hexagram</Button>);
    expect(screen.getByRole('button', { name: 'Cast Hexagram' })).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  it('should be disabled when loading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show loading state', () => {
    render(<Button isLoading>Generate Wisdom</Button>);
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });

  it('should meet accessibility standards', () => {
    render(<Button variant="primary">Primary Action</Button>);
    const button = screen.getByRole('button');
    
    // Should be focusable
    expect(button).not.toHaveAttribute('tabindex', '-1');
    
    // Should have appropriate ARIA attributes
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should support keyboard navigation', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Keyboard Test</Button>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    // Enter key should trigger click
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
    
    // Space key should trigger click
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
```

**Hexagram Display Component Testing**
```typescript
// __tests__/components/consultation/HexagramDisplay.test.tsx
import { render, screen } from '@/test-utils';
import { HexagramDisplay } from '@/components/consultation/HexagramDisplay';
import { HEXAGRAMS_DB } from '@/lib/i-ching/hexagrams-data';

describe('HexagramDisplay Component', () => {
  const sampleHexagram = {
    ...HEXAGRAMS_DB[0], // Heaven
    lines: [
      { position: 1, type: 'yang', changing: false, interpretation: 'test' },
      { position: 2, type: 'yang', changing: false, interpretation: 'test' },
      { position: 3, type: 'yang', changing: true, interpretation: 'test' },
      { position: 4, type: 'yang', changing: false, interpretation: 'test' },
      { position: 5, type: 'yang', changing: false, interpretation: 'test' },
      { position: 6, type: 'yang', changing: false, interpretation: 'test' },
    ]
  };

  it('should render hexagram with correct name and number', () => {
    render(<HexagramDisplay hexagram={sampleHexagram} />);
    
    expect(screen.getByText('Hexagram 1')).toBeInTheDocument();
    expect(screen.getByText('Heaven')).toBeInTheDocument();
    expect(screen.getByText('乾')).toBeInTheDocument();
  });

  it('should display correct number of lines', () => {
    render(<HexagramDisplay hexagram={sampleHexagram} />);
    
    const lines = screen.getAllByTestId(/hexagram-line-/);
    expect(lines).toHaveLength(6);
  });

  it('should mark changing lines correctly', () => {
    render(<HexagramDisplay hexagram={sampleHexagram} />);
    
    const changingLine = screen.getByTestId('hexagram-line-3');
    expect(changingLine).toHaveClass('changing');
  });

  it('should provide proper accessibility labels', () => {
    render(<HexagramDisplay hexagram={sampleHexagram} />);
    
    const hexagramImage = screen.getByRole('img');
    expect(hexagramImage).toHaveAccessibleName(/Hexagram 1.*Heaven/);
  });

  it('should handle animation state', () => {
    render(<HexagramDisplay hexagram={sampleHexagram} isAnimating />);
    
    expect(screen.getByText(/Generating your hexagram/)).toBeInTheDocument();
  });

  it('should display hexagram meaning', () => {
    render(<HexagramDisplay hexagram={sampleHexagram} showMeaning />);
    
    expect(screen.getByText(sampleHexagram.meaning)).toBeInTheDocument();
  });
});
```

### 4.3 Form Component Testing

**Consultation Form Testing**
```typescript
// __tests__/components/consultation/ConsultationForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { ConsultationForm } from '@/components/consultation/ConsultationForm';
import userEvent from '@testing-library/user-event';

describe('ConsultationForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render form fields correctly', () => {
    render(<ConsultationForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/your question/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate consultation/i })).toBeInTheDocument();
  });

  it('should validate question length', async () => {
    const user = userEvent.setup();
    render(<ConsultationForm onSubmit={mockOnSubmit} />);
    
    const questionField = screen.getByLabelText(/your question/i);
    const submitButton = screen.getByRole('button', { name: /generate consultation/i });
    
    // Enter too short question
    await user.type(questionField, 'Help?');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please provide a more detailed question/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form data', async () => {
    const user = userEvent.setup();
    render(<ConsultationForm onSubmit={mockOnSubmit} />);
    
    const questionField = screen.getByLabelText(/your question/i);
    const categorySelect = screen.getByLabelText(/category/i);
    const submitButton = screen.getByRole('button', { name: /generate consultation/i });
    
    await user.type(questionField, 'Should I accept the new job opportunity in San Francisco?');
    await user.selectOptions(categorySelect, 'career');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        question: 'Should I accept the new job opportunity in San Francisco?',
        category: 'career'
      });
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(<ConsultationForm onSubmit={slowSubmit} />);
    
    const questionField = screen.getByLabelText(/your question/i);
    const submitButton = screen.getByRole('button', { name: /generate consultation/i });
    
    await user.type(questionField, 'What should I do about my career?');
    await user.click(submitButton);
    
    expect(screen.getByText(/generating wisdom/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should handle submission errors gracefully', async () => {
    const user = userEvent.setup();
    const failingSubmit = jest.fn(() => Promise.reject(new Error('Network error')));
    
    render(<ConsultationForm onSubmit={failingSubmit} />);
    
    const questionField = screen.getByLabelText(/your question/i);
    const submitButton = screen.getByRole('button', { name: /generate consultation/i });
    
    await user.type(questionField, 'What guidance do you have for me?');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to generate consultation/i)).toBeInTheDocument();
    });
  });

  it('should meet accessibility requirements', () => {
    render(<ConsultationForm onSubmit={mockOnSubmit} />);
    
    const form = screen.getByRole('form');
    expect(form).toHaveAccessibleName();
    
    const questionField = screen.getByLabelText(/your question/i);
    expect(questionField).toHaveAttribute('aria-describedby');
    expect(questionField).toBeRequired();
  });
});
```

---

## 5. Integration Testing Standards

### 5.1 Supabase Integration Testing

**Database Operations Testing**
```typescript
// __tests__/integration/supabase/consultations.test.ts
import { createTestSupabase, cleanupTestData } from '@/test-utils/supabase-test-utils';
import { createConsultation, getUserConsultations } from '@/lib/supabase/consultations';
import { HEXAGRAMS_DB } from '@/lib/i-ching/hexagrams-data';

describe('Consultation Database Integration', () => {
  const testUserId = 'test-user-id';
  let supabase: any;

  beforeAll(async () => {
    supabase = createTestSupabase();
  });

  afterEach(async () => {
    await cleanupTestData(supabase, testUserId);
  });

  it('should create and retrieve consultation', async () => {
    const consultationData = {
      userId: testUserId,
      question: 'Should I pursue this new opportunity?',
      category: 'career' as const,
      hexagram: HEXAGRAMS_DB[0],
      interpretations: {
        traditional: 'Traditional interpretation',
        ai: 'AI-generated interpretation',
        practical: 'Practical guidance'
      }
    };

    // Create consultation
    const created = await createConsultation(consultationData);
    
    expect(created).toHaveProperty('id');
    expect(created.question).toBe(consultationData.question);
    expect(created.category).toBe(consultationData.category);
    expect(created.userId).toBe(testUserId);

    // Retrieve consultation
    const consultations = await getUserConsultations(testUserId);
    
    expect(consultations).toHaveLength(1);
    expect(consultations[0].id).toBe(created.id);
  });

  it('should handle database constraints', async () => {
    const invalidData = {
      userId: '', // Invalid: empty user ID
      question: 'Test question',
      category: 'general' as const,
      hexagram: HEXAGRAMS_DB[0],
      interpretations: {
        traditional: 'test',
        ai: 'test',
        practical: 'test'
      }
    };

    await expect(createConsultation(invalidData)).rejects.toThrow();
  });

  it('should order consultations by creation date', async () => {
    // Create multiple consultations with slight delays
    const consultation1 = await createConsultation({
      userId: testUserId,
      question: 'First question',
      category: 'general' as const,
      hexagram: HEXAGRAMS_DB[0],
      interpretations: { traditional: 't', ai: 'a', practical: 'p' }
    });

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 100));

    const consultation2 = await createConsultation({
      userId: testUserId,
      question: 'Second question',
      category: 'general' as const,
      hexagram: HEXAGRAMS_DB[1],
      interpretations: { traditional: 't', ai: 'a', practical: 'p' }
    });

    const consultations = await getUserConsultations(testUserId);
    
    expect(consultations).toHaveLength(2);
    expect(consultations[0].id).toBe(consultation2.id); // Most recent first
    expect(consultations[1].id).toBe(consultation1.id);
  });
});
```

### 5.2 Authentication Integration Testing

**Auth Flow Testing**
```typescript
// __tests__/integration/auth/auth-flow.test.ts
import { render, screen, waitFor } from '@/test-utils';
import { AuthProvider, useAuth } from '@/lib/auth/AuthProvider';
import { createTestSupabase } from '@/test-utils/supabase-test-utils';

// Test component to interact with auth
function AuthTestComponent() {
  const { user, signIn, signUp, signOut, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <span>Logged in as: {user.email}</span>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <button onClick={() => signIn('test@example.com', 'password')}>
            Sign In
          </button>
          <button onClick={() => signUp('test@example.com', 'password')}>
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}

describe('Authentication Integration', () => {
  beforeEach(() => {
    // Mock successful auth responses
    jest.mocked(createTestSupabase().auth.signInWithPassword).mockResolvedValue({
      data: {
        user: { id: 'test-id', email: 'test@example.com' },
        session: { access_token: 'test-token' }
      },
      error: null
    });
  });

  it('should handle sign in flow', async () => {
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText('Sign In');
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Logged in as: test@example.com')).toBeInTheDocument();
    });
  });

  it('should handle sign out flow', async () => {
    // Start with authenticated user
    jest.mocked(createTestSupabase().auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-id', email: 'test@example.com' },
          access_token: 'test-token'
        }
      },
      error: null
    });

    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Logged in as: test@example.com')).toBeInTheDocument();
    });

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });
});
```

---

## 6. End-to-End Testing Standards

### 6.1 Playwright E2E Setup

**Playwright Configuration**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 6.2 Complete User Journey Testing

**Consultation Journey E2E Test**
```typescript
// e2e/consultation-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complete Consultation Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test user authentication
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword');
    await page.click('[data-testid="login-button"]');
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should complete full consultation flow', async ({ page }) => {
    // Navigate to consultation page
    await page.click('[data-testid="nav-consultation"]');
    await expect(page).toHaveURL('/consultation');

    // Fill in question
    const question = 'Should I accept the job offer in San Francisco?';
    await page.fill('[data-testid="question-input"]', question);
    
    // Select category
    await page.selectOption('[data-testid="category-select"]', 'career');
    
    // Generate consultation
    await page.click('[data-testid="generate-consultation"]');
    
    // Wait for hexagram generation
    await expect(page.getByTestId('hexagram-display')).toBeVisible({ timeout: 10000 });
    
    // Verify hexagram details are shown
    await expect(page.getByTestId('hexagram-number')).toBeVisible();
    await expect(page.getByTestId('hexagram-name')).toBeVisible();
    await expect(page.getByTestId('hexagram-chinese')).toBeVisible();
    
    // Verify interpretation tabs
    await expect(page.getByTestId('traditional-interpretation')).toBeVisible();
    await expect(page.getByTestId('ai-interpretation')).toBeVisible();
    await expect(page.getByTestId('practical-interpretation')).toBeVisible();
    
    // Test tab switching
    await page.click('[data-testid="ai-interpretation-tab"]');
    await expect(page.getByTestId('ai-interpretation-content')).toBeVisible();
    
    // Save consultation
    await page.click('[data-testid="save-consultation"]');
    await expect(page.getByText('Consultation saved')).toBeVisible();
    
    // Verify it appears in history
    await page.click('[data-testid="nav-history"]');
    await expect(page.getByText(question)).toBeVisible();
  });

  test('should handle consultation errors gracefully', async ({ page }) => {
    await page.goto('/consultation');
    
    // Try to submit without question
    await page.click('[data-testid="generate-consultation"]');
    
    // Should show validation error
    await expect(page.getByText(/please provide a more detailed question/i)).toBeVisible();
    
    // Fill in very short question
    await page.fill('[data-testid="question-input"]', 'Help?');
    await page.click('[data-testid="generate-consultation"]');
    
    // Should show length validation error
    await expect(page.getByText(/question must be at least 10 characters/i)).toBeVisible();
  });

  test('should work offline', async ({ page, context }) => {
    // Enable offline mode
    await context.setOffline(true);
    
    await page.goto('/consultation');
    
    // Should show offline indicator
    await expect(page.getByText(/you are offline/i)).toBeVisible();
    
    // Should still allow basic consultation (cached)
    await page.fill('[data-testid="question-input"]', 'What should I focus on today?');
    await page.click('[data-testid="generate-consultation"]');
    
    // Should generate hexagram from cached data
    await expect(page.getByTestId('hexagram-display')).toBeVisible();
    
    // Should show offline notice for AI interpretation
    await expect(page.getByText(/ai interpretation unavailable offline/i)).toBeVisible();
  });
});
```

### 6.3 Mobile-Specific E2E Testing

**Mobile User Experience Testing**
```typescript
// e2e/mobile-experience.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test.describe('Mobile User Experience', () => {
  test('should handle touch interactions for coin casting', async ({ page }) => {
    await page.goto('/consultation');
    
    // Fill question first
    await page.fill('[data-testid="question-input"]', 'What path should I take?');
    
    // Test coin casting with touch
    const coin1 = page.getByTestId('coin-1');
    const coin2 = page.getByTestId('coin-2');
    const coin3 = page.getByTestId('coin-3');
    
    // Touch each coin
    await coin1.tap();
    await coin2.tap();
    await coin3.tap();
    
    // Should show coin animation
    await expect(coin1).toHaveClass(/casting/);
    await expect(coin2).toHaveClass(/casting/);
    await expect(coin3).toHaveClass(/casting/);
    
    // Wait for animation to complete and show results
    await expect(page.getByTestId('hexagram-line-1')).toBeVisible({ timeout: 5000 });
  });

  test('should have proper touch target sizes', async ({ page }) => {
    await page.goto('/consultation');
    
    // All interactive elements should be at least 44px
    const buttons = await page.getByRole('button').all();
    
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should handle viewport orientation changes', async ({ page }) => {
    await page.goto('/consultation');
    
    // Portrait mode
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByTestId('consultation-form')).toBeVisible();
    
    // Landscape mode
    await page.setViewportSize({ width: 812, height: 375 });
    await expect(page.getByTestId('consultation-form')).toBeVisible();
    
    // Content should still be accessible
    await expect(page.getByTestId('question-input')).toBeVisible();
  });
});
```

---

## 7. API Testing Standards

### 7.1 API Route Testing

**Consultation API Testing**
```typescript
// __tests__/api/consultation/create.test.ts
import { POST } from '@/app/api/consultation/create/route';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';

// Mock dependencies
jest.mock('@/lib/supabase/server');
jest.mock('@/lib/ai/interpretations');

describe('/api/consultation/create', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock authenticated user
    jest.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id', email: 'test@example.com' } },
          error: null
        })
      }
    } as any);
  });

  it('should create consultation with valid data', async () => {
    const requestBody = {
      question: 'Should I accept this new job opportunity?',
      category: 'career'
    };

    const request = new NextRequest('http://localhost:3000/api/consultation/create', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Mock successful AI interpretation
    jest.mocked(generateAIInterpretation).mockResolvedValue({
      interpretation: 'This hexagram suggests careful consideration...',
      tokensUsed: 150
    });

    // Mock successful database save
    jest.mocked(createConsultation).mockResolvedValue({
      id: 'consultation-id',
      userId: 'test-user-id',
      question: requestBody.question,
      category: requestBody.category,
      hexagram: expect.any(Object),
      interpretations: expect.any(Object),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data.question).toBe(requestBody.question);
    expect(data.category).toBe(requestBody.category);
  });

  it('should reject unauthorized requests', async () => {
    // Mock unauthenticated user
    jest.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid token' }
        })
      }
    } as any);

    const request = new NextRequest('http://localhost:3000/api/consultation/create', {
      method: 'POST',
      body: JSON.stringify({
        question: 'Test question',
        category: 'general'
      }),
    });

    const response = await POST(request);
    
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  it('should validate request data', async () => {
    const invalidRequests = [
      { question: '', category: 'general' }, // Empty question
      { question: 'Short', category: 'general' }, // Too short
      { question: 'Valid question here', category: 'invalid' }, // Invalid category
      { category: 'general' }, // Missing question
    ];

    for (const invalidBody of invalidRequests) {
      const request = new NextRequest('http://localhost:3000/api/consultation/create', {
        method: 'POST',
        body: JSON.stringify(invalidBody),
      });

      const response = await POST(request);
      
      expect(response.status).toBe(400);
      const errorData = await response.json();
      expect(errorData).toHaveProperty('error');
    }
  });

  it('should handle AI service failures gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/consultation/create', {
      method: 'POST',
      body: JSON.stringify({
        question: 'What should I do about my career?',
        category: 'career'
      }),
    });

    // Mock AI service failure
    jest.mocked(generateAIInterpretation).mockRejectedValue(
      new Error('OpenAI service unavailable')
    );

    const response = await POST(request);
    
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({
      error: 'Internal server error',
      message: 'Something went wrong'
    });
  });

  it('should handle rate limiting', async () => {
    // Mock rate limit exceeded
    jest.mocked(checkRateLimit).mockReturnValue(false);

    const request = new NextRequest('http://localhost:3000/api/consultation/create', {
      method: 'POST',
      body: JSON.stringify({
        question: 'Test question',
        category: 'general'
      }),
    });

    const response = await POST(request);
    
    expect(response.status).toBe(429);
    expect(await response.json()).toMatchObject({
      error: 'Rate limit exceeded'
    });
  });
});
```

### 7.2 API Contract Testing

**OpenAPI Schema Validation**
```typescript
// __tests__/api/schema-validation.test.ts
import { validateApiResponse, validateApiRequest } from '@/test-utils/schema-validation';
import { consultationApiSchema } from '@/schemas/api-schemas';

describe('API Schema Validation', () => {
  describe('Consultation API Schema', () => {
    it('should validate successful consultation response', () => {
      const validResponse = {
        id: 'consultation-123',
        userId: 'user-456',
        question: 'Should I change careers?',
        category: 'career',
        hexagram: {
          number: 11,
          name: 'Peace',
          chinese: '泰',
          lines: [
            { position: 1, type: 'yin', changing: false },
            { position: 2, type: 'yin', changing: false },
            { position: 3, type: 'yin', changing: false },
            { position: 4, type: 'yang', changing: false },
            { position: 5, type: 'yang', changing: false },
            { position: 6, type: 'yang', changing: false }
          ]
        },
        interpretations: {
          traditional: 'Traditional interpretation...',
          ai: 'AI interpretation...',
          practical: 'Practical guidance...'
        },
        createdAt: '2025-07-30T10:00:00Z',
        updatedAt: '2025-07-30T10:00:00Z'
      };

      const result = validateApiResponse(consultationApiSchema.create.response, validResponse);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid consultation request', () => {
      const invalidRequest = {
        question: 'Too short', // Too short
        category: 'invalid-category' // Invalid category
      };

      const result = validateApiRequest(consultationApiSchema.create.request, invalidRequest);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Question must be at least 10 characters');
      expect(result.errors).toContain('Invalid category');
    });
  });
});
```

---

## 8. Cultural Accuracy Testing

### 8.1 I Ching Content Validation

**Traditional Content Testing**
```typescript
// __tests__/cultural/i-ching-accuracy.test.ts
import { HEXAGRAMS_DB } from '@/lib/i-ching/hexagrams-data';
import { TRIGRAMS_DB } from '@/lib/i-ching/trigrams-data';
import { validateCulturalContent } from '@/lib/cultural/validation';

describe('I Ching Cultural Accuracy', () => {
  describe('Hexagram Database', () => {
    it('should have exactly 64 hexagrams', () => {
      expect(HEXAGRAMS_DB).toHaveLength(64);
    });

    it('should have unique hexagram numbers 1-64', () => {
      const numbers = HEXAGRAMS_DB.map(h => h.number);
      const uniqueNumbers = new Set(numbers);
      
      expect(uniqueNumbers.size).toBe(64);
      expect(Math.min(...numbers)).toBe(1);
      expect(Math.max(...numbers)).toBe(64);
    });

    it('should have valid Chinese characters for each hexagram', () => {
      HEXAGRAMS_DB.forEach((hexagram, index) => {
        expect(hexagram.chinese).toBeTruthy();
        expect(hexagram.chinese).toMatch(/^[\u4e00-\u9fff]+$/); // Chinese Unicode range
        
        // Validate with cultural expert data
        const isValid = validateCulturalContent.validateChineseCharacters(hexagram.chinese);
        expect(isValid).toBe(true);
      });
    });

    it('should have authentic traditional interpretations', () => {
      const problematicTerms = [
        'fortune', 'luck', 'predict', 'will happen', 
        'guaranteed', 'certain', 'never', 'always'
      ];

      HEXAGRAMS_DB.forEach(hexagram => {
        const content = `${hexagram.meaning} ${hexagram.judgment} ${hexagram.image}`.toLowerCase();
        
        problematicTerms.forEach(term => {
          expect(content).not.toContain(term);
        });
      });
    });

    it('should maintain traditional hexagram sequence', () => {
      // First hexagram should be Heaven (Qián)
      expect(HEXAGRAMS_DB[0].name).toBe('Heaven');
      expect(HEXAGRAMS_DB[0].chinese).toBe('乾');
      
      // Second hexagram should be Earth (Kūn)  
      expect(HEXAGRAMS_DB[1].name).toBe('Earth');
      expect(HEXAGRAMS_DB[1].chinese).toBe('坤');
      
      // Verify King Wen sequence is maintained
      const kingWenSequence = [1, 2, 3, 4, 5, 6, 7, 8]; // First 8
      const actualSequence = HEXAGRAMS_DB.slice(0, 8).map(h => h.number);
      expect(actualSequence).toEqual(kingWenSequence);
    });
  });

  describe('Trigram Accuracy', () => {
    it('should have exactly 8 trigrams', () => {
      expect(TRIGRAMS_DB).toHaveLength(8);
    });

    it('should maintain traditional trigram associations', () => {
      const heaven = TRIGRAMS_DB.find(t => t.chinese === '乾');
      expect(heaven?.name).toBe('Heaven');
      expect(heaven?.element).toBe('Metal');
      expect(heaven?.direction).toBe('Northwest');
      
      const earth = TRIGRAMS_DB.find(t => t.chinese === '坤');
      expect(earth?.name).toBe('Earth');
      expect(earth?.element).toBe('Earth');
      expect(earth?.direction).toBe('Southwest');
    });
  });
});
```

### 8.2 AI Cultural Sensitivity Testing

**AI Interpretation Cultural Testing**
```typescript
// __tests__/cultural/ai-interpretation-validation.test.ts
import { generateAIInterpretation } from '@/lib/ai/interpretations';
import { validateCulturalContent } from '@/lib/cultural/validation';
import { HEXAGRAMS_DB } from '@/lib/i-ching/hexagrams-data';

describe('AI Cultural Sensitivity', () => {
  // Mock OpenAI to control responses for testing
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should avoid fortune-telling language', async () => {
    const testQuestions = [
      'Should I invest in cryptocurrency?',
      'Will my relationship work out?',
      'What will happen to my career?'
    ];

    for (const question of testQuestions) {
      const mockAIResponse = `
        The hexagram suggests that you will definitely succeed and your future is guaranteed to be bright.
        You will meet your soulmate next month and everything will work out perfectly.
      `;

      jest.mocked(openai.chat.completions.create).mockResolvedValue({
        choices: [{ message: { content: mockAIResponse } }],
        usage: { total_tokens: 100 }
      } as any);

      await expect(
        generateAIInterpretation(question, HEXAGRAMS_DB[0], 'general')
      ).rejects.toThrow(/fortune.*telling/i);
    }
  });

  it('should maintain respectful tone about I Ching', async () => {
    const respectfulResponse = `
      The I Ching wisdom suggests reflecting on balance and harmony in your decision.
      This ancient guidance invites contemplation of the natural flow of change.
      Consider the traditional meaning alongside your personal circumstances.
    `;

    jest.mocked(openai.chat.completions.create).mockResolvedValue({
      choices: [{ message: { content: respectfulResponse } }],
      usage: { total_tokens: 80 }
    } as any);

    const result = await generateAIInterpretation(
      'How should I approach this decision?',
      HEXAGRAMS_DB[0],
      'general'
    );

    expect(result.interpretation).toContain('I Ching wisdom');
    expect(result.interpretation).toContain('ancient guidance');
    expect(result.interpretation).toContain('traditional meaning');
  });

  it('should pass cultural validation checks', async () => {
    const validResponse = `
      This hexagram invites reflection on the principle of gradual progress.
      The ancient wisdom suggests patience and steady advancement rather than hasty action.
      Consider how this relates to your current situation and inner wisdom.
    `;

    jest.mocked(openai.chat.completions.create).mockResolvedValue({
      choices: [{ message: { content: validResponse } }],
      usage: { total_tokens: 75 }
    } as any);

    const result = await generateAIInterpretation(
      'What approach should I take?',
      HEXAGRAMS_DB[52], // Gradual Progress
      'general'
    );

    // Should pass all cultural validation
    expect(validateCulturalContent.avoidDivinationClaims(result.interpretation)).toBe(true);
    expect(validateCulturalContent.maintainRespectfulTone(result.interpretation)).toBe(true);
  });
});
```

---

## 9. Accessibility Testing Standards

### 9.1 Automated Accessibility Testing

**axe-core Integration**
```typescript
// __tests__/accessibility/axe-compliance.test.ts
import { render } from '@/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ConsultationInterface } from '@/components/consultation/ConsultationInterface';
import { HexagramDisplay } from '@/components/consultation/HexagramDisplay';
import { HEXAGRAMS_DB } from '@/lib/i-ching/hexagrams-data';

expect.extend(toHaveNoViolations);

describe('Accessibility Compliance', () => {
  it('should have no axe violations on consultation interface', async () => {
    const { container } = render(<ConsultationInterface />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('should have no axe violations on hexagram display', async () => {
    const { container } = render(
      <HexagramDisplay hexagram={HEXAGRAMS_DB[0]} />
    );
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('should maintain accessibility with dynamic content', async () => {
    const { container, rerender } = render(
      <HexagramDisplay hexagram={HEXAGRAMS_DB[0]} isAnimating={false} />
    );

    // Test initial state
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    // Test with animation
    rerender(<HexagramDisplay hexagram={HEXAGRAMS_DB[0]} isAnimating={true} />);
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 9.2 Keyboard Navigation Testing

**Keyboard Accessibility Testing**
```typescript
// __tests__/accessibility/keyboard-navigation.test.ts
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { ConsultationForm } from '@/components/consultation/ConsultationForm';

describe('Keyboard Navigation', () => {
  it('should support tab navigation through form', async () => {
    const user = userEvent.setup();
    render(<ConsultationForm onSubmit={jest.fn()} />);

    const questionInput = screen.getByLabelText(/your question/i);
    const categorySelect = screen.getByLabelText(/category/i);
    const submitButton = screen.getByRole('button', { name: /generate consultation/i });

    // Tab through elements
    await user.tab();
    expect(questionInput).toHaveFocus();

    await user.tab();
    expect(categorySelect).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();
  });

  it('should handle enter key on buttons', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    render(<ConsultationForm onSubmit={mockSubmit} />);

    const questionInput = screen.getByLabelText(/your question/i);
    const submitButton = screen.getByRole('button', { name: /generate consultation/i });

    // Fill form and use keyboard to submit
    await user.type(questionInput, 'What should I focus on today?');
    submitButton.focus();
    await user.keyboard('{Enter}');

    expect(mockSubmit).toHaveBeenCalled();
  });

  it('should trap focus in modals', async () => {
    const user = userEvent.setup();
    render(<ConsultationResultModal isOpen={true} onClose={jest.fn()} />);

    const firstFocusable = screen.getByTestId('modal-close-button');
    const lastFocusable = screen.getByTestId('modal-save-button');

    // Focus should start on first focusable element
    expect(firstFocusable).toHaveFocus();

    // Tab to last element
    await user.tab();
    await user.tab();
    expect(lastFocusable).toHaveFocus();

    // Tab should cycle back to first
    await user.tab();
    expect(firstFocusable).toHaveFocus();

    // Shift+Tab should go to last
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(lastFocusable).toHaveFocus();
  });

  it('should handle escape key for dismissible elements', async () => {
    const user = userEvent.setup();
    const mockClose = jest.fn();
    render(<ConsultationResultModal isOpen={true} onClose={mockClose} />);

    await user.keyboard('{Escape}');
    expect(mockClose).toHaveBeenCalled();
  });
});
```

### 9.3 Screen Reader Testing

**ARIA and Screen Reader Support**
```typescript
// __tests__/accessibility/screen-reader.test.ts
import { render, screen } from '@/test-utils';
import { HexagramDisplay } from '@/components/consultation/HexagramDisplay';
import { HEXAGRAMS_DB } from '@/lib/i-ching/hexagrams-data';

describe('Screen Reader Support', () => {
  it('should provide meaningful alt text for hexagram', () => {
    render(<HexagramDisplay hexagram={HEXAGRAMS_DB[0]} />);

    const hexagramImage = screen.getByRole('img');
    expect(hexagramImage).toHaveAccessibleName(/Hexagram 1.*Heaven/);
  });

  it('should announce dynamic content changes', () => {
    const { rerender } = render(
      <HexagramDisplay hexagram={HEXAGRAMS_DB[0]} isAnimating={false} />
    );

    // Should not have live region when not animating
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Should announce when animating
    rerender(<HexagramDisplay hexagram={HEXAGRAMS_DB[0]} isAnimating={true} />);
    
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveTextContent(/generating.*hexagram/i);
  });

  it('should provide context for form validation', () => {
    render(<ConsultationForm onSubmit={jest.fn()} />);

    const questionInput = screen.getByLabelText(/your question/i);
    
    // Should have describedby for help text
    expect(questionInput).toHaveAttribute('aria-describedby');
    
    // Help text should be accessible
    const helpText = screen.getByText(/ask a specific question/i);
    expect(helpText).toBeInTheDocument();
  });

  it('should structure content with proper headings', () => {
    render(<ConsultationInterface />);

    // Should have logical heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();

    const subHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(subHeadings.length).toBeGreaterThan(0);
  });

  it('should provide button context and state', () => {
    render(<ConsultationForm onSubmit={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /generate consultation/i });
    
    // Should not be pressed (toggle button state)
    expect(submitButton).not.toHaveAttribute('aria-pressed');
    
    // Should have appropriate role
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
```

---

## 10. Performance Testing Standards

### 10.1 Core Web Vitals Testing

**Performance Metrics Testing**
```typescript
// __tests__/performance/core-web-vitals.test.ts
import { chromium } from 'playwright';

describe('Core Web Vitals', () => {
  let browser: any;
  let page: any;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should meet LCP target on consultation page', async () => {
    await page.goto('http://localhost:3000/consultation');
    
    const lcp = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Timeout after 10 seconds
        setTimeout(() => resolve(0), 10000);
      });
    });

    expect(lcp).toBeLessThan(2500); // 2.5 seconds
  });

  it('should meet FID target for user interactions', async () => {
    await page.goto('http://localhost:3000/consultation');
    
    // Click on an interactive element
    const button = page.getByTestId('generate-consultation');
    const startTime = Date.now();
    
    await button.click();
    
    const fid = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          const fidEntry = entries.find(entry => entry.name === 'first-input');
          resolve(fidEntry ? fidEntry.processingStart - fidEntry.startTime : 0);
        }).observe({ entryTypes: ['first-input'] });
        
        setTimeout(() => resolve(0), 5000);
      });
    });

    expect(fid).toBeLessThan(100); // 100 milliseconds
  });

  it('should meet CLS target during content loading', async () => {
    await page.goto('http://localhost:3000/consultation');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let cumulativeScore = 0;
        
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              cumulativeScore += entry.value;
            }
          });
          resolve(cumulativeScore);
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => resolve(cumulativeScore), 5000);
      });
    });

    expect(cls).toBeLessThan(0.1); // 0.1 CLS score
  });
});
```

### 10.2 Bundle Size Testing

**JavaScript Bundle Analysis**
```typescript
// __tests__/performance/bundle-analysis.test.ts
import { analyze } from '@next/bundle-analyzer';
import fs from 'fs';

describe('Bundle Size Analysis', () => {
  it('should keep total bundle size under limits', async () => {
    const buildInfo = JSON.parse(
      fs.readFileSync('.next/build-manifest.json', 'utf8')
    );

    const mainBundleSize = getMainBundleSize(buildInfo);
    
    // Main bundle should be under 300KB
    expect(mainBundleSize).toBeLessThan(300 * 1024);
  });

  it('should have optimal code splitting', async () => {
    const buildInfo = JSON.parse(
      fs.readFileSync('.next/build-manifest.json', 'utf8')
    );

    // Should have separate chunks for major features
    expect(buildInfo.pages['/consultation']).toBeDefined();
    expect(buildInfo.pages['/dashboard']).toBeDefined();
    
    // Heavy dependencies should be in separate chunks
    const consultationChunks = buildInfo.pages['/consultation'];
    const hasAIChunk = consultationChunks.some((chunk: string) => 
      chunk.includes('ai') || chunk.includes('openai')
    );
    
    expect(hasAIChunk).toBe(true);
  });

  it('should not include unnecessary dependencies', async () => {
    const packageJson = JSON.parse(
      fs.readFileSync('package.json', 'utf8')
    );

    // Should not have unused heavy dependencies
    const heavyPackages = ['lodash', 'moment', 'jquery'];
    
    heavyPackages.forEach(pkg => {
      expect(packageJson.dependencies?.[pkg]).toBeUndefined();
      expect(packageJson.devDependencies?.[pkg]).toBeUndefined();
    });
  });
});

function getMainBundleSize(buildInfo: any): number {
  // Implementation to calculate main bundle size
  const mainFiles = buildInfo.pages['/'].filter((file: string) => 
    file.endsWith('.js') && !file.includes('chunk')
  );
  
  return mainFiles.reduce((total: number, file: string) => {
    const filePath = `.next/static/${file}`;
    if (fs.existsSync(filePath)) {
      return total + fs.statSync(filePath).size;
    }
    return total;
  }, 0);
}
```

---

## 11. Security Testing Standards

### 11.1 Authentication Security Testing

**Auth Vulnerability Testing**
```typescript
// __tests__/security/auth-security.test.ts
import { POST as loginPost } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';

describe('Authentication Security', () => {
  it('should prevent SQL injection in login', async () => {
    const maliciousInputs = [
      "admin'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --"
    ];

    for (const maliciousEmail of maliciousInputs) {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: maliciousEmail,
          password: 'password'
        }),
      });

      const response = await loginPost(request);
      
      // Should reject with proper error, not expose database errors
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).not.toContain('SQL');
      expect(data.error).not.toContain('database');
    }
  });

  it('should rate limit login attempts', async () => {
    const email = 'test@example.com';
    const requests = [];

    // Make 10 rapid login attempts
    for (let i = 0; i < 10; i++) {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password: 'wrongpassword'
        }),
      });

      requests.push(loginPost(request));
    }

    const responses = await Promise.all(requests);
    
    // Should have some rate limited responses
    const rateLimitedResponses = responses.filter(r => r.status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  it('should validate JWT tokens properly', async () => {
    const invalidTokens = [
      'invalid.jwt.token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
      '', // Empty token
      'Bearer fake-token'
    ];

    for (const token of invalidTokens) {
      const request = new NextRequest('http://localhost:3000/api/consultation/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: 'Test question',
          category: 'general'
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    }
  });
});
```

### 11.2 Input Validation Security Testing

**XSS and Injection Prevention**
```typescript
// __tests__/security/input-validation.test.ts
import { sanitizeQuestion, validateConsultationRequest } from '@/lib/validation/consultation';

describe('Input Validation Security', () => {
  it('should prevent XSS in question input', () => {
    const xssInputs = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src="x" onerror="alert(1)">',
      '"><script>alert("xss")</script>',
      '<svg onload="alert(1)">',
    ];

    xssInputs.forEach(input => {
      const sanitized = sanitizeQuestion(input);
      
      // Should remove all script tags and JavaScript
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('javascript:');
      expect(sanitized).not.toContain('onerror=');
      expect(sanitized).not.toContain('onload=');
    });
  });

  it('should validate consultation requests strictly', () => {
    const maliciousRequests = [
      {
        question: '<script>alert("xss")</script>What should I do?',
        category: 'general'
      },
      {
        question: 'Valid question',
        category: '../../etc/passwd'
      },
      {
        question: 'Valid question',
        category: 'general',
        maliciousField: '<script>alert("xss")</script>'
      }
    ];

    maliciousRequests.forEach(request => {
      const result = validateConsultationRequest(request);
      
      if (result.success) {
        // If it passes validation, ensure it's been sanitized
        expect(result.data.question).not.toContain('<script>');
        expect(['general', 'career', 'relationships', 'health', 'spiritual', 'decision'])
          .toContain(result.data.category);
      } else {
        // Should fail validation for malicious input
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  it('should prevent NoSQL injection in database queries', async () => {
    const maliciousIds = [
      '{"$ne": null}',
      '{"$gt": ""}',
      '{$where: "this.email === \'admin@example.com\'"}',
      '"; DROP TABLE consultations; --'
    ];

    for (const maliciousId of maliciousIds) {
      // Test with malicious user ID
      await expect(
        getUserConsultations(maliciousId)
      ).rejects.toThrow();
    }
  });
});
```

---

## 12. AI Integration Testing

### 12.1 OpenAI API Testing

**AI Service Integration Testing**
```typescript
// __tests__/ai/openai-integration.test.ts
import { generateAIInterpretation } from '@/lib/ai/interpretations';
import { OpenAI } from 'openai';
import { HEXAGRAMS_DB } from '@/lib/i-ching/hexagrams-data';

// Mock OpenAI client
jest.mock('openai');

describe('OpenAI Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful AI responses', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: 'This hexagram suggests contemplating the balance between action and patience...'
        }
      }],
      usage: { total_tokens: 120 }
    };

    jest.mocked(OpenAI.prototype.chat.completions.create).mockResolvedValue(mockResponse as any);

    const result = await generateAIInterpretation(
      'Should I start a new business?',
      HEXAGRAMS_DB[0],
      'career'
    );

    expect(result.interpretation).toBe(mockResponse.choices[0].message.content);
    expect(result.tokensUsed).toBe(120);
  });

  it('should handle API rate limiting', async () => {
    const rateLimitError = new OpenAI.APIError('Rate limit exceeded', {
      status: 429,
      headers: {},
      error: {
        type: 'rate_limit_exceeded',
        message: 'Rate limit exceeded'
      }
    } as any, 'Rate limit exceeded', {});

    jest.mocked(OpenAI.prototype.chat.completions.create).mockRejectedValue(rateLimitError);

    await expect(
      generateAIInterpretation('Test question', HEXAGRAMS_DB[0], 'general')
    ).rejects.toThrow(/temporarily unavailable/);
  });

  it('should handle API authentication errors', async () => {
    const authError = new OpenAI.APIError('Invalid API key', {
      status: 401,
      headers: {},
      error: {
        type: 'invalid_api_key',
        message: 'Invalid API key'
      }
    } as any, 'Invalid API key', {});

    jest.mocked(OpenAI.prototype.chat.completions.create).mockRejectedValue(authError);

    await expect(
      generateAIInterpretation('Test question', HEXAGRAMS_DB[0], 'general')
    ).rejects.toThrow(/authentication error/);
  });

  it('should handle empty or invalid responses', async () => {
    const invalidResponses = [
      { choices: [] }, // No choices
      { choices: [{ message: { content: null } }] }, // Null content
      { choices: [{ message: { content: '' } }] }, // Empty content
    ];

    for (const invalidResponse of invalidResponses) {
      jest.mocked(OpenAI.prototype.chat.completions.create).mockResolvedValue({
        ...invalidResponse,
        usage: { total_tokens: 0 }
      } as any);

      await expect(
        generateAIInterpretation('Test question', HEXAGRAMS_DB[0], 'general')
      ).rejects.toThrow(/no interpretation generated/i);
    }
  });

  it('should include proper context in prompts', async () => {
    const mockCreate = jest.mocked(OpenAI.prototype.chat.completions.create);
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Test response' } }],
      usage: { total_tokens: 50 }
    } as any);

    await generateAIInterpretation(
      'Career guidance needed',
      HEXAGRAMS_DB[10], // Peace
      'career',
      'User is a software developer with 5 years experience'
    );

    const callArgs = mockCreate.mock.calls[0][0];
    const userMessage = callArgs.messages.find(m => m.role === 'user');
    
    expect(userMessage?.content).toContain('Career guidance needed');
    expect(userMessage?.content).toContain('Peace');
    expect(userMessage?.content).toContain('career');
    expect(userMessage?.content).toContain('software developer');
  });

  it('should respect token limits', async () => {
    const mockCreate = jest.mocked(OpenAI.prototype.chat.completions.create);
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Test response' } }],
      usage: { total_tokens: 450 }
    } as any);

    await generateAIInterpretation('Test question', HEXAGRAMS_DB[0], 'general');

    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.max_tokens).toBeLessThanOrEqual(500);
  });
});
```

### 12.2 AI Content Quality Testing

**AI Response Quality Validation**
```typescript
// __tests__/ai/content-quality.test.ts
import { validateAIResponse, checkContentQuality } from '@/lib/ai/validation';

describe('AI Content Quality', () => {
  it('should validate response length and structure', () => {
    const validResponse = `
      The I Ching wisdom of this hexagram suggests careful consideration of your path forward.
      This ancient guidance invites reflection on the balance between action and patience.
      
      In the context of your question, consider how the natural flow of change might inform your decision.
      The traditional meaning emphasizes the importance of timing and gradual progress.
      
      Practical guidance suggests taking time to gather more information before proceeding,
      while remaining open to the opportunities that naturally present themselves.
    `;

    const result = validateAIResponse(validResponse);
    
    expect(result.isValid).toBe(true);
    expect(result.wordCount).toBeGreaterThan(50);
    expect(result.wordCount).toBeLessThan(400);
    expect(result.hasParagraphs).toBe(true);
  });

  it('should reject responses that are too short or too long', () => {
    const tooShort = 'This hexagram means good luck.';
    const tooLong = 'This is a very long response that goes on and on... ' + 'word '.repeat(400);

    expect(validateAIResponse(tooShort).isValid).toBe(false);
    expect(validateAIResponse(tooLong).isValid).toBe(false);
  });

  it('should check for cultural authenticity markers', () => {
    const authenticResponse = `
      The ancient I Ching wisdom of hexagram 11, Peace, speaks to the harmony between Earth and Heaven.
      This traditional guidance suggests that when earthly concerns align with higher principles,
      natural progress unfolds with grace and wisdom.
    `;

    const inauthenticResponse = `
      This fortune cookie says you will have good luck today!
      The magic crystal ball predicts success in all your endeavors.
      Your destiny is written in the stars!
    `;

    expect(checkContentQuality(authenticResponse).culturallyAuthentic).toBe(true);
    expect(checkContentQuality(inauthenticResponse).culturallyAuthentic).toBe(false);
  });

  it('should ensure practical applicability', () => {
    const practicalResponse = `
      Consider taking a measured approach to this decision.
      Gather additional information from trusted advisors.
      Reflect on how this aligns with your long-term values and goals.
      Trust your intuition while also applying logical analysis.
    `;

    const impracticalResponse = `
      The cosmic forces will align to bring you fortune.
      Wait for a sign from the universe to guide your path.
      Everything will work out perfectly without any effort.
    `;

    expect(checkContentQuality(practicalResponse).isPractical).toBe(true);
    expect(checkContentQuality(impracticalResponse).isPractical).toBe(false);
  });
});
```

---

## 13. Database Testing Standards

### 13.1 Supabase Database Testing

**Database Schema Testing**
```typescript
// __tests__/database/schema-validation.test.ts
import { createTestSupabase, resetTestDatabase } from '@/test-utils/supabase-test-utils';

describe('Database Schema Validation', () => {
  let supabase: any;

  beforeAll(async () => {
    supabase = createTestSupabase();
  });

  beforeEach(async () => {
    await resetTestDatabase(supabase);
  });

  it('should enforce user_profiles table constraints', async () => {
    // Valid profile creation
    const validProfile = {
      id: 'user-123',
      display_name: 'Test User',
      preferences: { theme: 'light', notifications: true },
      subscription_tier: 'free'
    };

    const { error: validError } = await supabase
      .from('user_profiles')
      .insert(validProfile);

    expect(validError).toBeNull();

    // Invalid subscription tier should fail
    const invalidProfile = {
      id: 'user-456',
      subscription_tier: 'invalid_tier'
    };

    const { error: invalidError } = await supabase
      .from('user_profiles')
      .insert(invalidProfile);

    expect(invalidError).toBeDefined();
    expect(invalidError?.message).toContain('invalid_tier');
  });

  it('should enforce consultations table relationships', async () => {
    // Try to create consultation without valid user
    const orphanConsultation = {
      user_id: 'nonexistent-user',
      question: 'Test question',
      category: 'general',
      hexagram_data: { number: 1, name: 'Heaven' },
      interpretations: { traditional: 'test', ai: 'test', practical: 'test' }
    };

    const { error } = await supabase
      .from('consultations')
      .insert(orphanConsultation);

    expect(error).toBeDefined();
    expect(error?.message).toContain('foreign key');
  });

  it('should validate JSONB data structure', async () => {
    // Create user first
    await supabase.from('user_profiles').insert({ id: 'test-user' });

    // Valid JSONB structure
    const validConsultation = {
      user_id: 'test-user',
      question: 'Test question',
      category: 'general',
      hexagram_data: {
        number: 11,
        name: 'Peace',
        chinese: '泰',
        lines: [
          { position: 1, type: 'yin', changing: false },
          { position: 2, type: 'yin', changing: false },
          { position: 3, type: 'yin', changing: false },
          { position: 4, type: 'yang', changing: false },
          { position: 5, type: 'yang', changing: false },
          { position: 6, type: 'yang', changing: false }
        ]
      },
      interpretations: {
        traditional: 'Traditional meaning',
        ai: 'AI interpretation',
        practical: 'Practical guidance'
      }
    };

    const { error } = await supabase
      .from('consultations')
      .insert(validConsultation);

    expect(error).toBeNull();
  });

  it('should have proper indexes for performance', async () => {
    // Check that expected indexes exist
    const { data: indexes } = await supabase.rpc('get_table_indexes', {
      table_name: 'consultations'
    });

    const indexNames = indexes?.map((idx: any) => idx.indexname) || [];
    
    expect(indexNames).toContain('idx_consultations_user_date');
    expect(indexNames).toContain('idx_consultations_category');
  });
});
```

### 13.2 Data Migration Testing

**Database Migration Testing**
```typescript
// __tests__/database/migrations.test.ts
import { runMigrations, rollbackMigrations } from '@/test-utils/migration-utils';

describe('Database Migrations', () => {
  it('should run migrations successfully', async () => {
    const result = await runMigrations();
    
    expect(result.success).toBe(true);
    expect(result.appliedMigrations.length).toBeGreaterThan(0);
  });

  it('should be reversible', async () => {
    // Apply migrations
    await runMigrations();
    
    // Rollback should work
    const rollbackResult = await rollbackMigrations(1);
    expect(rollbackResult.success).toBe(true);
    
    // Re-apply should work
    const reapplyResult = await runMigrations();
    expect(reapplyResult.success).toBe(true);
  });

  it('should maintain data integrity during migrations', async () => {
    // Create test data
    const testData = await createTestConsultationData();
    
    // Run migration
    await runMigrations();
    
    // Verify data is still intact
    const afterMigration = await getConsultationData(testData.id);
    expect(afterMigration.question).toBe(testData.question);
    expect(afterMigration.hexagram_data.number).toBe(testData.hexagram_data.number);
  });
});
```

---

## 14. Visual Regression Testing

### 14.1 Screenshot Testing

**Visual Regression with Playwright**
```typescript
// __tests__/visual/screenshot-regression.test.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match consultation interface design', async ({ page }) => {
    await page.goto('/consultation');
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="consultation-form"]');
    
    // Take screenshot and compare
    await expect(page).toHaveScreenshot('consultation-interface.png');
  });

  test('should match hexagram display across different hexagrams', async ({ page }) => {
    const hexagramNumbers = [1, 2, 11, 64]; // Test key hexagrams
    
    for (const number of hexagramNumbers) {
      await page.goto(`/consultation/hexagram/${number}`);
      await page.waitForSelector('[data-testid="hexagram-display"]');
      
      await expect(page.getByTestId('hexagram-display')).toHaveScreenshot(
        `hexagram-${number}.png`
      );
    }
  });

  test('should maintain mobile responsive design', async ({ page }) => {
    // Test different mobile viewports
    const viewports = [
      { width: 375, height: 812 }, // iPhone X
      { width: 414, height: 896 }, // iPhone 11 Pro Max
      { width: 360, height: 640 }, // Android
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/consultation');
      
      await expect(page).toHaveScreenshot(
        `mobile-${viewport.width}x${viewport.height}.png`
      );
    }
  });

  test('should handle loading states consistently', async ({ page }) => {
    await page.goto('/consultation');
    
    // Fill form
    await page.fill('[data-testid="question-input"]', 'Test question for visual testing');
    
    // Click submit and immediately capture loading state
    const submitPromise = page.click('[data-testid="generate-consultation"]');
    
    // Capture loading state
    await expect(page.getByTestId('consultation-form')).toHaveScreenshot(
      'consultation-loading.png'
    );
    
    await submitPromise;
  });

  test('should maintain dark mode consistency', async ({ page }) => {
    // Enable dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    
    await page.goto('/consultation');
    await expect(page).toHaveScreenshot('consultation-dark-mode.png');
    
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard-dark-mode.png');
  });
});
```

---

## 15. Testing Tools & Setup

### 15.1 Testing Stack Configuration

**Jest Configuration**
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/test-utils/(.*)$': '<rootDir>/__tests__/utils/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,ts,tsx}',
    '!src/types/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/lib/i-ching/': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './src/lib/ai/': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testTimeout: 30000,
};

module.exports = createJestConfig(customJestConfig);
```

**Jest Setup File**
```typescript
// jest.setup.js
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.OPENAI_API_KEY = 'test-openai-key';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Extend expect with custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
```

### 15.2 Test Data Management

**Test Data Factories**
```typescript
// __tests__/utils/test-data-factory.ts
import { faker } from '@faker-js/faker';
import type { Hexagram, Consultation, UserProfile } from '@/types/i-ching';
import { HEXAGRAMS_DB } from '@/lib/i-ching/hexagrams-data';

export const createTestHexagram = (overrides?: Partial<Hexagram>): Hexagram => {
  const baseHexagram = faker.helpers.arrayElement(HEXAGRAMS_DB);
  
  return {
    ...baseHexagram,
    lines: baseHexagram.lines.map((line, index) => ({
      position: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6,
      type: faker.helpers.arrayElement(['yang', 'yin']),
      changing: faker.datatype.boolean(0.2), // 20% chance of changing
      interpretation: faker.lorem.sentence(),
    })),
    ...overrides,
  };
};

export const createTestConsultation = (overrides?: Partial<Consultation>): Consultation => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  question: faker.helpers.arrayElement([
    'Should I accept this new job opportunity?',
    'How can I improve my relationship with my partner?',
    'What direction should I take with my creative project?',
    'How should I handle this difficult decision?',
  ]),
  category: faker.helpers.arrayElement(['general', 'career', 'relationships', 'health', 'spiritual']),
  hexagram: createTestHexagram(),
  changingLines: faker.helpers.arrayElements([1, 2, 3, 4, 5, 6], { min: 0, max: 3 }),
  interpretations: {
    traditional: faker.lorem.paragraphs(2),
    ai: faker.lorem.paragraphs(3),
    practical: faker.lorem.paragraphs(2),
  },
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

export const createTestUserProfile = (overrides?: Partial<UserProfile>): UserProfile => ({
  id: faker.string.uuid(),
  displayName: faker.person.fullName(),
  email: faker.internet.email(),
  preferences: {
    theme: faker.helpers.arrayElement(['light', 'dark']),
    notifications: faker.datatype.boolean(),
    language: 'en',
  },
  subscriptionTier: faker.helpers.arrayElement(['free', 'sage_plus', 'sage_pro']),
  onboardingCompleted: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

// Preset test scenarios
export const createConsultationScenario = {
  careerChange: () => createTestConsultation({
    question: 'Should I leave my current job to start my own business?',
    category: 'career',
    hexagram: HEXAGRAMS_DB[23], // Splitting Apart - challenges and change
  }),
  
  relationshipGuidance: () => createTestConsultation({
    question: 'How can I resolve the conflict with my partner?',
    category: 'relationships',
    hexagram: HEXAGRAMS_DB[10], // Peace - harmony and balance
  }),
  
  spiritualGrowth: () => createTestConsultation({
    question: 'What spiritual practices should I focus on?',
    category: 'spiritual',
    hexagram: HEXAGRAMS_DB[51], // Contemplation - inner reflection
  }),
};
```

---

## 16. CI/CD Testing Pipeline

### 16.1 GitHub Actions Testing Workflow

**Complete CI/CD Pipeline**
```yaml
# .github/workflows/test.yml
name: Testing Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.TEST_SUPABASE_SERVICE_KEY }}
  OPENAI_API_KEY: ${{ secrets.TEST_OPENAI_API_KEY }}

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  component-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run component tests
        run: npm run test:components
      
      - name: Run accessibility tests
        run: npm run test:a11y

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup test database
        run: npm run db:test:setup
      
      - name: Run integration tests
        run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run security audit
        run: npm audit --audit-level=high
      
      - name: Run dependency check
        uses: securecodewarrior/github-action-add-sarif@v1
        with:
          sarif-file: 'security-scan-results.sarif'

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Run Lighthouse CI
        run: npm run test:lighthouse
      
      - name: Run bundle analysis
        run: npm run analyze:bundle

  cultural-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run cultural accuracy tests
        run: npm run test:cultural
      
      - name: Validate I Ching content
        run: npm run validate:i-ching-content
```

### 16.2 Testing Environment Management

**Environment-Specific Test Configuration**
```typescript
// __tests__/config/test-environments.ts
export const testEnvironments = {
  unit: {
    supabase: 'mock',
    openai: 'mock',
    database: 'memory',
    auth: 'mock',
  },
  integration: {
    supabase: 'test-instance',
    openai: 'test-key',
    database: 'test-db',
    auth: 'test-users',
  },
  e2e: {
    supabase: 'staging',
    openai: 'staging-key',
    database: 'staging-db',
    auth: 'real-auth',
  },
};

export function setupTestEnvironment(type: keyof typeof testEnvironments) {
  const config = testEnvironments[type];
  
  // Set environment variables
  process.env.TEST_ENVIRONMENT = type;
  
  // Configure services based on environment
  if (config.supabase === 'mock') {
    jest.mock('@/lib/supabase/client');
  }
  
  if (config.openai === 'mock') {
    jest.mock('openai');
  }
  
  return config;
}
```

---

## 17. Testing Metrics & Coverage

### 17.1 Coverage Targets

**Coverage Requirements by Module**

| Module | Lines | Functions | Branches | Statements |
|--------|-------|-----------|----------|------------|
| **I Ching Core** | 95% | 95% | 90% | 95% |
| **AI Integration** | 90% | 90% | 85% | 90% |
| **Authentication** | 85% | 90% | 80% | 85% |
| **Database Layer** | 85% | 90% | 80% | 85% |
| **UI Components** | 80% | 85% | 75% | 80% |
| **API Routes** | 85% | 90% | 80% | 85% |
| **Overall Target** | **80%** | **85%** | **75%** | **80%** |

### 17.2 Quality Metrics Dashboard

**Test Quality Tracking**
```typescript
// scripts/test-metrics.ts
interface TestMetrics {
  coverage: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
  testCounts: {
    unit: number;
    component: number;
    integration: number;
    e2e: number;
  };
  performance: {
    averageTestTime: number;
    slowestTest: string;
    flakyTests: string[];
  };
  culturalValidation: {
    hexagramsValidated: number;
    expertReviewsPending: number;
    culturalAccuracyScore: number;
  };
  accessibility: {
    a11yViolations: number;
    wcagCompliance: string;
    keyboardNavTests: number;
  };
}

export function generateTestReport(): TestMetrics {
  // Implementation to collect and report test metrics
  return {
    coverage: getCoverageData(),
    testCounts: getTestCounts(),
    performance: getPerformanceMetrics(),
    culturalValidation: getCulturalMetrics(),
    accessibility: getAccessibilityMetrics(),
  };
}
```

---

## Conclusion

This comprehensive testing strategy ensures that Sage maintains the highest standards of quality, cultural authenticity, and user experience. The testing approach prioritizes:

1. **Cultural Accuracy**: Rigorous validation of I Ching content and interpretations
2. **Accessibility Compliance**: WCAG 2.1 AA standards enforcement
3. **Performance Excellence**: Core Web Vitals and user experience optimization
4. **Security Assurance**: Comprehensive security testing across all surfaces
5. **User-Centric Quality**: Real user workflows and scenarios

**Key Success Factors:**
- **Automated Quality Gates**: No code ships without passing all test suites
- **Cultural Expert Integration**: Human validation of spiritual content
- **Accessibility First**: Every component tested for inclusive design
- **Performance Monitoring**: Continuous performance regression testing
- **Security Vigilance**: Regular security audits and vulnerability testing

The testing standards support the solo entrepreneur approach by:
- Leveraging automation to reduce manual testing overhead
- Focusing on high-impact quality areas (cultural accuracy, accessibility)
- Using managed services to simplify infrastructure testing
- Providing clear, actionable feedback for rapid iteration

By following these testing standards, Sage will deliver a product that truly honors ancient wisdom while meeting modern digital product expectations.

---

**Document Status:** Active  
**Last Updated:** July 30, 2025  
**Next Review:** Monthly  
**Maintained By:** Development Team