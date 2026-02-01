import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { getExerciseGifUrl, type ExerciseDbExercise } from '../api/exerciseDb';
import type { Exercise, ExerciseFilters } from '../types/exercise';

// Map ExerciseDB target/muscle to IronFlow muscle name
// Supports both old RapidAPI names and new exercisedb.dev names
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
  delts: 'frontDelts',
  deltoids: 'frontDelts',
  shoulders: 'frontDelts',
  'rear deltoids': 'rearDelts',
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

// Enrich exercise with muscle mappings (same logic as backend)
function enrichExercise(e: ExerciseDbExercise): Exercise {
  const primaryMuscle = mapTargetToMuscle(e.target);
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
    target: e.target,
    equipment: e.equipment,
    gifUrl: getExerciseGifUrl(),
    secondaryMuscles: e.secondaryMuscles,
    instructions: e.instructions,
    primaryMuscle,
    secondaryMusclesMapping,
  };
}

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
  const { limit = 50, offset = 0, filters = {} } = options;
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentOffset, setCurrentOffset] = useState(offset);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async (offsetToUse: number, append = false) => {
    setIsLoading(true);
    setError(null);

    try {
      let endpoint: string;
      if (filters.search) {
        endpoint = `/exercises/search?q=${encodeURIComponent(filters.search)}&limit=${limit}&offset=${offsetToUse}`;
      } else if (filters.bodyPart) {
        endpoint = `/exercises/bodyPart/${encodeURIComponent(filters.bodyPart)}?limit=${limit}&offset=${offsetToUse}`;
      } else if (filters.equipment) {
        endpoint = `/exercises/equipment/${encodeURIComponent(filters.equipment)}?limit=${limit}&offset=${offsetToUse}`;
      } else if (filters.target) {
        endpoint = `/exercises/target/${encodeURIComponent(filters.target)}?limit=${limit}&offset=${offsetToUse}`;
      } else {
        endpoint = `/exercises?limit=${limit}&offset=${offsetToUse}`;
      }

      const rawData = await api.get<ExerciseDbExercise[]>(endpoint, { skipAuth: true });
      const data = rawData.map(enrichExercise);

      if (append) {
        setExercises(prev => [...prev, ...data]);
      } else {
        setExercises(data);
      }

      setHasMore(data.length === limit);
      setCurrentOffset(offsetToUse + limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
    } finally {
      setIsLoading(false);
    }
  }, [limit, filters.search, filters.bodyPart, filters.equipment, filters.target]);

  useEffect(() => {
    setCurrentOffset(0);
    fetchData(0, false);
  }, [fetchData]);

  const refetch = useCallback(() => {
    setCurrentOffset(0);
    fetchData(0, false);
  }, [fetchData]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchData(currentOffset, true);
    }
  }, [fetchData, isLoading, hasMore, currentOffset]);

  return { exercises, isLoading, error, refetch, loadMore, hasMore };
}

interface UseExerciseResult {
  exercise: Exercise | null;
  isLoading: boolean;
  error: string | null;
}

export function useExercise(id: string | null): UseExerciseResult {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setExercise(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const rawData = await api.get<ExerciseDbExercise>(`/exercises/${id}`, { skipAuth: true });
        setExercise(enrichExercise(rawData));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exercise');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { exercise, isLoading, error };
}

interface UseExerciseListsResult {
  bodyParts: string[];
  equipment: string[];
  targets: string[];
  isLoading: boolean;
  error: string | null;
}

export function useExerciseLists(): UseExerciseListsResult {
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [targets, setTargets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [bodyPartsData, equipmentData, targetsData] = await Promise.all([
          api.get<string[]>('/exercises/lists/bodyParts', { skipAuth: true }),
          api.get<string[]>('/exercises/lists/equipment', { skipAuth: true }),
          api.get<string[]>('/exercises/lists/targets', { skipAuth: true }),
        ]);
        setBodyParts(bodyPartsData);
        setEquipment(equipmentData);
        setTargets(targetsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exercise lists');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, []);

  return { bodyParts, equipment, targets, isLoading, error };
}
