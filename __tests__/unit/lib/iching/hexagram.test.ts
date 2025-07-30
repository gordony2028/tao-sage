import {
  generateHexagram,
  getHexagramName,
  calculateChangingLines,
} from '@/lib/iching/hexagram';

describe('I Ching Hexagram Generation', () => {
  describe('generateHexagram', () => {
    it('should generate a valid hexagram with 6 lines', () => {
      const hexagram = generateHexagram();

      expect(hexagram).toHaveProperty('lines');
      expect(hexagram.lines).toHaveLength(6);
      expect(hexagram).toHaveProperty('number');
      expect(hexagram.number).toBeGreaterThanOrEqual(1);
      expect(hexagram.number).toBeLessThanOrEqual(64);
    });

    it('should generate hexagram lines with valid values', () => {
      const hexagram = generateHexagram();

      hexagram.lines.forEach(line => {
        // Lines can be: 6 (old yin), 7 (young yang), 8 (young yin), 9 (old yang)
        expect([6, 7, 8, 9]).toContain(line);
      });
    });

    it('should generate different hexagrams on multiple calls', () => {
      const hexagrams = Array.from({ length: 10 }, () => generateHexagram());
      const uniqueNumbers = new Set(hexagrams.map(h => h.number));

      // With randomness, we should get some variety (not a guarantee, but likely)
      expect(uniqueNumbers.size).toBeGreaterThan(1);
    });

    it('should include changing lines when present', () => {
      // Generate many hexagrams to find one with changing lines
      let foundChangingLines = false;
      for (let i = 0; i < 100; i++) {
        const hexagram = generateHexagram();
        if (hexagram.changingLines && hexagram.changingLines.length > 0) {
          foundChangingLines = true;
          expect(
            hexagram.changingLines.every(line => line >= 1 && line <= 6)
          ).toBe(true);
          break;
        }
      }

      // This test might occasionally fail due to randomness, but it's statistically unlikely
      expect(foundChangingLines).toBe(true);
    });
  });

  describe('getHexagramName', () => {
    it('should return correct names for known hexagrams', () => {
      expect(getHexagramName(1)).toBe('The Creative');
      expect(getHexagramName(2)).toBe('The Receptive');
      expect(getHexagramName(3)).toBe('Difficulty at the Beginning');
      expect(getHexagramName(64)).toBe('Before Completion');
    });

    it('should throw error for invalid hexagram numbers', () => {
      expect(() => getHexagramName(0)).toThrow();
      expect(() => getHexagramName(65)).toThrow();
      expect(() => getHexagramName(-1)).toThrow();
    });
  });

  describe('calculateChangingLines', () => {
    it('should identify changing lines correctly', () => {
      const lines = [6, 7, 8, 9, 7, 8]; // 6 and 9 are changing lines
      const changingLines = calculateChangingLines(lines);

      expect(changingLines).toEqual([1, 4]); // 1-indexed positions
    });

    it('should return empty array when no changing lines', () => {
      const lines = [7, 7, 8, 8, 7, 8]; // Only stable lines
      const changingLines = calculateChangingLines(lines);

      expect(changingLines).toEqual([]);
    });

    it('should handle all changing lines', () => {
      const lines = [6, 9, 6, 9, 6, 9]; // All changing
      const changingLines = calculateChangingLines(lines);

      expect(changingLines).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });
});
