// LocalStorage implementation for offline/guest mode
import type {
  RoutineStorage,
  Routine,
  ScheduledExercise,
  CreateRoutineInput,
  UpdateRoutineInput,
  AddExerciseInput,
  UpdateExerciseInput,
  ReorderInput,
  ImportRoutineData,
  Template,
  CreateTemplateInput,
  UpdateTemplateInput,
} from './types';
import { SYSTEM_TEMPLATES } from '../data/templates';

const STORAGE_KEY = 'ironflow-routines';
const TEMPLATES_KEY = 'ironflow-templates';

function generateId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getStoredRoutines(): Routine[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveRoutines(routines: Routine[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
}

export class LocalStorage implements RoutineStorage {
  async getRoutines(): Promise<Routine[]> {
    return getStoredRoutines();
  }

  async getRoutine(id: string): Promise<Routine | null> {
    const routines = getStoredRoutines();
    return routines.find(r => r.id === id) || null;
  }

  async createRoutine(data: CreateRoutineInput): Promise<Routine> {
    const routines = getStoredRoutines();
    const now = new Date().toISOString();

    const newRoutine: Routine = {
      id: generateId(),
      name: data.name,
      isActive: routines.length === 0, // First routine is active by default
      exercises: [],
      createdAt: now,
      updatedAt: now,
    };

    routines.push(newRoutine);
    saveRoutines(routines);

    return newRoutine;
  }

  async updateRoutine(id: string, data: UpdateRoutineInput): Promise<Routine> {
    const routines = getStoredRoutines();
    const index = routines.findIndex(r => r.id === id);

    if (index === -1) {
      throw new Error('Routine not found');
    }

    // If setting as active, deactivate others
    if (data.isActive) {
      routines.forEach(r => {
        r.isActive = false;
      });
    }

    routines[index] = {
      ...routines[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    saveRoutines(routines);
    return routines[index];
  }

  async deleteRoutine(id: string): Promise<void> {
    const routines = getStoredRoutines();
    const filtered = routines.filter(r => r.id !== id);
    saveRoutines(filtered);
  }

  async addExercise(routineId: string, data: AddExerciseInput): Promise<ScheduledExercise> {
    const routines = getStoredRoutines();
    const routine = routines.find(r => r.id === routineId);

    if (!routine) {
      throw new Error('Routine not found');
    }

    // Calculate order index
    const exercisesForDay = routine.exercises.filter(e => e.day === data.day);
    const maxOrder = exercisesForDay.length > 0
      ? Math.max(...exercisesForDay.map(e => e.orderIndex))
      : -1;

    const newExercise: ScheduledExercise = {
      id: generateId(),
      exerciseId: data.exerciseId,
      day: data.day,
      orderIndex: maxOrder + 1,
      plannedSets: data.plannedSets || null,
      plannedReps: data.plannedReps || null,
    };

    routine.exercises.push(newExercise);
    routine.updatedAt = new Date().toISOString();
    saveRoutines(routines);

    return newExercise;
  }

  async updateExercise(
    routineId: string,
    exerciseId: string,
    data: UpdateExerciseInput
  ): Promise<ScheduledExercise> {
    const routines = getStoredRoutines();
    const routine = routines.find(r => r.id === routineId);

    if (!routine) {
      throw new Error('Routine not found');
    }

    const exerciseIndex = routine.exercises.findIndex(e => e.id === exerciseId);
    if (exerciseIndex === -1) {
      throw new Error('Exercise not found');
    }

    routine.exercises[exerciseIndex] = {
      ...routine.exercises[exerciseIndex],
      ...data,
    };

    routine.updatedAt = new Date().toISOString();
    saveRoutines(routines);

    return routine.exercises[exerciseIndex];
  }

  async removeExercise(routineId: string, exerciseId: string): Promise<void> {
    const routines = getStoredRoutines();
    const routine = routines.find(r => r.id === routineId);

    if (!routine) {
      throw new Error('Routine not found');
    }

    routine.exercises = routine.exercises.filter(e => e.id !== exerciseId);
    routine.updatedAt = new Date().toISOString();
    saveRoutines(routines);
  }

  async reorderExercises(routineId: string, data: ReorderInput): Promise<Routine> {
    const routines = getStoredRoutines();
    const routine = routines.find(r => r.id === routineId);

    if (!routine) {
      throw new Error('Routine not found');
    }

    // Update exercise positions
    data.exercises.forEach(update => {
      const exercise = routine.exercises.find(e => e.id === update.id);
      if (exercise) {
        exercise.day = update.day;
        exercise.orderIndex = update.orderIndex;
      }
    });

    routine.updatedAt = new Date().toISOString();
    saveRoutines(routines);

    return routine;
  }

  async importRoutine(data: ImportRoutineData): Promise<Routine> {
    const routines = getStoredRoutines();
    const now = new Date().toISOString();

    const newRoutine: Routine = {
      id: generateId(),
      name: data.name,
      isActive: false,
      exercises: data.exercises.map(ex => ({
        id: generateId(),
        exerciseId: ex.exerciseId,
        day: ex.day,
        orderIndex: ex.orderIndex,
        plannedSets: ex.plannedSets ?? null,
        plannedReps: ex.plannedReps ?? null,
      })),
      createdAt: now,
      updatedAt: now,
    };

    routines.push(newRoutine);
    saveRoutines(routines);

    return newRoutine;
  }

  // Template methods

  async getTemplates(): Promise<Template[]> {
    const userTemplates = this.getStoredTemplates();
    return [...SYSTEM_TEMPLATES, ...userTemplates];
  }

  async createTemplate(data: CreateTemplateInput): Promise<Template> {
    const templates = this.getStoredTemplates();
    const newTemplate: Template = {
      id: generateId(),
      name: data.name,
      description: data.description || null,
      isSystem: false,
      exercises: data.exercises,
      createdAt: new Date().toISOString(),
    };
    templates.push(newTemplate);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    return newTemplate;
  }

  async updateTemplate(id: string, data: UpdateTemplateInput): Promise<Template> {
    const templates = this.getStoredTemplates();
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }
    templates[index] = { ...templates[index], ...data };
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    return templates[index];
  }

  async deleteTemplate(id: string): Promise<void> {
    const templates = this.getStoredTemplates();
    const filtered = templates.filter(t => t.id !== id);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
  }

  async applyTemplate(templateId: string, routineId: string): Promise<Routine> {
    const allTemplates = await this.getTemplates();
    const template = allTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const routines = getStoredRoutines();
    const routine = routines.find(r => r.id === routineId);
    if (!routine) {
      throw new Error('Routine not found');
    }

    // Clear existing exercises and apply template exercises
    routine.exercises = template.exercises.map(ex => ({
      id: generateId(),
      exerciseId: ex.exerciseId,
      day: ex.day,
      orderIndex: ex.orderIndex,
      plannedSets: ex.plannedSets || null,
      plannedReps: ex.plannedReps || null,
    }));
    routine.updatedAt = new Date().toISOString();
    saveRoutines(routines);

    return routine;
  }

  private getStoredTemplates(): Template[] {
    try {
      const data = localStorage.getItem(TEMPLATES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
