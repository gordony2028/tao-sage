/**
 * Comprehensive I Ching Consultation Service
 *
 * Orchestrates the complete consultation flow:
 * 1. Generate hexagram using traditional coin-casting
 * 2. Get AI interpretation with cultural sensitivity
 * 3. Save consultation to database with proper metadata
 */

import { generateHexagram, getHexagramName } from '@/lib/iching/hexagram';
import { generateConsultationInterpretation } from '@/lib/openai/consultation';
import { saveConsultation } from '@/lib/supabase/consultations';
import type {
  Consultation,
  ConsultationContext,
  Hexagram,
  LineValue,
} from '@/types/iching';

/**
 * Input for creating a new consultation
 */
export interface CreateConsultationInput {
  /** User's question for the I Ching */
  question: string;
  /** User ID for database storage */
  userId: string;
  /** Optional pre-generated hexagram (if provided by UI) */
  hexagram?: Hexagram;
  /** Optional metadata for tracking */
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    method?: 'digital_coins' | 'manual_entry';
  };
}

/**
 * Result of a complete consultation
 */
export interface ConsultationResult {
  /** Complete consultation record */
  consultation: Consultation;
  /** Generated hexagram with all data */
  hexagram: Hexagram;
  /** AI-generated interpretation */
  interpretation: {
    interpretation: string;
    guidance?: string;
    practicalAdvice?: string;
    culturalContext?: string;
  };
}

/**
 * Creates a complete I Ching consultation
 *
 * This is the main service function that orchestrates the entire
 * consultation process following traditional I Ching practices
 * enhanced with modern AI interpretation.
 *
 * @param input Consultation input with question and user info
 * @returns Promise resolving to complete consultation result
 */
export async function createConsultation(
  input: CreateConsultationInput
): Promise<ConsultationResult> {
  const { question, userId, hexagram: providedHexagram, metadata = {} } = input;

  // Validate input
  if (!question || question.trim().length === 0) {
    throw new Error('Question cannot be empty');
  }
  if (!userId || userId.trim().length === 0) {
    throw new Error('User ID is required');
  }

  try {
    // Step 1: Use provided hexagram or generate new one
    let hexagram: Hexagram;

    if (providedHexagram) {
      // Use hexagram provided by UI (already cast)
      if (process.env.NODE_ENV === 'development') {
        console.log('=== USING PROVIDED HEXAGRAM ===');
        console.log('UI Hexagram:', {
          number: providedHexagram.number,
          name: providedHexagram.name,
          changingLines: providedHexagram.changingLines,
        });
      }
      hexagram = providedHexagram;
    } else {
      // Generate hexagram using traditional coin-casting method
      const generatedHexagram = generateHexagram();
      const hexagramName = getHexagramName(generatedHexagram.number);

      hexagram = {
        number: generatedHexagram.number,
        name: hexagramName,
        lines: generatedHexagram.lines,
        changingLines: generatedHexagram.changingLines,
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('=== GENERATED NEW HEXAGRAM ===');
        console.log('Generated:', {
          number: hexagram.number,
          name: hexagram.name,
          changingLines: hexagram.changingLines,
        });
      }
    }

    // Step 2: Get AI interpretation with cultural sensitivity
    if (process.env.NODE_ENV === 'development') {
      console.log('=== CONSULTATION SERVICE DEBUG ===');
      console.log('Sending to OpenAI - Hexagram:', {
        number: hexagram.number,
        name: hexagram.name,
        changingLines: hexagram.changingLines,
      });
    }

    const interpretation = await generateConsultationInterpretation({
      question,
      hexagram: {
        number: hexagram.number,
        name: hexagram.name,
        lines: hexagram.lines,
        changingLines: hexagram.changingLines,
      },
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('=== INTERPRETATION RECEIVED ===');
      console.log(
        'Interpretation for Hexagram:',
        hexagram.number,
        hexagram.name
      );
      console.log(
        'First 100 chars:',
        interpretation.interpretation?.substring(0, 100)
      );
    }

    // Step 3: Prepare consultation data for database
    const interpretationData: {
      interpretation: string;
      guidance?: string;
      practicalAdvice?: string;
      culturalContext?: string;
    } = {
      interpretation: interpretation.interpretation,
    };

    if (interpretation.guidance) {
      interpretationData.guidance = interpretation.guidance;
    }
    if (interpretation.practicalAdvice) {
      interpretationData.practicalAdvice = interpretation.practicalAdvice;
    }
    if (interpretation.culturalContext) {
      interpretationData.culturalContext = interpretation.culturalContext;
    }

    const consultationData = {
      user_id: userId,
      question: question.trim(),
      hexagram_number: hexagram.number,
      hexagram_name: hexagram.name,
      lines: hexagram.lines,
      changing_lines: hexagram.changingLines,
      interpretation: interpretationData,
      consultation_method: metadata.method || 'digital_coins',
      ip_address: metadata.ipAddress || null,
      user_agent: metadata.userAgent || null,
      status: 'active' as const,
      tags: [],
      notes: null,
    };

    // Step 4: Save to database
    const savedConsultation = await saveConsultation(consultationData);

    // Step 5: Transform database result to application format
    const consultation: Consultation = {
      id: savedConsultation.id,
      userId: savedConsultation.user_id,
      question: savedConsultation.question,
      hexagram: {
        number: savedConsultation.hexagram_number,
        name: savedConsultation.hexagram_name,
        lines: savedConsultation.lines as [
          LineValue,
          LineValue,
          LineValue,
          LineValue,
          LineValue,
          LineValue,
        ],
        changingLines: savedConsultation.changing_lines,
      },
      interpretation: savedConsultation.interpretation,
      metadata: {
        method: savedConsultation.consultation_method as
          | 'digital_coins'
          | 'manual_entry',
        ...(savedConsultation.ip_address && {
          ipAddress: savedConsultation.ip_address,
        }),
        ...(savedConsultation.user_agent && {
          userAgent: savedConsultation.user_agent,
        }),
      },
      createdAt: new Date(savedConsultation.created_at),
      updatedAt: new Date(savedConsultation.updated_at),
      status: savedConsultation.status,
      tags: savedConsultation.tags,
      ...(savedConsultation.notes && { notes: savedConsultation.notes }),
    };

    return {
      consultation,
      hexagram,
      interpretation,
    };
  } catch (error) {
    // Enhanced error handling with context
    if (error instanceof Error) {
      throw new Error(`Consultation creation failed: ${error.message}`);
    }
    throw new Error('Consultation creation failed: Unknown error');
  }
}

/**
 * Validates a consultation context for AI processing
 */
export function validateConsultationContext(
  context: ConsultationContext
): void {
  if (!context.question || context.question.trim().length === 0) {
    throw new Error('Question cannot be empty');
  }

  if (!context.hexagram) {
    throw new Error('Hexagram is required');
  }

  if (context.hexagram.number < 1 || context.hexagram.number > 64) {
    throw new Error('Invalid hexagram number');
  }

  if (!context.hexagram.lines || context.hexagram.lines.length !== 6) {
    throw new Error('Hexagram must have exactly 6 lines');
  }

  if (!context.timestamp || !(context.timestamp instanceof Date)) {
    throw new Error('Valid timestamp is required');
  }
}

/**
 * Helper function to format consultation for display
 */
export function formatConsultationSummary(consultation: Consultation): string {
  const date = consultation.createdAt.toLocaleDateString();
  const time = consultation.createdAt.toLocaleTimeString();
  const changingLinesText =
    consultation.hexagram.changingLines.length > 0
      ? ` with changing lines: ${consultation.hexagram.changingLines.join(
          ', '
        )}`
      : '';

  return `${date} ${time}: "${consultation.question}" - Hexagram ${consultation.hexagram.number} (${consultation.hexagram.name})${changingLinesText}`;
}
