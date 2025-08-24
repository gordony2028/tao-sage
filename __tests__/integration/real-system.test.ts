/**
 * Real system integration tests using actual APIs
 * Tests against live Supabase and OpenAI (with cost controls)
 */

import { generateConsultationInterpretation } from '@/lib/openai/consultation';
import {
  selectModel,
  calculateComplexity,
  costTracker,
} from '@/lib/openai/client';
import { getCacheKey, validateResponse } from '@/lib/openai/prompts';

// Skip these tests if API keys are not available
const hasAPIKeys =
  process.env.OPENAI_API_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL;

describe.skip('Real System Integration', () => {
  // Only run if we have API keys and explicitly enable real tests
  const runRealTests = hasAPIKeys && process.env.RUN_REAL_TESTS === 'true';

  beforeAll(() => {
    if (!runRealTests) {
      console.log(
        'Skipping real system tests. Set RUN_REAL_TESTS=true to enable.'
      );
      return;
    }

    costTracker.reset();
    console.log('Running real system tests with live APIs...');
  });

  beforeEach(() => {
    if (!runRealTests) return;

    // Add small delay between tests to respect rate limits
    return new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(() => {
    if (!runRealTests) return;

    const totalCost = costTracker.getTotalCost();
    const avgCost = costTracker.getAverageCost();
    console.log(`\nReal API Test Summary:`);
    console.log(`Total cost: $${totalCost.toFixed(4)}`);
    console.log(`Average cost per consultation: $${avgCost.toFixed(4)}`);

    // Ensure we didn't exceed budget
    expect(totalCost).toBeLessThan(1.0); // Max $1 for all tests
    expect(avgCost).toBeLessThan(0.05); // Target met
  });

  describe('Smart Model Selection', () => {
    it('should use GPT-3.5 for simple consultations', async () => {
      if (!runRealTests) return;

      const consultation = {
        question: 'Quick advice?',
        hexagram: {
          number: 1,
          name: 'The Creative',
          lines: [9, 9, 9, 9, 9, 9],
          changingLines: [],
        },
      };

      const complexity = calculateComplexity(
        consultation.question,
        consultation.hexagram.changingLines
      );
      const model = selectModel(complexity);

      expect(complexity).toBeLessThan(0.5);
      expect(model).toBe('gpt-3.5-turbo');

      const result = await generateConsultationInterpretation(consultation);

      expect(result).toBeDefined();
      expect(result.interpretation).toBeTruthy();
      expect(validateResponse(result)).toBe(true);

      // Should be cost-effective
      const avgCost = costTracker.getAverageCost();
      expect(avgCost).toBeLessThan(0.01); // GPT-3.5 should be very cheap
    }, 10000);

    it('should use GPT-4 for complex philosophical questions', async () => {
      if (!runRealTests) return;

      const consultation = {
        question:
          'What is the deeper spiritual meaning and purpose behind my current life challenges?',
        hexagram: {
          number: 50,
          name: 'The Caldron',
          lines: [9, 8, 7, 6, 8, 9],
          changingLines: [1, 3, 4, 6],
        },
      };

      const complexity = calculateComplexity(
        consultation.question,
        consultation.hexagram.changingLines
      );
      const model = selectModel(complexity);

      expect(complexity).toBeGreaterThan(0.7);
      expect(model).toBe('gpt-4-turbo-preview');

      const result = await generateConsultationInterpretation(consultation);

      expect(result).toBeDefined();
      expect(result.interpretation).toBeTruthy();
      expect(result.interpretation.length).toBeGreaterThan(100); // GPT-4 should be more detailed
      expect(validateResponse(result)).toBe(true);

      // Even GPT-4 should meet cost target
      const avgCost = costTracker.getAverageCost();
      expect(avgCost).toBeLessThan(0.05);
    }, 15000);
  });

  describe('Caching System', () => {
    it('should cache identical consultations', async () => {
      if (!runRealTests) return;

      const consultation = {
        question: 'How should I approach my career development?',
        hexagram: {
          number: 10,
          name: 'Treading',
          lines: [7, 8, 9, 6, 7, 8],
          changingLines: [2],
        },
      };

      const cacheKey = getCacheKey(
        consultation.hexagram,
        consultation.question
      );

      // First call - should hit API
      const result1 = await generateConsultationInterpretation(consultation);
      const costAfterFirst = costTracker.getTotalCost();

      // Small delay to ensure caching works
      await new Promise(resolve => setTimeout(resolve, 100));

      // Second call - should use cache
      const result2 = await generateConsultationInterpretation(consultation);
      const costAfterSecond = costTracker.getTotalCost();

      expect(result1).toEqual(result2);
      expect(costAfterSecond).toBe(costAfterFirst); // No additional cost

      console.log(`Cache key: ${cacheKey}`);
      console.log(
        '✅ Caching working - no additional API cost for repeated consultation'
      );
    }, 10000);

    it('should handle case and punctuation normalization', () => {
      if (!runRealTests) return;

      const hexagram = {
        number: 1,
        name: 'The Creative',
        lines: [9, 9, 9, 9, 9, 9],
        changingLines: [],
      };

      const questions = [
        'What should I do?',
        'WHAT SHOULD I DO?',
        'what   should  i   do',
        'What should I do???',
      ];

      const keys = questions.map(q => getCacheKey(hexagram, q));

      // All should produce the same cache key
      expect(keys[0]).toBe(keys[1]);
      expect(keys[0]).toBe(keys[2]);
      expect(keys[0]).toBe(keys[3]);
    });
  });

  describe('Cultural Sensitivity', () => {
    it('should maintain cultural respect in real responses', async () => {
      if (!runRealTests) return;

      const consultation = {
        question: 'Tell me about my destiny and future',
        hexagram: {
          number: 2,
          name: 'The Receptive',
          lines: [6, 6, 6, 6, 6, 6],
          changingLines: [],
        },
      };

      const result = await generateConsultationInterpretation(consultation);

      expect(result).toBeDefined();
      expect(validateResponse(result)).toBe(true);

      const responseText = JSON.stringify(result).toLowerCase();

      // Should not contain fortune-telling language
      expect(responseText).not.toContain('predict');
      expect(responseText).not.toContain('fortune');
      expect(responseText).not.toContain('guarantee');

      // Should contain respectful, wisdom-based language
      expect(responseText).toMatch(/wisdom|guidance|suggests|consider|may/);

      console.log('✅ Cultural sensitivity maintained in real AI response');
    }, 10000);
  });

  describe('Cost Performance', () => {
    it('should achieve target cost across mixed consultations', async () => {
      if (!runRealTests) return;

      const consultations = [
        {
          question: 'Brief advice?',
          hexagram: {
            number: 8,
            name: 'Holding Together',
            lines: [7, 8, 7, 8, 7, 8],
            changingLines: [],
          },
        },
        {
          question: 'How should I handle my relationships and personal growth?',
          hexagram: {
            number: 31,
            name: 'Influence',
            lines: [6, 7, 8, 9, 7, 8],
            changingLines: [2, 4],
          },
        },
      ];

      for (const consultation of consultations) {
        await generateConsultationInterpretation(consultation);
        // Small delay between calls
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const avgCost = costTracker.getAverageCost();
      const totalCost = costTracker.getTotalCost();

      expect(avgCost).toBeLessThan(0.05);
      expect(totalCost).toBeLessThan(0.1); // For 2 consultations

      console.log(
        `✅ Real cost performance: Avg $${avgCost.toFixed(
          4
        )}, Total $${totalCost.toFixed(4)}`
      );
    }, 20000);
  });

  describe('System Reliability', () => {
    it('should handle errors gracefully with fallback', async () => {
      if (!runRealTests) return;

      // Test with a potentially problematic consultation
      const consultation = {
        question: '', // Empty question might cause issues
        hexagram: {
          number: 1,
          name: 'The Creative',
          lines: [9, 9, 9, 9, 9, 9],
          changingLines: [],
        },
      };

      // Should handle gracefully (either validate or fallback)
      try {
        const result = await generateConsultationInterpretation(consultation);
        // If it succeeds, should be valid
        expect(result).toBeDefined();
        expect(validateResponse(result)).toBe(true);
      } catch (error) {
        // Should get a validation error, not a system crash
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('empty');
      }
    }, 10000);
  });
});

// Helper test to verify API connectivity without making expensive calls
describe('API Connectivity Check', () => {
  it('should have required environment variables', () => {
    if (process.env.NODE_ENV === 'test') {
      // In test environment, just check structure
      expect(typeof process.env.OPENAI_API_KEY).toBe('string');
      expect(typeof process.env.NEXT_PUBLIC_SUPABASE_URL).toBe('string');
    }
  });
});
