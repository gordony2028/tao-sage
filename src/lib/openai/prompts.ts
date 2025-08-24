/**
 * Smart prompt templates for OpenAI with 40-60% token reduction
 * Uses compressed format while maintaining quality
 */

import { Hexagram } from '@/types/iching';

/**
 * Generate optimized prompt for consultation
 * Balances efficiency with rich, meaningful content
 */
export function generateCompressedPrompt(
  hexagram: Hexagram,
  question: string
): string {
  // Keep full question for quality (only truncate if extremely long)
  const processedQuestion =
    question.length > 300 ? question.substring(0, 297) + '...' : question;

  // Format changing lines efficiently
  const changes = hexagram.changingLines?.length
    ? hexagram.changingLines.join(',')
    : 'none';

  // Optimized prompt that maintains quality while saving tokens
  return `I Ching consultation for: "${processedQuestion}"

Hexagram ${hexagram.number}: ${hexagram.name}
Changing lines: ${changes}

Provide a rich, meaningful interpretation with:

1. Core Meaning: Deep insight into what this hexagram reveals about their situation (100-150 words)
2. Ancient Wisdom: Traditional teaching and its modern relevance (80-120 words)  
3. Practical Guidance: Specific, actionable steps they can take (60-100 words)
4. Timing: When and how to act on this guidance (40-60 words)

Style: Wise, respectful, profound yet accessible
Tone: Balance ancient wisdom with modern practicality
Format: Flat JSON object with these exact fields:
{
  "interpretation": "Combined core meaning text (string)",
  "ancientWisdom": "Traditional teaching text (string)", 
  "guidance": "Practical guidance text (string)",
  "timing": "Timing advice text (string)"
}`;
}

/**
 * Generate comprehensive prompt for complex consultations
 * Prioritizes depth and richness of content
 */
export function generateStandardPrompt(
  hexagram: Hexagram,
  question: string
): string {
  const changingLinesText = hexagram.changingLines?.length
    ? `The changing lines are: ${hexagram.changingLines.join(
        ', '
      )}, indicating transformation and movement in the situation.`
    : 'There are no changing lines, suggesting a stable situation with enduring patterns.';

  return `You are a master I Ching consultant, drawing from 5,000 years of Chinese wisdom to provide profound, transformative guidance.

The seeker asks: "${question}"

They have cast Hexagram ${hexagram.number}: ${hexagram.name}
${changingLinesText}

This is a complex consultation requiring deep insight. Provide a comprehensive interpretation with:

1. **Core Meaning**: Reveal the deepest truth this hexagram holds about their situation. What is the universe trying to teach them? (150-200 words)

2. **Ancient Wisdom**: Share the traditional teachings of this hexagram. How did the sages understand this pattern? What timeless principles apply? (120-160 words)

3. **Personal Guidance**: Offer specific, actionable wisdom tailored to their question. What should they do, and why? (100-140 words)

4. **Spiritual Insight**: What deeper spiritual lesson or growth opportunity does this situation offer? (80-120 words)

5. **Timing & Flow**: When should they act? How should they move with the natural rhythm of change? (60-100 words)

6. **Cultural Context**: Honor the traditional significance while making it relevant to modern life (60-80 words)

Speak with the voice of ancient wisdom made accessible. Be profound yet practical, mystical yet grounded. This person seeks genuine transformation, not surface answers.

IMPORTANT: Respond with a flat JSON object using exactly these field names:

{
  "interpretation": "Core meaning text (150-200 words)",
  "ancientWisdom": "Traditional teaching text (120-160 words)",
  "guidance": "Personal guidance text (100-140 words)", 
  "spiritualInsight": "Spiritual lesson text (80-120 words)",
  "timing": "Timing and flow text (60-100 words)",
  "culturalContext": "Cultural significance text (60-80 words)"
}

Each field must be a single string, not an object or nested structure.`;
}

/**
 * System prompt for AI personality (cached and reused)
 */
export const SYSTEM_PROMPT = `You are Sage, an I Ching consultant combining 5,000 years of wisdom with modern understanding. 

Critical Rules:
- Always respond with valid JSON only - no explanatory text before or after
- Use flat JSON structure - each field must be a string, never an object
- Be respectful, practical, and honor I Ching tradition
- Focus on actionable guidance while maintaining ancient wisdom
- Include all requested fields in your response`;

/**
 * Generate prompt based on complexity
 * Balances cost efficiency with content quality
 */
export function generateAdaptivePrompt(
  hexagram: Hexagram,
  question: string,
  complexity: number
): string {
  // Use optimized format for simple consultations (still rich but efficient)
  if (complexity < 0.6) {
    return generateCompressedPrompt(hexagram, question);
  }
  // Use comprehensive format for complex consultations (maximum depth)
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
 * Validate AI response for cultural sensitivity and content quality
 */
export function validateResponse(response: any): boolean {
  if (!response || typeof response !== 'object') return false;

  // Check for minimal required content (flexible for different response formats)
  const hasContent =
    (response.interpretation && response.interpretation.length > 20) ||
    (response.guidance && response.guidance.length > 20) ||
    (response.ancientWisdom && response.ancientWisdom.length > 20);

  if (!hasContent) return false;

  // Only check for obviously inappropriate content (not overly restrictive)
  const responseText = JSON.stringify(response).toLowerCase();
  const problematicTerms = [
    'this is fake',
    'i cannot predict',
    'fortune telling is nonsense',
    'superstition',
  ];

  for (const term of problematicTerms) {
    if (responseText.includes(term)) {
      return false;
    }
  }

  // Require at least some wisdom-based language (but be flexible)
  const wisdomIndicators = [
    'wisdom',
    'guidance',
    'suggests',
    'consider',
    'may',
    'ancient',
    'teaches',
    'insight',
    'understand',
    'path',
    'journey',
    'balance',
    'harmony',
    'flow',
    'timing',
    'nature',
    'reflects',
    'reveals',
  ];

  let wisdomScore = 0;
  for (const term of wisdomIndicators) {
    if (responseText.includes(term)) wisdomScore++;
  }

  return wisdomScore >= 1; // Just need some wisdom language, not overly strict
}

/**
 * Token estimation for cost tracking
 */
export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}
