import { describe, it, expect } from 'vitest';
import { isCacheExpired } from '../services/exerciseDb.js';

describe('ExerciseDB Service', () => {
  describe('isCacheExpired', () => {
    it('should return false for recently fetched data', () => {
      const fetchedAt = new Date();
      expect(isCacheExpired(fetchedAt)).toBe(false);
    });

    it('should return false for data fetched 6 days ago', () => {
      const fetchedAt = new Date();
      fetchedAt.setDate(fetchedAt.getDate() - 6);
      expect(isCacheExpired(fetchedAt)).toBe(false);
    });

    it('should return true for data fetched 7 days ago', () => {
      const fetchedAt = new Date();
      fetchedAt.setDate(fetchedAt.getDate() - 7);
      expect(isCacheExpired(fetchedAt)).toBe(true);
    });

    it('should return true for data fetched 10 days ago', () => {
      const fetchedAt = new Date();
      fetchedAt.setDate(fetchedAt.getDate() - 10);
      expect(isCacheExpired(fetchedAt)).toBe(true);
    });
  });
});
