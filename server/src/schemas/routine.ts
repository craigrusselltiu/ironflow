import { z } from 'zod';

export const createRoutineSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
});

export const updateRoutineSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
});

export const addExerciseSchema = z.object({
  exerciseId: z.string().min(1, 'Exercise ID is required'),
  day: z.number().int().min(0).max(6, 'Day must be 0-6 (Monday-Sunday)'),
  plannedSets: z.number().int().min(1).optional(),
  plannedReps: z.number().int().min(1).optional(),
});

export const updateExerciseSchema = z.object({
  day: z.number().int().min(0).max(6).optional(),
  orderIndex: z.number().int().min(0).optional(),
  plannedSets: z.number().int().min(1).nullable().optional(),
  plannedReps: z.number().int().min(1).nullable().optional(),
});

export const reorderSchema = z.object({
  exercises: z.array(
    z.object({
      id: z.string(),
      day: z.number().int().min(0).max(6),
      orderIndex: z.number().int().min(0),
    })
  ),
});

export type CreateRoutineInput = z.infer<typeof createRoutineSchema>;
export type UpdateRoutineInput = z.infer<typeof updateRoutineSchema>;
export type AddExerciseInput = z.infer<typeof addExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
