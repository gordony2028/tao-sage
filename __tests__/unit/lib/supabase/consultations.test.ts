import {
  saveConsultation,
  getUserConsultations,
  getConsultationById,
} from '@/lib/supabase/consultations';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(),
          })),
        })),
        single: jest.fn(),
      })),
    })),
  },
}));

describe('Supabase Consultations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveConsultation', () => {
    it('should save consultation successfully', async () => {
      const mockSupabase = require('@/lib/supabase/client').supabase;
      const mockSingle = jest.fn().mockResolvedValue({
        data: { id: '123', created_at: '2024-01-01' },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: mockSingle,
          }),
        }),
      });

      const consultationData = {
        user_id: 'user-123',
        question: 'What should I focus on?',
        hexagram_number: 1,
        hexagram_name: 'The Creative',
        lines: [9, 9, 9, 9, 9, 9],
        changing_lines: [],
        interpretation: {
          interpretation: 'Test interpretation',
          guidance: 'Test guidance',
          practicalAdvice: 'Test advice',
          culturalContext: 'Test context',
        },
      };

      const result = await saveConsultation(consultationData);

      expect(result).toHaveProperty('id', '123');
      expect(mockSupabase.from).toHaveBeenCalledWith('consultations');
    });

    it('should handle database errors', async () => {
      const mockSupabase = require('@/lib/supabase/client').supabase;
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: mockSingle,
          }),
        }),
      });

      const consultationData = {
        user_id: 'user-123',
        question: 'Test question',
        hexagram_number: 1,
        hexagram_name: 'The Creative',
        lines: [9, 9, 9, 9, 9, 9],
        changing_lines: [],
        interpretation: { interpretation: 'Test' },
      };

      await expect(saveConsultation(consultationData)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getUserConsultations', () => {
    it('should retrieve user consultations', async () => {
      const mockSupabase = require('@/lib/supabase/client').supabase;
      const mockLimit = jest.fn().mockResolvedValue({
        data: [
          { id: '1', question: 'Test 1', created_at: '2024-01-01' },
          { id: '2', question: 'Test 2', created_at: '2024-01-02' },
        ],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: mockLimit,
            }),
          }),
        }),
      });

      const consultations = await getUserConsultations('user-123', 10);

      expect(consultations).toHaveLength(2);
      expect(consultations[0]).toHaveProperty('question', 'Test 1');
      expect(mockSupabase.from).toHaveBeenCalledWith('consultations');
    });

    it('should handle empty results', async () => {
      const mockSupabase = require('@/lib/supabase/client').supabase;
      const mockLimit = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: mockLimit,
            }),
          }),
        }),
      });

      const consultations = await getUserConsultations('user-123');

      expect(consultations).toEqual([]);
    });
  });

  describe('getConsultationById', () => {
    it('should retrieve consultation by ID', async () => {
      const mockSupabase = require('@/lib/supabase/client').supabase;
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          id: '123',
          question: 'Test question',
          hexagram_number: 1,
          interpretation: { interpretation: 'Test' },
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: mockSingle,
          }),
        }),
      });

      const consultation = await getConsultationById('123');

      expect(consultation).toHaveProperty('id', '123');
      expect(consultation).toHaveProperty('question', 'Test question');
    });

    it('should handle not found', async () => {
      const mockSupabase = require('@/lib/supabase/client').supabase;
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' }, // Not found
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: mockSingle,
          }),
        }),
      });

      const consultation = await getConsultationById('nonexistent');

      expect(consultation).toBeNull();
    });
  });
});
