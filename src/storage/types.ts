// Storage types for the routine management system

export interface ScheduledExercise {
  id: string;
  exerciseId: string;
  day: number; // 0=Monday, 6=Sunday
  orderIndex: number;
  plannedSets?: number | null;
  plannedReps?: number | null;
}

export interface Routine {
  id: string;
  name: string;
  isActive: boolean;
  exercises: ScheduledExercise[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoutineInput {
  name: string;
}

export interface UpdateRoutineInput {
  name?: string;
  isActive?: boolean;
}

export interface AddExerciseInput {
  exerciseId: string;
  day: number;
  plannedSets?: number;
  plannedReps?: number;
}

export interface UpdateExerciseInput {
  day?: number;
  orderIndex?: number;
  plannedSets?: number | null;
  plannedReps?: number | null;
}

export interface ReorderInput {
  exercises: Array<{
    id: string;
    day: number;
    orderIndex: number;
  }>;
}

// Storage interface - implemented by both ApiStorage and LocalStorage
export interface RoutineStorage {
  // Routine CRUD
  getRoutines(): Promise<Routine[]>;
  getRoutine(id: string): Promise<Routine | null>;
  createRoutine(data: CreateRoutineInput): Promise<Routine>;
  updateRoutine(id: string, data: UpdateRoutineInput): Promise<Routine>;
  deleteRoutine(id: string): Promise<void>;

  // Exercise management within routines
  addExercise(routineId: string, data: AddExerciseInput): Promise<ScheduledExercise>;
  updateExercise(routineId: string, exerciseId: string, data: UpdateExerciseInput): Promise<ScheduledExercise>;
  removeExercise(routineId: string, exerciseId: string): Promise<void>;
  reorderExercises(routineId: string, data: ReorderInput): Promise<Routine>;
}
