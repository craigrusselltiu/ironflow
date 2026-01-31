import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { Exercise, ExerciseFilters } from '../types/exercise';

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

  const fetchExercises = useCallback(async (offsetToUse: number, append = false) => {
    setIsLoading(true);
    setError(null);

    try {
      let endpoint = '';
      const queryParams = new URLSearchParams();
      queryParams.set('limit', limit.toString());
      queryParams.set('offset', offsetToUse.toString());

      if (filters.search) {
        endpoint = `/exercises/search?q=${encodeURIComponent(filters.search)}&${queryParams}`;
      } else if (filters.bodyPart) {
        endpoint = `/exercises/bodyPart/${encodeURIComponent(filters.bodyPart)}?${queryParams}`;
      } else if (filters.equipment) {
        endpoint = `/exercises/equipment/${encodeURIComponent(filters.equipment)}?${queryParams}`;
      } else if (filters.target) {
        endpoint = `/exercises/target/${encodeURIComponent(filters.target)}?${queryParams}`;
      } else {
        endpoint = `/exercises?${queryParams}`;
      }

      const data = await api.get<Exercise[]>(endpoint, { skipAuth: true });

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
    fetchExercises(0, false);
  }, [fetchExercises]);

  const refetch = useCallback(() => {
    setCurrentOffset(0);
    fetchExercises(0, false);
  }, [fetchExercises]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchExercises(currentOffset, true);
    }
  }, [fetchExercises, isLoading, hasMore, currentOffset]);

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

    const fetchExercise = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api.get<Exercise>(`/exercises/${id}`, { skipAuth: true });
        setExercise(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exercise');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
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
