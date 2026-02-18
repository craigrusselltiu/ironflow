import { exercises as hardcodedExercises, CATEGORIES } from './exercises';
import bundledExercises from './exercises.json';
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

// Map ExerciseDB target/muscle names to IronFlow muscle names
const targetToMuscle: Record<string, string | null> = {
  abs: 'abs', abdominals: 'abs', obliques: 'abs', core: 'abs', 'lower abs': 'abs',
  lats: 'lats', 'latissimus dorsi': 'lats',
  'upper back': 'upperBack', back: 'upperBack', rhomboids: 'upperBack',
  spine: 'lowerBack', 'lower back': 'lowerBack',
  delts: 'sideDelts', 'side delts': 'sideDelts',
  'front delts': 'frontDelts',
  'rear delts': 'rearDelts', 'rotator cuff': 'rearDelts',
  biceps: 'biceps', brachialis: 'biceps',
  triceps: 'triceps',
  forearms: 'forearms', 'wrist flexors': 'forearms', 'wrist extensors': 'forearms',
  'grip muscles': 'forearms', wrists: 'forearms', hands: 'forearms',
  pectorals: 'chest', chest: 'chest', 'serratus anterior': 'chest', 'upper chest': 'chest',
  traps: 'traps', trapezius: 'traps', 'levator scapulae': 'traps', sternocleidomastoid: 'traps',
  quads: 'quads', quadriceps: 'quads', adductors: 'quads', 'inner thighs': 'quads', groin: 'quads',
  hamstrings: 'hamstrings',
  glutes: 'glutes', abductors: 'glutes', 'hip flexors': 'glutes',
  calves: 'calves', soleus: 'calves', shins: 'calves', 'ankle stabilizers': 'calves',
  ankles: 'calves', feet: 'calves',
  'cardiovascular system': null,
};

function mapTarget(name: string): string | null {
  return targetToMuscle[name.toLowerCase()] ?? null;
}

// Build a lookup map from the bundled exercises.json
interface BundledExercise {
  id: string;
  name: string;
  bodyPart: string;
  targetMuscles: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

let bundledMap: Map<string, CachedExercise> | null = null;

function getBundledMap(): Map<string, CachedExercise> {
  if (bundledMap) return bundledMap;
  bundledMap = new Map();
  for (const ex of bundledExercises as BundledExercise[]) {
    const primary = mapTarget(ex.targetMuscles);
    const secondaryMuscles: string[] = [];
    for (const m of ex.secondaryMuscles) {
      const mapped = mapTarget(m);
      if (mapped && mapped !== primary) {
        secondaryMuscles.push(mapped);
      }
    }

    bundledMap.set(ex.id, {
      id: ex.id,
      name: formatName(ex.name),
      category: bodyPartToCategory(ex.bodyPart),
      primaryMuscles: primary ? [primary] : [],
      secondaryMuscles,
      bodyPart: ex.bodyPart,
      targetMuscles: ex.targetMuscles,
      equipment: ex.equipment,
      gifUrl: ex.gifUrl,
    });
  }
  return bundledMap;
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

// Get an exercise by ID (checks bundled JSON first, then cache, then hardcoded as fallback)
export function getExerciseById(id: string): CachedExercise | undefined {
  // Check bundled exercises.json data first (most complete data with gifUrl, instructions, etc.)
  const bundled = getBundledMap().get(id);
  if (bundled) {
    return bundled;
  }

  // Check cache for API exercises
  const cached = exerciseCache.get(id);
  if (cached) {
    return cached;
  }

  // Fallback to hardcoded exercises
  const hardcoded = hardcodedExercises.find(e => e.id === id);
  if (hardcoded) {
    return hardcoded as CachedExercise;
  }

  return undefined;
}

// Get all exercises from all sources (for ExerciseLibrary)
export function getAllExercises(): CachedExercise[] {
  const all = new Map<string, CachedExercise>();

  // Start with bundled exercises.json data (most complete)
  for (const [id, exercise] of getBundledMap()) {
    all.set(id, exercise);
  }

  // Add cached API exercises (won't override bundled)
  for (const [id, exercise] of exerciseCache) {
    if (!all.has(id)) {
      all.set(id, exercise);
    }
  }

  // Add hardcoded exercises as fallback (won't override existing)
  for (const exercise of hardcodedExercises) {
    if (!all.has(exercise.id)) {
      all.set(exercise.id, exercise as CachedExercise);
    }
  }

  return Array.from(all.values());
}

// Clear the cache (for testing/debugging)
export function clearExerciseCache(): void {
  exerciseCache.clear();
  localStorage.removeItem(CACHE_KEY);
}
