import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getStorage } from '../storage';
import type { Routine, ScheduledExercise, RoutineStorage, Template, CreateTemplateInput } from '../storage';

// Day mapping for UI
const DAY_MAP: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

const DAY_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Legacy format for backward compatibility with existing components
export interface ExerciseInstance {
  exerciseId: string;
  instanceId: string;
  plannedSets?: number | null;
  plannedReps?: number | null;
}

export interface WeeklyRoutine {
  monday: ExerciseInstance[];
  tuesday: ExerciseInstance[];
  wednesday: ExerciseInstance[];
  thursday: ExerciseInstance[];
  friday: ExerciseInstance[];
  saturday: ExerciseInstance[];
  sunday: ExerciseInstance[];
}

interface RoutineContextType {
  // Legacy interface for existing components
  weeklyRoutine: WeeklyRoutine;
  setWeeklyRoutine: (routine: WeeklyRoutine | ((prev: WeeklyRoutine) => WeeklyRoutine)) => void;
  addExerciseToDay: (exerciseId: string, day: string, sets?: number, reps?: number) => void;
  removeExerciseFromDay: (day: string, instanceId: string) => void;
  updateExerciseSetsReps: (day: string, instanceId: string, sets?: number | null, reps?: number | null) => void;
  persistRoutineOrder: (routine: WeeklyRoutine) => Promise<void>;
  clearRoutine: () => void;

  // Routine management
  routines: Routine[];
  activeRoutine: Routine | null;
  isLoading: boolean;
  error: string | null;
  createRoutine: (name: string) => Promise<Routine>;
  selectRoutine: (id: string) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  renameRoutine: (id: string, name: string) => Promise<void>;
  refreshRoutines: () => Promise<void>;

  // Template management
  templates: Template[];
  loadTemplates: () => Promise<void>;
  saveAsTemplate: (name: string, description?: string) => Promise<Template>;
  applyTemplate: (templateId: string) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

const INITIAL_ROUTINE: WeeklyRoutine = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

const RoutineContext = createContext<RoutineContextType | null>(null);

// Convert storage format to UI format
function storageToWeekly(routine: Routine | null): WeeklyRoutine {
  if (!routine) return INITIAL_ROUTINE;

  const weekly: WeeklyRoutine = { ...INITIAL_ROUTINE };
  DAY_NAMES.forEach(day => {
    weekly[day as keyof WeeklyRoutine] = [];
  });

  // Sort exercises by day and orderIndex
  const sorted = [...routine.exercises].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.orderIndex - b.orderIndex;
  });

  sorted.forEach(ex => {
    const dayName = DAY_NAMES[ex.day] as keyof WeeklyRoutine;
    if (dayName) {
      weekly[dayName].push({
        exerciseId: ex.exerciseId,
        instanceId: ex.id,
        plannedSets: ex.plannedSets,
        plannedReps: ex.plannedReps,
      });
    }
  });

  return weekly;
}

export function RoutineProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [storage, setStorage] = useState<RoutineStorage>(() => getStorage(isAuthenticated));
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [weeklyRoutine, setWeeklyRoutineState] = useState<WeeklyRoutine>(INITIAL_ROUTINE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);

  // Update storage when auth state changes
  useEffect(() => {
    setStorage(getStorage(isAuthenticated));
  }, [isAuthenticated]);

  // Load routines when storage changes
  useEffect(() => {
    loadRoutines();
  }, [storage]);

  const loadRoutines = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedRoutines = await storage.getRoutines();
      setRoutines(loadedRoutines);

      // Find active routine or use first one
      let active = loadedRoutines.find(r => r.isActive);
      if (!active && loadedRoutines.length > 0) {
        active = loadedRoutines[0];
      }

      if (active) {
        // Load full routine with exercises
        const fullRoutine = await storage.getRoutine(active.id);
        setActiveRoutine(fullRoutine);
        setWeeklyRoutineState(storageToWeekly(fullRoutine));
      } else {
        setActiveRoutine(null);
        setWeeklyRoutineState(INITIAL_ROUTINE);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load routines');
      console.error('Failed to load routines:', err);
    } finally {
      setIsLoading(false);
    }
  }, [storage]);

  const refreshRoutines = useCallback(async () => {
    await loadRoutines();
  }, [loadRoutines]);

  const createRoutine = useCallback(async (name: string): Promise<Routine> => {
    const newRoutine = await storage.createRoutine({ name });
    await loadRoutines();
    return newRoutine;
  }, [storage, loadRoutines]);

  const selectRoutine = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await storage.updateRoutine(id, { isActive: true });
      const fullRoutine = await storage.getRoutine(id);
      setActiveRoutine(fullRoutine);
      setWeeklyRoutineState(storageToWeekly(fullRoutine));
      await loadRoutines();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select routine');
    } finally {
      setIsLoading(false);
    }
  }, [storage, loadRoutines]);

  const deleteRoutine = useCallback(async (id: string): Promise<void> => {
    await storage.deleteRoutine(id);
    if (activeRoutine?.id === id) {
      setActiveRoutine(null);
      setWeeklyRoutineState(INITIAL_ROUTINE);
    }
    await loadRoutines();
  }, [storage, activeRoutine, loadRoutines]);

  const renameRoutine = useCallback(async (id: string, name: string): Promise<void> => {
    await storage.updateRoutine(id, { name });
    await loadRoutines();
  }, [storage, loadRoutines]);

  // Template management
  const loadTemplates = useCallback(async () => {
    try {
      const loaded = await storage.getTemplates();
      setTemplates(loaded);
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  }, [storage]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const saveAsTemplate = useCallback(async (name: string, description?: string): Promise<Template> => {
    if (!activeRoutine) {
      throw new Error('No active routine to save as template');
    }

    const templateExercises = activeRoutine.exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      day: ex.day,
      orderIndex: ex.orderIndex,
      plannedSets: ex.plannedSets,
      plannedReps: ex.plannedReps,
    }));

    const template = await storage.createTemplate({
      name,
      description,
      exercises: templateExercises,
    });

    await loadTemplates();
    return template;
  }, [activeRoutine, storage, loadTemplates]);

  const applyTemplateToRoutine = useCallback(async (templateId: string) => {
    if (!activeRoutine) {
      throw new Error('No active routine to apply template to');
    }

    const updated = await storage.applyTemplate(templateId, activeRoutine.id);
    setActiveRoutine(updated);
    setWeeklyRoutineState(storageToWeekly(updated));
  }, [activeRoutine, storage]);

  const deleteTemplateById = useCallback(async (id: string) => {
    await storage.deleteTemplate(id);
    await loadTemplates();
  }, [storage, loadTemplates]);

  // Auto-create a default routine if none exists (for first-time users)
  useEffect(() => {
    if (!isLoading && routines.length === 0 && !error) {
      createRoutine('My Routine').catch(console.error);
    }
  }, [isLoading, routines.length, error, createRoutine]);

  // Legacy setWeeklyRoutine that syncs to storage
  const setWeeklyRoutine = useCallback(
    (update: WeeklyRoutine | ((prev: WeeklyRoutine) => WeeklyRoutine)) => {
      setWeeklyRoutineState(prev => {
        const newRoutine = typeof update === 'function' ? update(prev) : update;
        // Sync to storage will be handled by individual operations
        return newRoutine;
      });
    },
    []
  );

  const addExerciseToDay = useCallback(
    async (exerciseId: string, day: string, sets?: number, reps?: number) => {
      if (!activeRoutine) {
        console.warn('No active routine to add exercise to');
        return;
      }

      const dayNumber = DAY_MAP[day.toLowerCase()];
      if (dayNumber === undefined) return;

      try {
        const newExercise = await storage.addExercise(activeRoutine.id, {
          exerciseId,
          day: dayNumber,
          plannedSets: sets,
          plannedReps: reps,
        });

        // Update local state
        setWeeklyRoutineState(prev => {
          const validDay = day.toLowerCase() as keyof WeeklyRoutine;
          return {
            ...prev,
            [validDay]: [
              ...prev[validDay],
              {
                exerciseId,
                instanceId: newExercise.id,
                plannedSets: sets || null,
                plannedReps: reps || null,
              },
            ],
          };
        });

        // Update active routine
        setActiveRoutine(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            exercises: [...prev.exercises, newExercise],
          };
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add exercise');
        console.error('Failed to add exercise:', err);
      }
    },
    [activeRoutine, storage]
  );

  const removeExerciseFromDay = useCallback(
    async (day: string, instanceId: string) => {
      if (!activeRoutine) return;

      try {
        await storage.removeExercise(activeRoutine.id, instanceId);

        // Update local state
        setWeeklyRoutineState(prev => {
          const validDay = day.toLowerCase() as keyof WeeklyRoutine;
          return {
            ...prev,
            [validDay]: prev[validDay].filter(e => e.instanceId !== instanceId),
          };
        });

        // Update active routine
        setActiveRoutine(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            exercises: prev.exercises.filter(e => e.id !== instanceId),
          };
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove exercise');
        console.error('Failed to remove exercise:', err);
      }
    },
    [activeRoutine, storage]
  );

  const updateExerciseSetsReps = useCallback(
    async (day: string, instanceId: string, sets?: number | null, reps?: number | null) => {
      if (!activeRoutine) return;

      try {
        await storage.updateExercise(activeRoutine.id, instanceId, {
          plannedSets: sets,
          plannedReps: reps,
        });

        // Update local state
        setWeeklyRoutineState(prev => {
          const validDay = day.toLowerCase() as keyof WeeklyRoutine;
          return {
            ...prev,
            [validDay]: prev[validDay].map(e =>
              e.instanceId === instanceId
                ? { ...e, plannedSets: sets, plannedReps: reps }
                : e
            ),
          };
        });

        // Update active routine
        setActiveRoutine(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            exercises: prev.exercises.map(e =>
              e.id === instanceId
                ? { ...e, plannedSets: sets, plannedReps: reps }
                : e
            ),
          };
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update exercise');
        console.error('Failed to update exercise:', err);
      }
    },
    [activeRoutine, storage]
  );

  const persistRoutineOrder = useCallback(async (routine: WeeklyRoutine) => {
    if (!activeRoutine) return;

    const exercises: Array<{ id: string; day: number; orderIndex: number }> = [];
    DAY_NAMES.forEach((dayName, dayIndex) => {
      const dayKey = dayName as keyof WeeklyRoutine;
      routine[dayKey].forEach((ex, orderIndex) => {
        exercises.push({ id: ex.instanceId, day: dayIndex, orderIndex });
      });
    });

    try {
      const updated = await storage.reorderExercises(activeRoutine.id, { exercises });
      setActiveRoutine(updated);
    } catch (err) {
      console.error('Failed to persist routine order:', err);
    }
  }, [activeRoutine, storage]);

  const clearRoutine = useCallback(async () => {
    if (!activeRoutine) return;

    try {
      // Remove all exercises
      const promises = activeRoutine.exercises.map(e =>
        storage.removeExercise(activeRoutine.id, e.id)
      );
      await Promise.all(promises);

      setWeeklyRoutineState(INITIAL_ROUTINE);
      setActiveRoutine(prev => (prev ? { ...prev, exercises: [] } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear routine');
      console.error('Failed to clear routine:', err);
    }
  }, [activeRoutine, storage]);

  return (
    <RoutineContext.Provider
      value={{
        weeklyRoutine,
        setWeeklyRoutine,
        addExerciseToDay,
        removeExerciseFromDay,
        updateExerciseSetsReps,
        persistRoutineOrder,
        clearRoutine,
        routines,
        activeRoutine,
        isLoading,
        error,
        createRoutine,
        selectRoutine,
        deleteRoutine,
        renameRoutine,
        refreshRoutines,
        templates,
        loadTemplates,
        saveAsTemplate,
        applyTemplate: applyTemplateToRoutine,
        deleteTemplate: deleteTemplateById,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutine(): RoutineContextType {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error('useRoutine must be used within a RoutineProvider');
  }
  return context;
}
