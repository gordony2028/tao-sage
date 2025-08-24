/**
 * Smart prompt templates for OpenAI with 40-60% token reduction
 * Uses compressed format while maintaining quality
 */

import { Hexagram } from '@/types/iching';

/**
 * Generate compressed prompt for consultation
 * Reduces tokens by 40-60% through smart formatting
 */
export function generateCompressedPrompt(
  hexagram: Hexagram,
  question: string
): string {
  // Compress question to first 100 chars if longer
  const compressedQuestion =
    question.length > 100 ? question.substring(0, 97) + '...' : question;

  // Format changing lines efficiently
  const changes = hexagram.changingLines?.length
    ? hexagram.changingLines.join(',')
    : 'none';

  // Compressed prompt format (saves ~50% tokens)
  return `I Ching consultation:
H:${hexagram.number}/${hexagram.name}
Q:${compressedQuestion}
CL:${changes}

Provide interpretation:
1.Core meaning(50w)
2.Guidance(40w)
3.Action(30w)

Style:balanced,respectful,practical
Format:JSON`;
}

/**
 * Generate standard prompt (fallback for complex consultations)
 */
export function generateStandardPrompt(
  hexagram: Hexagram,
  question: string
): string {
  const changingLinesText = hexagram.changingLines?.length
    ? `The changing lines are: ${hexagram.changingLines.join(
        ', '
      )}, indicating transformation and movement in the situation.`
    : 'There are no changing lines, suggesting a stable situation.';

  return `You are a wise I Ching consultant providing culturally authentic and respectful guidance based on traditional Chinese philosophy.

The user asks: "${question}"

They have cast Hexagram ${hexagram.number}: ${hexagram.name}
${changingLinesText}

Please provide a personalized interpretation that:
1. Explains the core meaning of this hexagram in relation to their question
2. Offers practical guidance rooted in traditional wisdom
3. Suggests specific actions they can take
4. Maintains cultural authenticity and respect for the I Ching tradition

Respond in a JSON format with these fields:
- interpretation: The core meaning (max 150 words)
- guidance: Practical wisdom (max 120 words)
- practicalAdvice: Specific actions (max 100 words)
- culturalContext: Traditional significance (max 80 words)

Keep the tone balanced, respectful, and accessible to modern readers while honoring the ancient wisdom.`;
}

/**
 * System prompt for AI personality (cached and reused)
 */
export const SYSTEM_PROMPT = `You are Sage, an I Ching consultant combining 5,000 years of wisdom with modern understanding. 
Rules: Be concise, respectful, practical. Honor tradition while being accessible. 
Output: Always valid JSON. Focus on actionable guidance.`;

/**
 * Generate prompt based on complexity
 * Automatically selects compressed vs standard format
 */
export function generateAdaptivePrompt(
  hexagram: Hexagram,
  question: string,
  complexity: number
): string {
  // Use compressed format for simple consultations (saves tokens)
  if (complexity < 0.5) {
    return generateCompressedPrompt(hexagram, question);
  }
  // Use standard format for complex consultations (better quality)
  return generateStandardPrompt(hexagram, question);
}

/**
 * Format cached response key for deduplication
 */
export function getCacheKey(hexagram: Hexagram, question: string): string {
  // Normalize question for better cache hits
  const normalized = question
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Create deterministic key
  const changingLines = hexagram.changingLines?.join('-') || 'none';
  return `${hexagram.number}-${changingLines}-${hashString(normalized)}`;
}

/**
 * Simple string hash for cache keys
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Validate AI response for cultural sensitivity
 */
export function validateResponse(response: any): boolean {
  if (!response || typeof response !== 'object') return false;

  // Check required fields
  const requiredFields = ['interpretation', 'guidance'];
  for (const field of requiredFields) {
    if (!response[field] || typeof response[field] !== 'string') {
      return false;
    }
  }

  // Check for inappropriate content
  const inappropriateTerms = [
    'fortune telling',
    'predict future',
    'guarantee',
    'magic',
  ];
  const responseText = JSON.stringify(response).toLowerCase();

  for (const term of inappropriateTerms) {
    if (responseText.includes(term)) {
      return false;
    }
  }

  // Check for respectful language
  const respectfulTerms = ['wisdom', 'guidance', 'suggests', 'consider', 'may'];
  let respectScore = 0;
  for (const term of respectfulTerms) {
    if (responseText.includes(term)) respectScore++;
  }

  return respectScore >= 2; // At least 2 respectful terms
}

/**
 * Token estimation for cost tracking
 */
export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}
