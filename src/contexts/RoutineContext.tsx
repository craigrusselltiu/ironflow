import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ExerciseInstance {
  exerciseId: string;
  instanceId: string;
}

interface WeeklyRoutine {
  monday: ExerciseInstance[];
  tuesday: ExerciseInstance[];
  wednesday: ExerciseInstance[];
  thursday: ExerciseInstance[];
  friday: ExerciseInstance[];
  saturday: ExerciseInstance[];
  sunday: ExerciseInstance[];
}

interface RoutineContextType {
  weeklyRoutine: WeeklyRoutine;
  setWeeklyRoutine: (routine: WeeklyRoutine | ((prev: WeeklyRoutine) => WeeklyRoutine)) => void;
  addExerciseToDay: (exerciseId: string, day: string) => void;
  removeExerciseFromDay: (day: string, instanceId: string) => void;
  clearRoutine: () => void;
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

function generateInstanceId(): string {
  return `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const RoutineContext = createContext<RoutineContextType | null>(null);

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [weeklyRoutine, setWeeklyRoutine] = useLocalStorage<WeeklyRoutine>(
    'ironflow-routine',
    INITIAL_ROUTINE
  );

  const addExerciseToDay = (exerciseId: string, day: string) => {
    const validDay = day.toLowerCase() as keyof WeeklyRoutine;
    if (!weeklyRoutine[validDay]) return;

    const newInstance: ExerciseInstance = {
      exerciseId,
      instanceId: generateInstanceId(),
    };

    setWeeklyRoutine((prev: WeeklyRoutine) => ({
      ...prev,
      [validDay]: [...prev[validDay], newInstance],
    }));
  };

  const removeExerciseFromDay = (day: string, instanceId: string) => {
    const validDay = day.toLowerCase() as keyof WeeklyRoutine;
    if (!weeklyRoutine[validDay]) return;

    setWeeklyRoutine((prev: WeeklyRoutine) => ({
      ...prev,
      [validDay]: prev[validDay].filter((e: ExerciseInstance) => e.instanceId !== instanceId),
    }));
  };

  const clearRoutine = () => {
    if (window.confirm('Are you sure you want to clear your entire routine?')) {
      setWeeklyRoutine(INITIAL_ROUTINE);
    }
  };

  return (
    <RoutineContext.Provider
      value={{
        weeklyRoutine,
        setWeeklyRoutine,
        addExerciseToDay,
        removeExerciseFromDay,
        clearRoutine,
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
