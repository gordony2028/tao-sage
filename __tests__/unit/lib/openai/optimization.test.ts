/**
 * Tests for OpenAI optimization features
 * Validates cost reduction, model selection, and caching
 */

import {
  selectModel,
  calculateComplexity,
  CostTracker,
} from '@/lib/openai/client';
import {
  generateCompressedPrompt,
  generateStandardPrompt,
  getCacheKey,
  validateResponse,
  estimateTokens,
} from '@/lib/openai/prompts';

describe('OpenAI Optimization Features', () => {
  describe('Model Selection', () => {
    it('should select GPT-3.5 for simple consultations', () => {
      const complexity = 0.3;
      const model = selectModel(complexity);
      expect(model).toBe('gpt-3.5-turbo');
    });

    it('should select GPT-4 for complex consultations', () => {
      const complexity = 0.8;
      const model = selectModel(complexity);
      expect(model).toBe('gpt-4-turbo-preview');
    });

    it('should calculate low complexity for simple questions', () => {
      const question = 'What should I do today?';
      const changingLines: number[] = [];
      const complexity = calculateComplexity(question, changingLines);
      expect(complexity).toBeLessThan(0.5);
    });

    it('should calculate high complexity for philosophical questions', () => {
      const question =
        'What is my life purpose and spiritual destiny in this profound journey?';
      const changingLines = [1, 3, 5, 6];
      const complexity = calculateComplexity(question, changingLines);
      expect(complexity).toBeGreaterThan(0.7);
    });
  });

  describe('Prompt Optimization', () => {
    const hexagram = {
      number: 1,
      name: 'The Creative',
      lines: [9, 9, 9, 9, 9, 9],
      changingLines: [],
    };

    it('should generate optimized prompts that balance efficiency with quality', () => {
      const question = 'Career guidance?';
      const compressed = generateCompressedPrompt(hexagram, question);
      const standard = generateStandardPrompt(hexagram, question);

      // Optimized should be shorter but still rich in content
      expect(compressed.length).toBeLessThan(standard.length * 0.7);
      expect(compressed).toContain('Hexagram 1: The Creative');
      expect(compressed).toContain('Career guidance?');
      expect(compressed).toContain('rich, meaningful interpretation');
    });

    it('should truncate extremely long questions when necessary', () => {
      const longQuestion = 'A'.repeat(400); // Very long question
      const compressed = generateCompressedPrompt(hexagram, longQuestion);

      // Should be truncated only if extremely long (>300 chars)
      expect(compressed).toContain('...');
      expect(compressed.length).toBeLessThan(1000); // Still allows for rich content
    });

    it('should estimate tokens accurately', () => {
      const text = 'This is a test text for token estimation.';
      const tokens = estimateTokens(text);

      // Rough estimate: 1 token ≈ 4 characters
      const expectedTokens = Math.ceil(text.length / 4);
      expect(tokens).toBe(expectedTokens);
    });
  });

  describe('Cache Key Generation', () => {
    it('should generate consistent cache keys', () => {
      const hexagram = {
        number: 1,
        name: 'The Creative',
        lines: [9, 9, 9, 9, 9, 9],
        changingLines: [1, 3],
      };

      const key1 = getCacheKey(hexagram, 'What about my career?');
      const key2 = getCacheKey(hexagram, 'What about my career?');

      expect(key1).toBe(key2);
    });

    it('should normalize questions for better cache hits', () => {
      const hexagram = {
        number: 1,
        name: 'The Creative',
        lines: [9, 9, 9, 9, 9, 9],
        changingLines: [],
      };

      const key1 = getCacheKey(hexagram, 'What about my CAREER?');
      const key2 = getCacheKey(hexagram, 'what   about  my  career');

      expect(key1).toBe(key2);
    });

    it('should differentiate based on changing lines', () => {
      const hexagram1 = {
        number: 1,
        name: 'The Creative',
        lines: [9, 9, 9, 9, 9, 9],
        changingLines: [1],
      };

      const hexagram2 = {
        number: 1,
        name: 'The Creative',
        lines: [9, 9, 9, 9, 9, 9],
        changingLines: [2],
      };

      const key1 = getCacheKey(hexagram1, 'Same question');
      const key2 = getCacheKey(hexagram2, 'Same question');

      expect(key1).not.toBe(key2);
    });
  });

  describe('Response Validation', () => {
    it('should validate proper responses', () => {
      const goodResponse = {
        interpretation: 'This hexagram suggests wisdom and guidance...',
        guidance: 'Consider the path ahead with wisdom...',
      };

      expect(validateResponse(goodResponse)).toBe(true);
    });

    it('should reject responses with inappropriate content', () => {
      const badResponse = {
        interpretation: 'This is fake and I cannot predict anything.',
        guidance: 'Fortune telling is nonsense and superstition.',
      };

      expect(validateResponse(badResponse)).toBe(false);
    });

    it('should require wisdom-based language', () => {
      const emptyResponse = {
        interpretation: 'xyz', // Too short
        guidance: 'abc', // Too short
      };

      expect(validateResponse(emptyResponse)).toBe(false);

      // Should pass with wisdom indicators
      const wisdomResponse = {
        interpretation: 'This hexagram reveals deep wisdom about your path.',
        guidance: 'Ancient teachings suggest considering balance.',
      };
      expect(validateResponse(wisdomResponse)).toBe(true);
    });
  });

  describe('Cost Tracking', () => {
    let costTracker: CostTracker;

    beforeEach(() => {
      costTracker = new CostTracker();
    });

    it('should track costs accurately for GPT-3.5', () => {
      costTracker.addCost(1000, 'gpt-3.5-turbo');

      // GPT-3.5: $0.0005/1K input, $0.0015/1K output
      // Estimate: 60% input (600 tokens), 40% output (400 tokens)
      // Cost = (600 * 0.0005 + 400 * 0.0015) / 1000 = $0.0009
      const avgCost = costTracker.getAverageCost();
      expect(avgCost).toBeCloseTo(0.0009, 4);
    });

    it('should track costs accurately for GPT-4', () => {
      costTracker.addCost(1000, 'gpt-4-turbo-preview');

      // GPT-4: $0.01/1K input, $0.03/1K output
      // Estimate: 60% input (600 tokens), 40% output (400 tokens)
      // Cost = (600 * 0.01 + 400 * 0.03) / 1000 = $0.018
      const avgCost = costTracker.getAverageCost();
      expect(avgCost).toBeCloseTo(0.018, 3);
    });

    it('should calculate average cost across multiple consultations', () => {
      costTracker.addCost(500, 'gpt-3.5-turbo');
      costTracker.addCost(500, 'gpt-3.5-turbo');
      costTracker.addCost(1000, 'gpt-4-turbo-preview');

      const avgCost = costTracker.getAverageCost();
      const totalCost = costTracker.getTotalCost();

      expect(avgCost).toBeGreaterThan(0);
      expect(avgCost).toBeLessThan(0.05); // Target: <$0.05 average
      expect(totalCost).toBe(avgCost * 3);
    });

    it('should reset tracking when needed', () => {
      costTracker.addCost(1000, 'gpt-3.5-turbo');
      expect(costTracker.getTotalCost()).toBeGreaterThan(0);

      costTracker.reset();
      expect(costTracker.getTotalCost()).toBe(0);
      expect(costTracker.getAverageCost()).toBe(0);
    });
  });

  describe('Cost Optimization Targets', () => {
    it('should achieve <$0.05 average cost per consultation', () => {
      const costTracker = new CostTracker();

      // Simulate 10 consultations with smart model selection
      for (let i = 0; i < 10; i++) {
        const complexity = Math.random();
        const model = selectModel(complexity);
        const tokens = complexity > 0.7 ? 800 : 400; // Fewer tokens for simple
        costTracker.addCost(tokens, model);
      }

      const avgCost = costTracker.getAverageCost();
      expect(avgCost).toBeLessThan(0.05);
    });

    it('should achieve meaningful efficiency while maintaining quality', () => {
      const hexagram = {
        number: 1,
        name: 'The Creative',
        lines: [9, 9, 9, 9, 9, 9],
        changingLines: [1, 2, 3],
      };

      const question =
        'What should I focus on in my career development this year?';
      const compressed = generateCompressedPrompt(hexagram, question);
      const standard = generateStandardPrompt(hexagram, question);

      const compressedTokens = estimateTokens(compressed);
      const standardTokens = estimateTokens(standard);
      const reduction = 1 - compressedTokens / standardTokens;

      expect(reduction).toBeGreaterThan(0.2); // At least 20% efficiency gain
      expect(reduction).toBeLessThan(0.6); // But not at expense of quality
    });
  });
});
