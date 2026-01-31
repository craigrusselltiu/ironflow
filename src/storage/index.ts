// Storage abstraction layer
// Provides a unified interface for routine storage
// Uses ApiStorage when logged in, LocalStorage for guest mode

export type {
  RoutineStorage,
  Routine,
  ScheduledExercise,
  CreateRoutineInput,
  UpdateRoutineInput,
  AddExerciseInput,
  UpdateExerciseInput,
  ReorderInput,
} from './types';

export { LocalStorage } from './localStorage';
export { ApiStorage } from './apiStorage';

import { LocalStorage } from './localStorage';
import { ApiStorage } from './apiStorage';
import type { RoutineStorage } from './types';

let localStorageInstance: LocalStorage | null = null;
let apiStorageInstance: ApiStorage | null = null;

/**
 * Get the appropriate storage implementation based on authentication state
 * @param isAuthenticated - Whether the user is logged in
 */
export function getStorage(isAuthenticated: boolean): RoutineStorage {
  if (isAuthenticated) {
    if (!apiStorageInstance) {
      apiStorageInstance = new ApiStorage();
    }
    return apiStorageInstance;
  } else {
    if (!localStorageInstance) {
      localStorageInstance = new LocalStorage();
    }
    return localStorageInstance;
  }
}
