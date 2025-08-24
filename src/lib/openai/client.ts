// Import OpenAI shim for Node environment
import 'openai/shims/node';
import { createOpenAI } from '@ai-sdk/openai';
import OpenAI from 'openai';

/**
 * OpenAI client with smart model selection and cost optimization
 */

// Traditional OpenAI client for compatibility
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey && process.env.NODE_ENV !== 'test') {
  throw new Error('Missing OpenAI API key');
}

// Legacy client for existing code
export const openai = new OpenAI({
  apiKey: apiKey || 'test-key',
  // Allow browser-like environment in tests
  dangerouslyAllowBrowser: process.env.NODE_ENV === 'test',
});

// Vercel AI SDK client for streaming
export const openaiStream = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Model selection strategy based on complexity scoring
 * Returns the appropriate model for the given complexity
 */
export function selectModel(complexity: number): string {
  // Use GPT-4 for high complexity (>0.7), GPT-3.5 for lower
  // This reduces costs by ~75% for simpler consultations
  if (complexity > 0.7) {
    return 'gpt-4-turbo-preview';
  }
  return 'gpt-3.5-turbo';
}

/**
 * Calculate complexity score for a consultation
 * Based on question length, hexagram complexity, and changing lines
 */
export function calculateComplexity(
  question: string,
  changingLines: number[]
): number {
  let score = 0;

  // Question length factor (longer = more complex)
  const questionWords = question.split(' ').length;
  if (questionWords > 20) score += 0.3;
  else if (questionWords > 10) score += 0.2;
  else score += 0.1;

  // Changing lines factor (more changes = more complex)
  if (changingLines.length >= 4) score += 0.4;
  else if (changingLines.length >= 2) score += 0.3;
  else if (changingLines.length >= 1) score += 0.2;
  else score += 0.1;

  // Question type factor (philosophical = more complex)
  const complexKeywords = [
    'purpose',
    'meaning',
    'destiny',
    'spiritual',
    'profound',
    'deep',
  ];
  const hasComplexKeywords = complexKeywords.some(keyword =>
    question.toLowerCase().includes(keyword)
  );
  if (hasComplexKeywords) score += 0.3;

  return Math.min(score, 1.0); // Cap at 1.0
}

/**
 * Cost tracking for monitoring API usage
 */
export class CostTracker {
  private static instance: CostTracker;
  private costs: number[] = [];

  static getInstance(): CostTracker {
    if (!CostTracker.instance) {
      CostTracker.instance = new CostTracker();
    }
    return CostTracker.instance;
  }

  addCost(tokens: number, model: string): void {
    // Pricing per 1K tokens (as of 2024)
    const pricing = {
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
      'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
    };

    const modelPricing =
      pricing[model as keyof typeof pricing] || pricing['gpt-3.5-turbo'];
    // Estimate: 60% input, 40% output tokens
    const estimatedCost =
      (tokens * 0.6 * modelPricing.input + tokens * 0.4 * modelPricing.output) /
      1000;

    this.costs.push(estimatedCost);
  }

  getAverageCost(): number {
    if (this.costs.length === 0) return 0;
    return this.costs.reduce((a, b) => a + b, 0) / this.costs.length;
  }

  getTotalCost(): number {
    return this.costs.reduce((a, b) => a + b, 0);
  }

  reset(): void {
    this.costs = [];
  }
}

// Export cost tracker instance
export const costTracker = CostTracker.getInstance();
