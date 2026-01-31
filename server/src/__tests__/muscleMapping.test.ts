import { describe, it, expect } from 'vitest';
import {
  mapBodyPartToMuscles,
  mapTargetToMuscle,
  getExerciseMuscles,
} from '../utils/muscleMapping.js';

describe('Muscle Mapping', () => {
  describe('mapBodyPartToMuscles', () => {
    it('should map back to upperBack and lats', () => {
      expect(mapBodyPartToMuscles('back')).toEqual(['upperBack', 'lats']);
    });

    it('should map chest to chest', () => {
      expect(mapBodyPartToMuscles('chest')).toEqual(['chest']);
    });

    it('should map shoulders to frontDelts and rearDelts', () => {
      expect(mapBodyPartToMuscles('shoulders')).toEqual(['frontDelts', 'rearDelts']);
    });

    it('should map upper arms to biceps and triceps', () => {
      expect(mapBodyPartToMuscles('upper arms')).toEqual(['biceps', 'triceps']);
    });

    it('should map lower arms to forearms', () => {
      expect(mapBodyPartToMuscles('lower arms')).toEqual(['forearms']);
    });

    it('should map upper legs to quads, hamstrings, glutes', () => {
      expect(mapBodyPartToMuscles('upper legs')).toEqual(['quads', 'hamstrings', 'glutes']);
    });

    it('should map lower legs to calves', () => {
      expect(mapBodyPartToMuscles('lower legs')).toEqual(['calves']);
    });

    it('should map waist to abs and lowerBack', () => {
      expect(mapBodyPartToMuscles('waist')).toEqual(['abs', 'lowerBack']);
    });

    it('should map neck to traps', () => {
      expect(mapBodyPartToMuscles('neck')).toEqual(['traps']);
    });

    it('should map cardio to empty array', () => {
      expect(mapBodyPartToMuscles('cardio')).toEqual([]);
    });

    it('should return empty array for unknown body part', () => {
      expect(mapBodyPartToMuscles('unknown')).toEqual([]);
    });

    it('should be case insensitive', () => {
      expect(mapBodyPartToMuscles('BACK')).toEqual(['upperBack', 'lats']);
    });
  });

  describe('mapTargetToMuscle', () => {
    it('should map abs to abs', () => {
      expect(mapTargetToMuscle('abs')).toBe('abs');
    });

    it('should map biceps to biceps', () => {
      expect(mapTargetToMuscle('biceps')).toBe('biceps');
    });

    it('should map pectorals to chest', () => {
      expect(mapTargetToMuscle('pectorals')).toBe('chest');
    });

    it('should map delts to frontDelts', () => {
      expect(mapTargetToMuscle('delts')).toBe('frontDelts');
    });

    it('should map cardiovascular system to null', () => {
      expect(mapTargetToMuscle('cardiovascular system')).toBeNull();
    });

    it('should return null for unknown target', () => {
      expect(mapTargetToMuscle('unknown')).toBeNull();
    });

    it('should be case insensitive', () => {
      expect(mapTargetToMuscle('BICEPS')).toBe('biceps');
    });
  });

  describe('getExerciseMuscles', () => {
    it('should get primary and secondary muscles for bench press', () => {
      const result = getExerciseMuscles('chest', 'pectorals', ['triceps', 'delts']);
      expect(result.primary).toBe('chest');
      expect(result.secondary).toContain('triceps');
      expect(result.secondary).toContain('frontDelts');
    });

    it('should not duplicate primary muscle in secondary', () => {
      const result = getExerciseMuscles('chest', 'pectorals', ['pectorals']);
      expect(result.primary).toBe('chest');
      expect(result.secondary).not.toContain('chest');
    });

    it('should add body part muscles as secondary', () => {
      const result = getExerciseMuscles('back', 'lats', []);
      expect(result.primary).toBe('lats');
      expect(result.secondary).toContain('upperBack');
    });

    it('should handle cardio exercises', () => {
      const result = getExerciseMuscles('cardio', 'cardiovascular system', []);
      expect(result.primary).toBeNull();
      expect(result.secondary).toEqual([]);
    });
  });
});
