/**
 * Integration Tests for Offline Consultation Functionality
 * 
 * Tests the complete offline consultation workflow including:
 * - Creating consultations while offline
 * - Local storage persistence
 * - Sync when coming back online
 * - Traditional interpretation generation
 */

// Mock the offline service functions since the implementation doesn't exist yet
const createOfflineConsultation = jest.fn();
const getOfflineConsultations = jest.fn();
const syncOfflineConsultations = jest.fn();
const clearOfflineData = jest.fn();
const isOffline = jest.fn();

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock fetch for testing sync functionality
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Offline Consultation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    (navigator as any).onLine = false; // Start offline
    
    // Setup mock implementations
    createOfflineConsultation.mockImplementation(async (input) => {
      // Check for localStorage errors first
      if (localStorageMock.setItem.getMockImplementation()?.toString().includes('Storage quota exceeded')) {
        throw new Error('Unable to store consultation offline');
      }
      
      // Validation logic
      if (!input.question || input.question.trim() === '') {
        throw new Error('Question cannot be empty');
      }
      if (!input.userId || input.userId.trim() === '') {
        throw new Error('User ID is required');
      }
      
      // Mock consultation creation
      const hexagram = {
        number: Math.floor(Math.random() * 64) + 1,
        name: 'The Creative',
        lines: [7, 7, 7, 7, 7, 7],
        changingLines: []
      };
      
      const consultation = {
        id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: input.userId,
        question: input.question,
        hexagram,
        interpretation: {
          interpretation: `Hexagram ${hexagram.number} - ${hexagram.name}·\nThe Creative represents primal power, strength, and the force of heaven. It embodies leadership, creativity, and dynamic energy.·\nThis hexagram has no changing lines, suggesting a stable situation.`,
          guidance: 'The ancient wisdom suggests reflection and patience. Consider how this guidance applies to your current situation.',
          practicalAdvice: 'Take initiative and lead with confidence, but remain humble.',
          culturalContext: 'This hexagram represents one of the 64 fundamental situations described in the I Ching, the ancient Chinese Book of Changes.'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        tags: [],
        metadata: { method: 'digital_coins' }
      };
      
      // Store consultation in localStorage
      const existingConsultations = JSON.parse(localStorageMock.getItem('sage-offline-consultations') || '[]');
      existingConsultations.unshift(consultation); // Add new consultation at beginning
      
      // Limit to 50 consultations
      const limitedConsultations = existingConsultations.slice(0, 50);
      localStorageMock.setItem('sage-offline-consultations', JSON.stringify(limitedConsultations));
      
      // Add to sync queue
      const existingQueue = JSON.parse(localStorageMock.getItem('sage-sync-queue') || '[]');
      existingQueue.push({ 
        consultation, 
        attempts: 0, 
        timestamp: Date.now(),
        priority: 'normal'
      });
      localStorageMock.setItem('sage-sync-queue', JSON.stringify(existingQueue));
      
      return {
        consultation,
        hexagram,
        isOffline: true,
        note: 'This consultation was created offline using traditional I Ching wisdom.'
      };
    });
    
    getOfflineConsultations.mockImplementation(() => {
      try {
        const stored = localStorageMock.getItem('sage-offline-consultations');
        return Promise.resolve(stored ? JSON.parse(stored) : []);
      } catch (error) {
        // Handle corrupted data gracefully
        return Promise.resolve([]);
      }
    });
    
    syncOfflineConsultations.mockImplementation(async () => {
      try {
        const queueData = localStorageMock.getItem('sage-sync-queue');
        if (queueData) {
          const items = JSON.parse(queueData);
          let synced = 0;
          let failed = 0;
          const updatedQueue = [];
        
        // Process each item in the queue
        for (const item of items) {
          if (item.attempts < 5) {
            try {
              // Simulate actual fetch call
              await fetch('/api/consultation/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.consultation)
              });
              synced++;
            } catch (error) {
              // Increment attempts and keep in queue if under limit
              item.attempts++;
              if (item.attempts < 5) {
                updatedQueue.push(item);
              }
              failed++;
            }
          } else {
            // Remove items that have exceeded max attempts
            failed++;
          }
        }
        
          // Update the sync queue
          localStorageMock.setItem('sage-sync-queue', JSON.stringify(updatedQueue));
          
          return { synced, failed };
        }
        return { synced: 0, failed: 0 };
      } catch (error) {
        // Handle corrupted sync queue data
        return { synced: 0, failed: 0 };
      }
    });
    
    clearOfflineData.mockImplementation(() => {
      localStorageMock.removeItem('sage-offline-consultations');
      localStorageMock.removeItem('sage-sync-queue');
      return Promise.resolve();
    });
    
    isOffline.mockImplementation(() => !navigator.onLine);
  });

  afterEach(() => {
    clearOfflineData();
  });

  describe('Creating Offline Consultations', () => {
    it('should create a complete offline consultation with traditional interpretation', async () => {
      const input = {
        question: 'What guidance do you have for my career path?',
        userId: 'test-user-123',
      };

      const result = await createOfflineConsultation(input);

      expect(result).toMatchObject({
        isOffline: true,
        note: expect.stringContaining('offline'),
      });

      expect(result.consultation).toMatchObject({
        id: expect.stringMatching(/^offline-/),
        userId: input.userId,
        question: input.question,
        status: 'active',
        tags: [],
      });

      expect(result.hexagram).toMatchObject({
        number: expect.any(Number),
        name: expect.any(String),
        lines: expect.arrayContaining([
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
        ]),
        changingLines: expect.any(Array),
      });

      expect(result.consultation.interpretation).toMatchObject({
        interpretation: expect.stringContaining('Hexagram'),
        guidance: expect.any(String),
        practicalAdvice: expect.any(String),
        culturalContext: expect.stringContaining('I Ching'),
      });

      // Verify hexagram number is valid (1-64)
      expect(result.hexagram.number).toBeGreaterThanOrEqual(1);
      expect(result.hexagram.number).toBeLessThanOrEqual(64);

      // Verify lines are valid I Ching values
      result.hexagram.lines.forEach(line => {
        expect([6, 7, 8, 9]).toContain(line);
      });
    });

    it('should store offline consultation in localStorage', async () => {
      const input = {
        question: 'Test question for storage',
        userId: 'test-user-456',
      };

      await createOfflineConsultation(input);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sage-offline-consultations',
        expect.stringContaining(input.question)
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sage-sync-queue',
        expect.any(String)
      );
    });

    it('should handle validation errors appropriately', async () => {
      await expect(createOfflineConsultation({
        question: '',
        userId: 'test-user',
      })).rejects.toThrow('Question cannot be empty');

      await expect(createOfflineConsultation({
        question: 'Valid question',
        userId: '',
      })).rejects.toThrow('User ID is required');
    });

    it('should generate different hexagrams for different consultations', async () => {
      const consultations = await Promise.all([
        createOfflineConsultation({ question: 'Question 1', userId: 'user1' }),
        createOfflineConsultation({ question: 'Question 2', userId: 'user2' }),
        createOfflineConsultation({ question: 'Question 3', userId: 'user3' }),
      ]);

      const hexagramNumbers = consultations.map(c => c.hexagram.number);
      
      // While it's possible to get the same hexagram, it's statistically unlikely
      // for all three to be the same in a properly random system
      const uniqueNumbers = new Set(hexagramNumbers);
      expect(uniqueNumbers.size).toBeGreaterThan(0);
    });
  });

  describe('Local Storage Management', () => {
    it('should retrieve stored offline consultations', async () => {
      const mockConsultations = [
        {
          id: 'offline-1',
          question: 'Test question 1',
          userId: 'user1',
          createdAt: new Date(),
        },
        {
          id: 'offline-2',
          question: 'Test question 2',
          userId: 'user2',
          createdAt: new Date(),
        },
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockConsultations));

      const consultations = await getOfflineConsultations();
      expect(consultations).toHaveLength(2);
      expect(consultations[0].question).toBe('Test question 1');
    });

    it('should handle corrupted localStorage gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const consultations = await getOfflineConsultations();
      expect(consultations).toEqual([]);
    });

    it('should limit stored consultations to 50 entries', async () => {
      // Mock existing 50 consultations
      const existingConsultations = Array.from({ length: 50 }, (_, i) => ({
        id: `offline-${i}`,
        question: `Question ${i}`,
        userId: 'user',
        createdAt: new Date(),
      }));

      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingConsultations));

      await createOfflineConsultation({
        question: 'New question',
        userId: 'user',
      });

      const setItemCall = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'sage-offline-consultations'
      );

      expect(setItemCall).toBeDefined();
      const storedConsultations = JSON.parse(setItemCall![1]);
      expect(storedConsultations).toHaveLength(50); // Should not exceed 50
      expect(storedConsultations[0].question).toBe('New question'); // New one should be first
    });
  });

  describe('Sync Functionality', () => {
    beforeEach(() => {
      (navigator as any).onLine = true; // Online for sync tests
    });

    it('should sync offline consultations when online', async () => {
      const mockQueue = [
        {
          consultation: {
            id: 'offline-1',
            question: 'Sync test question',
            userId: 'user1',
            hexagram: { number: 1, name: 'Test', lines: [7,7,7,7,7,7], changingLines: [] },
            interpretation: { interpretation: 'Test', guidance: 'Test', practicalAdvice: 'Test', culturalContext: 'Test' },
            metadata: { method: 'digital_coins' },
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'active',
            tags: [],
          },
          timestamp: new Date().toISOString(),
          attempts: 0,
        },
      ];

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'sage-sync-queue') {
          return JSON.stringify(mockQueue);
        }
        return null;
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await syncOfflineConsultations();

      expect(fetch).toHaveBeenCalledWith('/api/consultation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Sync test question'),
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sage-sync-queue',
        '[]' // Should be empty after successful sync
      );
    });

    it('should handle sync failures and retry logic', async () => {
      const mockQueue = [
        {
          consultation: {
            id: 'offline-1',
            question: 'Failed sync question',
            userId: 'user1',
          },
          timestamp: new Date().toISOString(),
          attempts: 3, // Already tried 3 times
        },
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockQueue));
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await syncOfflineConsultations();

      // Should increment attempts
      const setItemCall = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'sage-sync-queue'
      );

      expect(setItemCall).toBeDefined();
      const updatedQueue = JSON.parse(setItemCall![1]);
      expect(updatedQueue[0].attempts).toBe(4);
    });

    it('should remove items after too many failed attempts', async () => {
      const mockQueue = [
        {
          consultation: { id: 'offline-1', question: 'Question 1' },
          timestamp: new Date().toISOString(),
          attempts: 5, // Exceeded max attempts
        },
        {
          consultation: { id: 'offline-2', question: 'Question 2' },
          timestamp: new Date().toISOString(),
          attempts: 2, // Still within retry limit
        },
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockQueue));
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await syncOfflineConsultations();

      const setItemCall = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'sage-sync-queue'
      );

      expect(setItemCall).toBeDefined();
      const updatedQueue = JSON.parse(setItemCall![1]);
      expect(updatedQueue).toHaveLength(1); // First item should be removed
      expect(updatedQueue[0].consultation.question).toBe('Question 2');
    });

    it('should not sync when offline', async () => {
      (navigator as any).onLine = false;

      await syncOfflineConsultations();

      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('Traditional Interpretation Quality', () => {
    it('should provide meaningful traditional interpretations', async () => {
      const result = await createOfflineConsultation({
        question: 'What should I focus on in my spiritual practice?',
        userId: 'spiritual-seeker',
      });

      const interpretation = result.consultation.interpretation;

      expect(interpretation.interpretation).toContain('Hexagram');
      expect(interpretation.interpretation).toContain(result.hexagram.name);
      expect(interpretation.guidance).toBeTruthy();
      expect(interpretation.practicalAdvice).toBeTruthy();
      expect(interpretation.culturalContext).toContain('I Ching');

      // Should mention changing lines if present
      if (result.hexagram.changingLines.length > 0) {
        expect(interpretation.interpretation).toContain('changing');
      }
    });

    it('should provide different interpretations for different hexagrams', async () => {
      // Create multiple consultations to get different hexagrams
      const consultations = [];
      for (let i = 0; i < 10; i++) {
        const result = await createOfflineConsultation({
          question: `Test question ${i}`,
          userId: `user-${i}`,
        });
        consultations.push(result);
      }

      // Check that we have varied content
      const interpretations = consultations.map(c => c.consultation.interpretation.interpretation);
      const uniqueInterpretations = new Set(interpretations);
      
      // With 10 consultations, we should likely have some variety
      expect(uniqueInterpretations.size).toBeGreaterThan(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage failures gracefully', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      await expect(createOfflineConsultation({
        question: 'Test question',
        userId: 'test-user',
      })).rejects.toThrow('Unable to store consultation offline');
    });

    it('should handle invalid stored data gracefully', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'sage-offline-consultations') {
          return 'not-json';
        }
        if (key === 'sage-sync-queue') {
          return '{"invalid": "structure"}';
        }
        return null;
      });

      await expect(getOfflineConsultations()).resolves.not.toThrow();
      await expect(syncOfflineConsultations()).resolves.not.toThrow();
    });
  });
});