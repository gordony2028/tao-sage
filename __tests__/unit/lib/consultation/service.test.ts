import {
  createConsultation,
  validateConsultationContext,
  formatConsultationSummary,
} from '@/lib/consultation/service';

// Mock the dependencies
jest.mock('@/lib/iching/hexagram', () => ({
  generateHexagram: jest.fn(() => ({
    number: 1,
    lines: [9, 9, 9, 9, 9, 9],
    changingLines: [],
  })),
  getHexagramName: jest.fn(() => 'The Creative'),
}));

jest.mock('@/lib/openai/consultation', () => ({
  generateConsultationInterpretation: jest.fn(() =>
    Promise.resolve({
      interpretation:
        'The Creative represents the primal power of the universe...',
      guidance: 'This is a time for leadership and creative action...',
      practicalAdvice: 'Focus on new beginnings and take initiative...',
      culturalContext:
        'In traditional Chinese philosophy, this hexagram represents heaven...',
    })
  ),
}));

jest.mock('@/lib/supabase/consultations', () => ({
  saveConsultation: jest.fn(() =>
    Promise.resolve({
      id: 'test-consultation-id',
      user_id: 'test-user-id',
      question: 'What should I focus on in my career?',
      hexagram_number: 1,
      hexagram_name: 'The Creative',
      lines: [9, 9, 9, 9, 9, 9],
      changing_lines: [],
      interpretation: {
        interpretation:
          'The Creative represents the primal power of the universe...',
        guidance: 'This is a time for leadership and creative action...',
        practicalAdvice: 'Focus on new beginnings and take initiative...',
        culturalContext:
          'In traditional Chinese philosophy, this hexagram represents heaven...',
      },
      consultation_method: 'digital_coins',
      ip_address: null,
      user_agent: null,
      status: 'active',
      tags: [],
      notes: null,
      created_at: '2024-01-01T12:00:00Z',
      updated_at: '2024-01-01T12:00:00Z',
    })
  ),
}));

describe('Consultation Service Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createConsultation', () => {
    it('should create a complete consultation successfully', async () => {
      const input = {
        question: 'What should I focus on in my career?',
        userId: 'test-user-id',
        metadata: {
          method: 'digital_coins' as const,
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent',
        },
      };

      const result = await createConsultation(input);

      expect(result).toHaveProperty('consultation');
      expect(result).toHaveProperty('hexagram');
      expect(result).toHaveProperty('interpretation');

      expect(result.consultation.question).toBe(input.question);
      expect(result.consultation.userId).toBe(input.userId);
      expect(result.hexagram.number).toBe(1);
      expect(result.hexagram.name).toBe('The Creative');
      expect(result.interpretation.interpretation).toContain('Creative');
    });

    it('should validate input parameters', async () => {
      const invalidInput = {
        question: '', // Empty question
        userId: 'test-user-id',
      };

      await expect(createConsultation(invalidInput)).rejects.toThrow(
        'Question cannot be empty'
      );

      const noUserInput = {
        question: 'Valid question',
        userId: '', // Empty user ID
      };

      await expect(createConsultation(noUserInput)).rejects.toThrow(
        'User ID is required'
      );
    });

    it('should handle errors gracefully', async () => {
      const mockSave = require('@/lib/supabase/consultations').saveConsultation;
      mockSave.mockRejectedValueOnce(new Error('Database error'));

      const input = {
        question: 'Test question',
        userId: 'test-user-id',
      };

      await expect(createConsultation(input)).rejects.toThrow(
        'Consultation creation failed: Database error'
      );
    });
  });

  describe('validateConsultationContext', () => {
    it('should validate consultation context successfully', () => {
      const validContext = {
        question: 'Valid question',
        hexagram: {
          number: 1,
          name: 'The Creative',
          lines: [9, 9, 9, 9, 9, 9],
          changingLines: [],
        },
        timestamp: new Date(),
        method: 'digital_coins' as const,
      };

      expect(() => validateConsultationContext(validContext)).not.toThrow();
    });

    it('should throw for invalid context', () => {
      const invalidContext = {
        question: '', // Empty question
        hexagram: {
          number: 1,
          name: 'The Creative',
          lines: [9, 9, 9, 9, 9, 9],
          changingLines: [],
        },
        timestamp: new Date(),
        method: 'digital_coins' as const,
      };

      expect(() => validateConsultationContext(invalidContext)).toThrow(
        'Question cannot be empty'
      );
    });
  });

  describe('formatConsultationSummary', () => {
    it('should format consultation summary correctly', () => {
      const consultation = {
        id: 'test-id',
        userId: 'test-user-id',
        question: 'What should I focus on?',
        hexagram: {
          number: 1,
          name: 'The Creative',
          lines: [9, 9, 9, 9, 9, 9] as [
            number,
            number,
            number,
            number,
            number,
            number,
          ],
          changingLines: [],
        },
        interpretation: {
          interpretation: 'Test interpretation',
        },
        metadata: {
          method: 'digital_coins' as const,
        },
        createdAt: new Date('2024-01-01T12:00:00Z'),
        updatedAt: new Date('2024-01-01T12:00:00Z'),
        status: 'active' as const,
        tags: [],
      };

      const summary = formatConsultationSummary(consultation);

      expect(summary).toContain('What should I focus on?');
      expect(summary).toContain('Hexagram 1');
      expect(summary).toContain('The Creative');
    });

    it('should include changing lines when present', () => {
      const consultation = {
        id: 'test-id',
        userId: 'test-user-id',
        question: 'Career guidance',
        hexagram: {
          number: 3,
          name: 'Difficulty at the Beginning',
          lines: [6, 7, 8, 9, 7, 8] as [
            number,
            number,
            number,
            number,
            number,
            number,
          ],
          changingLines: [1, 4],
        },
        interpretation: {
          interpretation: 'Test interpretation',
        },
        metadata: {
          method: 'digital_coins' as const,
        },
        createdAt: new Date('2024-01-01T12:00:00Z'),
        updatedAt: new Date('2024-01-01T12:00:00Z'),
        status: 'active' as const,
        tags: [],
      };

      const summary = formatConsultationSummary(consultation);

      expect(summary).toContain('changing lines: 1, 4');
    });
  });
});
