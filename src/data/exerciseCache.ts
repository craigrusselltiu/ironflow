import { exercises as hardcodedExercises, CATEGORIES } from './exercises';
import type { Exercise } from '../types/exercise';

// Storage key for persisting API exercises
const CACHE_KEY = 'ironflow_exercise_cache';

// Map bodyPart to category for display purposes
function bodyPartToCategory(bodyPart: string): string {
  const mapping: Record<string, string> = {
    chest: CATEGORIES.PUSH,
    shoulders: CATEGORIES.PUSH,
    'upper arms': CATEGORIES.PUSH,
    back: CATEGORIES.PULL,
    'lower arms': CATEGORIES.PULL,
    'upper legs': CATEGORIES.LEGS,
    'lower legs': CATEGORIES.LEGS,
    waist: CATEGORIES.CORE,
    neck: CATEGORIES.PULL,
    cardio: CATEGORIES.CARDIO,
  };
  return mapping[bodyPart.toLowerCase()] || CATEGORIES.PUSH;
}

// Get hardcoded exercises (for fallback)
export function getHardcodedExercises() {
  return hardcodedExercises;
}

// Cached exercise type for storage - matches what muscle calculations expect
export interface CachedExercise {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  // Keep original API fields for reference
  bodyPart?: string;
  targetMuscles?: string;
  equipment?: string;
  gifUrl?: string;
}

// Load cached exercises from localStorage
function loadCache(): Map<string, CachedExercise> {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CachedExercise[];
      return new Map(parsed.map(e => [e.id, e]));
    }
  } catch {
    // Ignore parse errors
  }
  return new Map();
}

// Save cache to localStorage
function saveCache(cache: Map<string, CachedExercise>): void {
  try {
    const array = Array.from(cache.values());
    localStorage.setItem(CACHE_KEY, JSON.stringify(array));
  } catch {
    // Ignore storage errors
  }
}

// In-memory cache
let exerciseCache = loadCache();

// Format name to title case
function formatName(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Convert API exercise to cached format
// Expects exercise enriched by backend with primaryMuscle and secondaryMusclesMapping
function apiToCached(exercise: Exercise): CachedExercise {
  const category = bodyPartToCategory(exercise.bodyPart);

  // Use the muscle mappings from the backend (IronFlow muscle names)
  const primaryMuscles: string[] = exercise.primaryMuscle ? [exercise.primaryMuscle] : [];
  const secondaryMuscles: string[] = exercise.secondaryMusclesMapping || [];

  return {
    id: exercise.id,
    name: formatName(exercise.name),
    category,
    primaryMuscles,
    secondaryMuscles,
    bodyPart: exercise.bodyPart,
    targetMuscles: exercise.targetMuscles,
    equipment: exercise.equipment,
    gifUrl: exercise.gifUrl,
  };
}

// Add an API exercise to the cache
export function cacheExercise(exercise: Exercise): void {
  const cached = apiToCached(exercise);
  exerciseCache.set(exercise.id, cached);
  saveCache(exerciseCache);
}

// Get an exercise by ID (checks hardcoded first, then cache)
export function getExerciseById(id: string): CachedExercise | undefined {
  // Check hardcoded exercises first
  const hardcoded = hardcodedExercises.find(e => e.id === id);
  if (hardcoded) {
    return hardcoded as CachedExercise;
  }

  // Check cache for API exercises
  return exerciseCache.get(id);
}

// Get all exercises from both sources (for ExerciseLibrary)
export function getAllExercises(): CachedExercise[] {
  // Start with hardcoded exercises
  const all = new Map<string, CachedExercise>();

  for (const exercise of hardcodedExercises) {
    all.set(exercise.id, exercise as CachedExercise);
  }

  // Add cached API exercises (won't override hardcoded with same ID)
  for (const [id, exercise] of exerciseCache) {
    if (!all.has(id)) {
      all.set(id, exercise);
    }
  }

  return Array.from(all.values());
}

// Clear the cache (for testing/debugging)
export function clearExerciseCache(): void {
  exerciseCache.clear();
  localStorage.removeItem(CACHE_KEY);
}
