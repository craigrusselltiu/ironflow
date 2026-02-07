// API Storage implementation for authenticated users
import { api } from '../api/client';
import type {
  RoutineStorage,
  Routine,
  ScheduledExercise,
  CreateRoutineInput,
  UpdateRoutineInput,
  AddExerciseInput,
  UpdateExerciseInput,
  ReorderInput,
  Template,
  CreateTemplateInput,
} from './types';

// API response types
interface ApiRoutineListItem {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { exercises: number };
}

interface ApiRoutine {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  exercises: ScheduledExercise[];
}

interface ApiScheduledExercise {
  id: string;
  exerciseId: string;
  day: number;
  orderIndex: number;
  plannedSets: number | null;
  plannedReps: number | null;
}

export class ApiStorage implements RoutineStorage {
  async getRoutines(): Promise<Routine[]> {
    const response = await api.get<ApiRoutineListItem[]>('/routines');

    // For list view, we don't have exercises loaded
    // Return with empty exercises array - client should load full routine when needed
    return response.map(r => ({
      id: r.id,
      name: r.name,
      isActive: r.isActive,
      exercises: [],
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async getRoutine(id: string): Promise<Routine | null> {
    try {
      const response = await api.get<ApiRoutine>(`/routines/${id}`);
      return {
        id: response.id,
        name: response.name,
        isActive: response.isActive,
        exercises: response.exercises,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Routine not found') {
        return null;
      }
      throw error;
    }
  }

  async createRoutine(data: CreateRoutineInput): Promise<Routine> {
    const response = await api.post<ApiRoutine>('/routines', data);
    return {
      id: response.id,
      name: response.name,
      isActive: response.isActive,
      exercises: [],
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  async updateRoutine(id: string, data: UpdateRoutineInput): Promise<Routine> {
    const response = await api.put<ApiRoutine>(`/routines/${id}`, data);
    return {
      id: response.id,
      name: response.name,
      isActive: response.isActive,
      exercises: response.exercises || [],
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  async deleteRoutine(id: string): Promise<void> {
    await api.delete(`/routines/${id}`);
  }

  async addExercise(routineId: string, data: AddExerciseInput): Promise<ScheduledExercise> {
    const response = await api.post<ApiScheduledExercise>(
      `/routines/${routineId}/exercises`,
      data
    );
    return response;
  }

  async updateExercise(
    routineId: string,
    exerciseId: string,
    data: UpdateExerciseInput
  ): Promise<ScheduledExercise> {
    const response = await api.put<ApiScheduledExercise>(
      `/routines/${routineId}/exercises/${exerciseId}`,
      data
    );
    return response;
  }

  async removeExercise(routineId: string, exerciseId: string): Promise<void> {
    await api.delete(`/routines/${routineId}/exercises/${exerciseId}`);
  }

  async reorderExercises(routineId: string, data: ReorderInput): Promise<Routine> {
    const response = await api.put<ApiRoutine>(`/routines/${routineId}/reorder`, data);
    return {
      id: response.id,
      name: response.name,
      isActive: response.isActive,
      exercises: response.exercises,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  // Template methods

  async getTemplates(): Promise<Template[]> {
    return api.get<Template[]>('/templates');
  }

  async createTemplate(data: CreateTemplateInput): Promise<Template> {
    return api.post<Template>('/templates', data);
  }

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/templates/${id}`);
  }

  async applyTemplate(templateId: string, routineId: string): Promise<Routine> {
    const response = await api.post<ApiRoutine>(`/templates/${templateId}/apply`, { routineId });
    return {
      id: response.id,
      name: response.name,
      isActive: response.isActive,
      exercises: response.exercises,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }
}
