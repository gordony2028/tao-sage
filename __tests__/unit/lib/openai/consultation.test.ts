import {
  generateConsultationInterpretation,
  formatHexagramPrompt,
} from '@/lib/openai/consultation';

// Mock OpenAI client
jest.mock('@/lib/openai/client', () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

describe('OpenAI Consultation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateConsultationInterpretation', () => {
    it('should generate interpretation for valid consultation', async () => {
      const mockOpenAI = require('@/lib/openai/client').openai;
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                interpretation:
                  'The Creative represents the primal power of the universe...',
                guidance:
                  'This is a time for leadership and creative action...',
                practicalAdvice:
                  'Focus on new beginnings and take initiative...',
                culturalContext:
                  'In traditional Chinese philosophy, this hexagram represents heaven...',
              }),
            },
          },
        ],
      });

      const consultation = {
        question: 'What should I focus on in my career?',
        hexagram: {
          number: 1,
          name: 'The Creative',
          lines: [9, 9, 9, 9, 9, 9],
          changingLines: [],
        },
      };

      const result = await generateConsultationInterpretation(consultation);

      expect(result).toHaveProperty('interpretation');
      expect(result).toHaveProperty('guidance');
      expect(result).toHaveProperty('practicalAdvice');
      expect(result).toHaveProperty('culturalContext');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
    });

    it('should handle OpenAI API errors gracefully', async () => {
      const mockOpenAI = require('@/lib/openai/client').openai;
      mockOpenAI.chat.completions.create.mockRejectedValue(
        new Error('API Error')
      );

      const consultation = {
        question: 'Test question',
        hexagram: {
          number: 1,
          name: 'The Creative',
          lines: [9, 9, 9, 9, 9, 9],
          changingLines: [],
        },
      };

      await expect(
        generateConsultationInterpretation(consultation)
      ).rejects.toThrow('API Error');
    });

    it('should validate consultation input', async () => {
      const invalidConsultation = {
        question: '', // Empty question
        hexagram: {
          number: 0, // Invalid hexagram number
          name: '',
          lines: [1, 2, 3], // Invalid lines
          changingLines: [],
        },
      };

      await expect(
        generateConsultationInterpretation(invalidConsultation)
      ).rejects.toThrow();
    });
  });

  describe('formatHexagramPrompt', () => {
    it('should format prompt with hexagram details', () => {
      const consultation = {
        question: 'What should I focus on?',
        hexagram: {
          number: 1,
          name: 'The Creative',
          lines: [9, 9, 9, 9, 9, 9],
          changingLines: [],
        },
      };

      const prompt = formatHexagramPrompt(consultation);

      expect(prompt).toContain('What should I focus on?');
      expect(prompt).toContain('The Creative');
      expect(prompt).toContain('Hexagram 1');
      expect(prompt).toContain('culturally authentic');
      expect(prompt).toContain('respectful');
    });

    it('should include changing lines in prompt when present', () => {
      const consultation = {
        question: 'Career guidance needed',
        hexagram: {
          number: 3,
          name: 'Difficulty at the Beginning',
          lines: [6, 7, 8, 9, 7, 8],
          changingLines: [1, 4],
        },
      };

      const prompt = formatHexagramPrompt(consultation);

      expect(prompt).toContain('changing lines: 1, 4');
      expect(prompt).toContain('transformation');
    });

    it('should emphasize cultural sensitivity', () => {
      const consultation = {
        question: 'Life guidance',
        hexagram: {
          number: 2,
          name: 'The Receptive',
          lines: [8, 8, 8, 8, 8, 8],
          changingLines: [],
        },
      };

      const prompt = formatHexagramPrompt(consultation);

      expect(prompt).toContain('Chinese philosophy');
      expect(prompt).toContain('traditional wisdom');
      expect(prompt).toContain('respectful');
      expect(prompt).toContain('authentic');
    });
  });
});
