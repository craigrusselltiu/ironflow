import { useState, useEffect, useCallback, useMemo } from 'react';
import exercisesData from '../data/exercises.json';
import type { Exercise, ExerciseFilters } from '../types/exercise';

// Map ExerciseDB target/muscle to IronFlow muscle name
const targetToMuscle: Record<string, string> = {
  // Core muscles
  abs: 'abs',
  abdominals: 'abs',
  'lower abs': 'abs',
  obliques: 'abs',
  core: 'abs',

  // Back muscles
  lats: 'lats',
  'latissimus dorsi': 'lats',
  'upper back': 'upperBack',
  back: 'upperBack',
  rhomboids: 'upperBack',
  'lower back': 'lowerBack',
  spine: 'lowerBack',

  // Shoulder muscles
  delts: 'sideDelts',
  deltoids: 'sideDelts',
  shoulders: 'sideDelts',
  'front delts': 'frontDelts',
  'side delts': 'sideDelts',
  'rear delts': 'rearDelts',
  'rear deltoids': 'rearDelts',
  'anterior deltoids': 'frontDelts',
  'rotator cuff': 'rearDelts',

  // Arm muscles
  biceps: 'biceps',
  brachialis: 'biceps',
  triceps: 'triceps',
  forearms: 'forearms',
  'wrist extensors': 'forearms',
  'wrist flexors': 'forearms',
  'grip muscles': 'forearms',
  wrists: 'forearms',
  hands: 'forearms',

  // Chest muscles
  pectorals: 'chest',
  chest: 'chest',
  'upper chest': 'chest',
  'serratus anterior': 'chest',

  // Neck/Trap muscles
  traps: 'traps',
  trapezius: 'traps',
  'levator scapulae': 'traps',
  sternocleidomastoid: 'traps',

  // Leg muscles
  quads: 'quads',
  quadriceps: 'quads',
  adductors: 'quads',
  'inner thighs': 'quads',
  hamstrings: 'hamstrings',
  glutes: 'glutes',
  abductors: 'glutes',
  'hip flexors': 'glutes',
  groin: 'quads',
  calves: 'calves',
  soleus: 'calves',
  shins: 'calves',
  'ankle stabilizers': 'calves',
  ankles: 'calves',
  feet: 'calves',
};

function mapTargetToMuscle(target: string): string | null {
  return targetToMuscle[target.toLowerCase()] || null;
}

interface RawExercise {
  id: string;
  name: string;
  bodyPart: string;
  targetMuscles: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// Enrich exercise with muscle mappings
function enrichExercise(e: RawExercise): Exercise {
  const primaryMuscle = mapTargetToMuscle(e.targetMuscles);
  const secondaryMusclesMapping: string[] = [];

  for (const muscle of e.secondaryMuscles) {
    const mapped = mapTargetToMuscle(muscle);
    if (mapped && mapped !== primaryMuscle) {
      secondaryMusclesMapping.push(mapped);
    }
  }

  return {
    id: e.id,
    name: e.name,
    bodyPart: e.bodyPart,
    targetMuscles: e.targetMuscles,
    equipment: e.equipment,
    gifUrl: e.gifUrl,
    secondaryMuscles: e.secondaryMuscles,
    instructions: e.instructions,
    primaryMuscle,
    secondaryMusclesMapping,
  };
}

// All exercises enriched with muscle mappings
const allExercises: Exercise[] = (exercisesData as RawExercise[]).map(enrichExercise);

// Derive unique values for filters
const uniqueBodyParts = [...new Set(allExercises.map(e => e.bodyPart))].filter(Boolean).sort();
const uniqueEquipment = [...new Set(allExercises.map(e => e.equipment))].filter(Boolean).sort();
const uniqueTargets = [...new Set(allExercises.map(e => e.targetMuscles))].filter(Boolean).sort();

interface UseExercisesOptions {
  limit?: number;
  offset?: number;
  filters?: ExerciseFilters;
}

interface UseExercisesResult {
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useExercises(options: UseExercisesOptions = {}): UseExercisesResult {
  const { limit = 50, filters = {} } = options;
  const [displayCount, setDisplayCount] = useState(limit);

  // Filter exercises based on filters
  const filteredExercises = useMemo(() => {
    let result = allExercises;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(e => e.name.toLowerCase().includes(search));
    }

    if (filters.bodyPart) {
      result = result.filter(e => e.bodyPart.toLowerCase() === filters.bodyPart!.toLowerCase());
    }

    if (filters.equipment) {
      result = result.filter(e => e.equipment.toLowerCase() === filters.equipment!.toLowerCase());
    }

    if (filters.targetMuscles) {
      result = result.filter(e => e.targetMuscles.toLowerCase() === filters.targetMuscles!.toLowerCase());
    }

    return result;
  }, [filters.search, filters.bodyPart, filters.equipment, filters.targetMuscles]);

  // Get current page of exercises
  const exercises = useMemo(() => {
    return filteredExercises.slice(0, displayCount);
  }, [filteredExercises, displayCount]);

  const hasMore = displayCount < filteredExercises.length;

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(limit);
  }, [limit, filters.search, filters.bodyPart, filters.equipment, filters.targetMuscles]);

  const refetch = useCallback(() => {
    setDisplayCount(limit);
  }, [limit]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setDisplayCount(prev => prev + limit);
    }
  }, [hasMore, limit]);

  return { exercises, isLoading: false, error: null, refetch, loadMore, hasMore };
}

interface UseExerciseResult {
  exercise: Exercise | null;
  isLoading: boolean;
  error: string | null;
}

export function useExercise(id: string | null): UseExerciseResult {
  const exercise = useMemo(() => {
    if (!id) return null;
    return allExercises.find(e => e.id === id) || null;
  }, [id]);

  return { exercise, isLoading: false, error: null };
}

interface UseExerciseListsResult {
  bodyParts: string[];
  equipment: string[];
  targets: string[];
  isLoading: boolean;
  error: string | null;
}

export function useExerciseLists(): UseExerciseListsResult {
  return {
    bodyParts: uniqueBodyParts,
    equipment: uniqueEquipment,
    targets: uniqueTargets,
    isLoading: false,
    error: null,
  };
}
