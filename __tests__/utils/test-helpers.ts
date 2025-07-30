/**
 * Test utilities for I Ching and consultation testing
 */

export const mockHexagram = {
  number: 1,
  name: 'The Creative',
  lines: [9, 9, 9, 9, 9, 9],
  changingLines: [] as number[],
};

export const mockConsultation = {
  id: 'test-consultation-123',
  user_id: 'test-user-123',
  question: 'What should I focus on in my career development?',
  hexagram_number: 1,
  hexagram_name: 'The Creative',
  lines: [9, 9, 9, 9, 9, 9],
  changing_lines: [],
  interpretation: {
    interpretation:
      'The Creative represents the primal creative force of the universe. In the context of your career question, this hexagram suggests a time of great potential and new beginnings.',
    guidance:
      'This is an auspicious time to take leadership roles and pursue ambitious projects. The Creative energy supports bold action and innovative thinking.',
    practicalAdvice:
      'Focus on developing your leadership skills, seek opportunities to lead projects, and trust your creative instincts. This is not a time for hesitation.',
    culturalContext:
      'In traditional Chinese philosophy, The Creative (乾, Qián) represents Heaven and the masculine principle. It is associated with strength, leadership, and the power to initiate change.',
  },
  created_at: '2024-01-01T12:00:00Z',
};

export const mockChangingHexagram = {
  number: 3,
  name: 'Difficulty at the Beginning',
  lines: [6, 7, 8, 9, 7, 8], // Lines 1 and 4 are changing
  changingLines: [1, 4],
};

/**
 * Create a mock hexagram with specific characteristics
 */
export function createMockHexagram(
  overrides: Partial<typeof mockHexagram> = {}
) {
  return {
    ...mockHexagram,
    ...overrides,
  };
}

/**
 * Create a mock consultation with specific characteristics
 */
export function createMockConsultation(
  overrides: Partial<typeof mockConsultation> = {}
) {
  return {
    ...mockConsultation,
    ...overrides,
  };
}

/**
 * Generate valid I Ching line values for testing
 */
export function generateValidLines(): number[] {
  const validValues = [6, 7, 8, 9];
  return Array.from(
    { length: 6 },
    () => validValues[Math.floor(Math.random() * validValues.length)]
  );
}

/**
 * Create mock OpenAI response for testing
 */
export function createMockOpenAIResponse(content: string) {
  return {
    choices: [
      {
        message: {
          content: content,
        },
      },
    ],
    model: 'gpt-4',
    usage: {
      prompt_tokens: 100,
      completion_tokens: 200,
      total_tokens: 300,
    },
  };
}

/**
 * Create mock Supabase response for testing
 */
export function createMockSupabaseResponse<T>(data: T, error: any = null) {
  return {
    data,
    error,
  };
}

/**
 * Validate hexagram structure for testing
 */
export function isValidHexagram(hexagram: any): boolean {
  if (!hexagram || typeof hexagram !== 'object') return false;
  if (
    typeof hexagram.number !== 'number' ||
    hexagram.number < 1 ||
    hexagram.number > 64
  )
    return false;
  if (typeof hexagram.name !== 'string' || hexagram.name.length === 0)
    return false;
  if (!Array.isArray(hexagram.lines) || hexagram.lines.length !== 6)
    return false;
  if (!hexagram.lines.every((line: any) => [6, 7, 8, 9].includes(line)))
    return false;
  if (!Array.isArray(hexagram.changingLines)) return false;

  return true;
}

/**
 * Validate consultation structure for testing
 */
export function isValidConsultation(consultation: any): boolean {
  if (!consultation || typeof consultation !== 'object') return false;
  if (
    typeof consultation.question !== 'string' ||
    consultation.question.length === 0
  )
    return false;
  if (!isValidHexagram(consultation.hexagram)) return false;

  return true;
}

/**
 * Mock fetch for API testing
 */
export function mockFetch(response: any, ok = true) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status: ok ? 200 : 500,
      json: () => Promise.resolve(response),
    })
  ) as jest.Mock;
}

/**
 * Clean up mocks after tests
 */
export function cleanupMocks() {
  jest.clearAllMocks();
  if (global.fetch && jest.isMockFunction(global.fetch)) {
    (global.fetch as jest.Mock).mockRestore();
  }
}

/**
 * Wait for async operations in tests
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Cultural sensitivity test helpers
 */
export const culturalTestCases = {
  respectfulLanguage: [
    'ancient wisdom',
    'traditional Chinese philosophy',
    'respectful interpretation',
    'cultural authenticity',
  ],

  inappropriateLanguage: [
    'superstition',
    'fortune telling',
    'mystical nonsense',
    'primitive beliefs',
  ],

  validateCulturalSensitivity(text: string): {
    isRespectful: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    this.inappropriateLanguage.forEach(term => {
      if (text.toLowerCase().includes(term)) {
        issues.push(`Contains potentially disrespectful term: "${term}"`);
      }
    });

    const hasRespectfulLanguage = this.respectfulLanguage.some(term =>
      text.toLowerCase().includes(term)
    );

    if (!hasRespectfulLanguage) {
      issues.push('Should include respectful cultural language');
    }

    return {
      isRespectful: issues.length === 0,
      issues,
    };
  },
};
