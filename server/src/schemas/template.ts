import { z } from 'zod';

const templateExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  day: z.number().int().min(0).max(6),
  orderIndex: z.number().int().min(0),
  plannedSets: z.number().int().min(1).nullable().optional(),
  plannedReps: z.number().int().min(1).nullable().optional(),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  exercises: z.array(templateExerciseSchema).min(1, 'At least one exercise is required'),
});

export const updateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  exercises: z.array(templateExerciseSchema).min(1).optional(),
});

export const applyTemplateSchema = z.object({
  routineId: z.string().min(1, 'Routine ID is required'),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type ApplyTemplateInput = z.infer<typeof applyTemplateSchema>;
