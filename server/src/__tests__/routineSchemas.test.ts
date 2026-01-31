import { describe, it, expect } from 'vitest';
import {
  createRoutineSchema,
  updateRoutineSchema,
  addExerciseSchema,
  updateExerciseSchema,
  reorderSchema,
} from '../schemas/routine.js';

describe('Routine Schemas', () => {
  describe('createRoutineSchema', () => {
    it('should validate valid routine name', () => {
      const result = createRoutineSchema.safeParse({ name: 'My Routine' });
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = createRoutineSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject name over 100 characters', () => {
      const result = createRoutineSchema.safeParse({ name: 'a'.repeat(101) });
      expect(result.success).toBe(false);
    });
  });

  describe('updateRoutineSchema', () => {
    it('should validate name update', () => {
      const result = updateRoutineSchema.safeParse({ name: 'New Name' });
      expect(result.success).toBe(true);
    });

    it('should validate isActive update', () => {
      const result = updateRoutineSchema.safeParse({ isActive: true });
      expect(result.success).toBe(true);
    });

    it('should validate both fields', () => {
      const result = updateRoutineSchema.safeParse({ name: 'New', isActive: false });
      expect(result.success).toBe(true);
    });

    it('should validate empty update', () => {
      const result = updateRoutineSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('addExerciseSchema', () => {
    it('should validate valid exercise', () => {
      const result = addExerciseSchema.safeParse({
        exerciseId: 'ex-123',
        day: 0,
        plannedSets: 3,
        plannedReps: 10,
      });
      expect(result.success).toBe(true);
    });

    it('should validate without optional fields', () => {
      const result = addExerciseSchema.safeParse({
        exerciseId: 'ex-123',
        day: 0,
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing exerciseId', () => {
      const result = addExerciseSchema.safeParse({ day: 0 });
      expect(result.success).toBe(false);
    });

    it('should reject day less than 0', () => {
      const result = addExerciseSchema.safeParse({
        exerciseId: 'ex-123',
        day: -1,
      });
      expect(result.success).toBe(false);
    });

    it('should reject day greater than 6', () => {
      const result = addExerciseSchema.safeParse({
        exerciseId: 'ex-123',
        day: 7,
      });
      expect(result.success).toBe(false);
    });

    it('should accept day 6 (Sunday)', () => {
      const result = addExerciseSchema.safeParse({
        exerciseId: 'ex-123',
        day: 6,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('updateExerciseSchema', () => {
    it('should validate day update', () => {
      const result = updateExerciseSchema.safeParse({ day: 2 });
      expect(result.success).toBe(true);
    });

    it('should validate orderIndex update', () => {
      const result = updateExerciseSchema.safeParse({ orderIndex: 5 });
      expect(result.success).toBe(true);
    });

    it('should validate sets/reps update', () => {
      const result = updateExerciseSchema.safeParse({
        plannedSets: 4,
        plannedReps: 12,
      });
      expect(result.success).toBe(true);
    });

    it('should validate null sets/reps', () => {
      const result = updateExerciseSchema.safeParse({
        plannedSets: null,
        plannedReps: null,
      });
      expect(result.success).toBe(true);
    });

    it('should reject negative orderIndex', () => {
      const result = updateExerciseSchema.safeParse({ orderIndex: -1 });
      expect(result.success).toBe(false);
    });
  });

  describe('reorderSchema', () => {
    it('should validate reorder array', () => {
      const result = reorderSchema.safeParse({
        exercises: [
          { id: 'ex-1', day: 0, orderIndex: 0 },
          { id: 'ex-2', day: 0, orderIndex: 1 },
          { id: 'ex-3', day: 1, orderIndex: 0 },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should validate empty array', () => {
      const result = reorderSchema.safeParse({ exercises: [] });
      expect(result.success).toBe(true);
    });

    it('should reject missing id', () => {
      const result = reorderSchema.safeParse({
        exercises: [{ day: 0, orderIndex: 0 }],
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid day', () => {
      const result = reorderSchema.safeParse({
        exercises: [{ id: 'ex-1', day: 7, orderIndex: 0 }],
      });
      expect(result.success).toBe(false);
    });
  });
});
