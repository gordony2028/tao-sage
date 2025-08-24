import {
  saveConsultation,
  getUserConsultations,
  getConsultationById,
} from '@/lib/supabase/consultations';

// Mock the Supabase client module
jest.mock('@/lib/supabase/client', () => {
  const mockData: any[] = [];

  return {
    supabaseAdmin: {
      from: jest.fn((table: string) => {
        if (table === 'consultations') {
          return {
            insert: jest.fn((data: any) => ({
              select: jest.fn(() => ({
                single: jest.fn(() => {
                  const newItem = {
                    ...data,
                    id: 'test-id-' + Date.now(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    status: data.status || 'active', // Add default status
                  };
                  mockData.push(newItem);
                  return Promise.resolve({ data: newItem, error: null });
                }),
              })),
            })),
            select: jest.fn(() => {
              const createChainableQuery = (
                filters: Record<string, any> = {}
              ): any => ({
                eq: jest.fn((field: string, value: any) => {
                  const newFilters = { ...filters, [field]: value };
                  return createChainableQuery(newFilters);
                }),
                ilike: jest.fn((field: string, value: any) => {
                  const newFilters = { ...filters, [`${field}_ilike`]: value };
                  return createChainableQuery(newFilters);
                }),
                order: jest.fn(() => createChainableQuery(filters)),
                range: jest.fn(() => createChainableQuery(filters)),
                single: jest.fn(() => {
                  const item = mockData.find(d =>
                    Object.entries(filters).every(([key, val]) =>
                      key.includes('_ilike') ? true : d[key] === val
                    )
                  );
                  return Promise.resolve({
                    data: item || null,
                    error: item ? null : { code: 'PGRST116' },
                  });
                }),
                then: jest.fn(callback => {
                  const filtered = mockData.filter(item =>
                    Object.entries(filters).every(([key, val]) =>
                      key.includes('_ilike') ? true : item[key] === val
                    )
                  );
                  const result = {
                    data: filtered,
                    error: null,
                    count: filtered.length,
                  };
                  return Promise.resolve(result).then(callback);
                }),
              });
              return createChainableQuery();
            }),
            delete: jest.fn(() => ({
              like: jest.fn(() => Promise.resolve({ error: null })),
            })),
          };
        }
        return {};
      }),
    },
  };
});

describe('Supabase Consultations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveConsultation', () => {
    it('should save consultation successfully', async () => {
      const testData = {
        user_id: 'test-user-123',
        question: 'Test question?',
        hexagram_number: 1,
        hexagram_name: 'The Creative',
        lines: [7, 7, 7, 7, 7, 7],
        changing_lines: [],
        interpretation: {
          interpretation: 'Test interpretation',
          guidance: 'Test guidance',
          practicalAdvice: 'Test advice',
        },
        consultation_method: 'digital_coins',
      };

      const result = await saveConsultation(testData);

      expect(result).toHaveProperty('id');
      expect(result.user_id).toBe(testData.user_id);
      expect(result.question).toBe(testData.question);
    });

    it('should handle database errors', async () => {
      const mockSupabaseAdmin = require('@/lib/supabase/client').supabaseAdmin;

      // Mock an error response
      mockSupabaseAdmin.from.mockReturnValueOnce({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() =>
              Promise.resolve({
                data: null,
                error: { message: 'Database error' },
              })
            ),
          })),
        })),
      });

      const testData = {
        user_id: 'test-user',
        question: 'Test question',
        hexagram_number: 1,
        hexagram_name: 'The Creative',
        lines: [7, 7, 7, 7, 7, 7],
        changing_lines: [],
        interpretation: {
          interpretation: 'Test',
        },
        consultation_method: 'digital_coins',
      };

      await expect(saveConsultation(testData)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getUserConsultations', () => {
    it('should retrieve user consultations', async () => {
      const userId = 'test-user-456';

      // First save a consultation (this will add to mock data)
      await saveConsultation({
        user_id: userId,
        question: 'Test question',
        hexagram_number: 1,
        hexagram_name: 'The Creative',
        lines: [7, 7, 7, 7, 7, 7],
        changing_lines: [],
        interpretation: {
          interpretation: 'Test',
        },
        consultation_method: 'digital_coins',
      });

      const result = await getUserConsultations(userId);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('count');
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.count).toBeGreaterThan(0);
      if (result.data.length > 0) {
        expect(result.data[0]!.user_id).toBe(userId);
      }
    });

    it('should handle empty results', async () => {
      const result = await getUserConsultations('non-existent-user');

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('count');
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data).toHaveLength(0);
      expect(result.count).toBe(0);
    });
  });

  describe('getConsultationById', () => {
    it('should retrieve consultation by ID', async () => {
      // First save a consultation
      const saved = await saveConsultation({
        user_id: 'test-user-789',
        question: 'Test question',
        hexagram_number: 1,
        hexagram_name: 'The Creative',
        lines: [7, 7, 7, 7, 7, 7],
        changing_lines: [],
        interpretation: {
          interpretation: 'Test',
        },
        consultation_method: 'digital_coins',
      });

      const result = await getConsultationById(saved.id);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.id).toBe(saved.id);
      }
    });

    it('should handle not found', async () => {
      const result = await getConsultationById('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
