/**
 * OpenAI I Ching Consultation Service
 *
 * Generates culturally authentic AI interpretations of I Ching hexagrams
 * while maintaining respectful representation of Chinese wisdom traditions.
 */

import { openai } from './client';
import type { AIInterpretation } from '@/types/iching';

/**
 * Consultation input for AI interpretation
 */
export interface ConsultationInput {
  question: string;
  hexagram: {
    number: number;
    name: string;
    lines: number[];
    changingLines: number[];
  };
}

/**
 * Validates consultation input before processing
 */
function validateConsultationInput(consultation: ConsultationInput): void {
  // Validate question
  if (!consultation.question || consultation.question.trim().length === 0) {
    throw new Error('Question cannot be empty');
  }

  // Validate hexagram number
  if (consultation.hexagram.number < 1 || consultation.hexagram.number > 64) {
    throw new Error('Hexagram number must be between 1 and 64');
  }

  // Validate hexagram name
  if (
    !consultation.hexagram.name ||
    consultation.hexagram.name.trim().length === 0
  ) {
    throw new Error('Hexagram name cannot be empty');
  }

  // Validate lines array
  if (
    !Array.isArray(consultation.hexagram.lines) ||
    consultation.hexagram.lines.length !== 6
  ) {
    throw new Error('Hexagram must have exactly 6 lines');
  }

  // Validate line values
  const validLineValues = [6, 7, 8, 9];
  for (const line of consultation.hexagram.lines) {
    if (!validLineValues.includes(line)) {
      throw new Error(`Invalid line value: ${line}. Must be 6, 7, 8, or 9`);
    }
  }

  // Validate changing lines
  if (!Array.isArray(consultation.hexagram.changingLines)) {
    throw new Error('Changing lines must be an array');
  }

  for (const linePosition of consultation.hexagram.changingLines) {
    if (linePosition < 1 || linePosition > 6) {
      throw new Error('Changing line positions must be between 1 and 6');
    }
  }
}

/**
 * Formats a culturally sensitive prompt for AI interpretation
 */
export function formatHexagramPrompt(consultation: ConsultationInput): string {
  const { question, hexagram } = consultation;
  const hasChangingLines = hexagram.changingLines.length > 0;

  let prompt = `You are a respectful and knowledgeable I Ching interpreter, well-versed in traditional Chinese philosophy and the cultural significance of this ancient divination system. Please provide a culturally authentic interpretation of the following I Ching consultation.

**Question:** "${question}"

**Hexagram:** Hexagram ${hexagram.number} - ${hexagram.name}

**Line Structure:** ${hexagram.lines
    .map((line, index) => {
      const position = index + 1;
      const isChanging = hexagram.changingLines.includes(position);
      const lineType =
        line === 6
          ? 'old yin'
          : line === 7
            ? 'young yang'
            : line === 8
              ? 'young yin'
              : 'old yang';
      return `Line ${position}: ${line} (${lineType}${
        isChanging ? ', changing' : ''
      })`;
    })
    .join('\n')}`;

  if (hasChangingLines) {
    prompt += `\n\n**Changing Lines:** changing lines: ${hexagram.changingLines.join(
      ', '
    )} - These lines indicate transformation and movement in the situation.`;
  }

  prompt += `

Please provide your interpretation in JSON format with the following structure:
{
  "interpretation": "Main interpretation of the hexagram in relation to the question",
  "guidance": "Practical guidance based on traditional I Ching wisdom",
  "practicalAdvice": "Actionable advice for the current situation",
  "culturalContext": "Brief explanation of the hexagram's significance in Chinese philosophy and traditional wisdom"
}

**Important Guidelines:**
- CRITICAL: Base your interpretation ONLY on Hexagram ${hexagram.number} - ${hexagram.name}. Do not reference other hexagrams unless specifically relevant to transformation.
- Maintain deep respect for Chinese culture and traditional wisdom
- Provide culturally authentic interpretations based on traditional I Ching meanings for this specific hexagram
- Avoid cultural appropriation by acknowledging the source of this wisdom
- Connect the ancient wisdom to modern life in a respectful way
- If changing lines are present, emphasize themes of transformation and change within the context of Hexagram ${hexagram.number}
- Keep interpretations positive and constructive while being honest about challenges
- Focus on personal growth, decision-making, and life guidance
- Use language that honors the spiritual and philosophical depth of the I Ching
- Always begin your interpretation by confirming you are interpreting Hexagram ${hexagram.number} - ${hexagram.name}

Please respond only with the JSON object, no additional text.`;

  return prompt;
}

/**
 * Generates AI interpretation for an I Ching consultation
 *
 * @param consultation The consultation input with question and hexagram
 * @returns Promise resolving to AI-generated interpretation
 * @throws Error if validation fails or API call fails
 */
export async function generateConsultationInterpretation(
  consultation: ConsultationInput
): Promise<AIInterpretation> {
  // Validate input before processing
  validateConsultationInput(consultation);

  try {
    // Format the prompt with cultural sensitivity guidelines
    const prompt = formatHexagramPrompt(consultation);

    // Call OpenAI API for interpretation
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7, // Balanced creativity and consistency
      max_tokens: 1000, // Reasonable limit for interpretation
      response_format: { type: 'json_object' },
    });

    // Extract and parse the response
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response received from OpenAI API');
    }

    // Parse JSON response
    let parsedResponse: AIInterpretation;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
    }

    // Validate response structure
    if (!parsedResponse.interpretation) {
      throw new Error('AI response missing required interpretation field');
    }

    // Return the structured interpretation
    const result: AIInterpretation = {
      interpretation: parsedResponse.interpretation,
    };

    if (parsedResponse.guidance) {
      result.guidance = parsedResponse.guidance;
    }
    if (parsedResponse.practicalAdvice) {
      result.practicalAdvice = parsedResponse.practicalAdvice;
    }
    if (parsedResponse.culturalContext) {
      result.culturalContext = parsedResponse.culturalContext;
    }

    return result;
  } catch (error) {
    // Re-throw with context for debugging
    if (error instanceof Error) {
      throw new Error(`OpenAI consultation failed: ${error.message}`);
    }
    throw new Error('OpenAI consultation failed: Unknown error');
  }
}
