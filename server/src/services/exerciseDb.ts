const EXERCISEDB_BASE_URL = 'https://exercisedb.dev/api/v1';
const CACHE_TTL_DAYS = 7;
const MEMORY_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// In-memory cache for when database is unavailable
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();

function getFromMemoryCache<T>(key: string): T | null {
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL_MS) {
    return cached.data as T;
  }
  return null;
}

function setMemoryCache(key: string, data: unknown): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

// Raw API response format from exercisedb.dev
interface ExerciseDbApiExercise {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

interface ExerciseDbApiResponse {
  success: boolean;
  metadata: {
    totalPages: number;
    totalExercises: number;
    currentPage: number;
    previousPage: string | null;
    nextPage: string | null;
  };
  data: ExerciseDbApiExercise[];
}

interface ExerciseDbSingleResponse {
  success: boolean;
  data: ExerciseDbApiExercise;
}

// Normalized exercise format used internally
interface ExerciseDbExercise {
  id: string;
  name: string;
  bodyPart: string;
  targetMuscles: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// Convert API response to normalized format
function normalizeExercise(e: ExerciseDbApiExercise): ExerciseDbExercise {
  return {
    id: e.exerciseId,
    name: e.name,
    bodyPart: e.bodyParts[0] || '',
    targetMuscles: e.targetMuscles[0] || '',
    equipment: e.equipments[0] || 'body weight',
    gifUrl: e.gifUrl,
    secondaryMuscles: e.secondaryMuscles,
    instructions: e.instructions,
  };
}

export async function fetchExercises(
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  const cacheKey = `exercises:${limit}:${offset}`;
  const cached = getFromMemoryCache<ExerciseDbExercise[]>(cacheKey);
  if (cached) return cached;

  const url = `${EXERCISEDB_BASE_URL}/exercises?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  const data: ExerciseDbApiResponse = await response.json();
  const result = data.data.map(normalizeExercise);
  setMemoryCache(cacheKey, result);
  return result;
}

export async function fetchExerciseById(id: string): Promise<ExerciseDbExercise> {
  const cacheKey = `exercise:${id}`;
  const cached = getFromMemoryCache<ExerciseDbExercise>(cacheKey);
  if (cached) return cached;

  const url = `${EXERCISEDB_BASE_URL}/exercises/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  const data: ExerciseDbSingleResponse = await response.json();
  const result = normalizeExercise(data.data);
  setMemoryCache(cacheKey, result);
  return result;
}

export async function fetchExercisesByMuscle(
  muscle: string,
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  const cacheKey = `muscle:${muscle}:${limit}:${offset}`;
  const cached = getFromMemoryCache<ExerciseDbExercise[]>(cacheKey);
  if (cached) return cached;

  const url = `${EXERCISEDB_BASE_URL}/muscles/${encodeURIComponent(muscle)}/exercises?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  const data: ExerciseDbApiResponse = await response.json();
  const result = data.data.map(normalizeExercise);
  setMemoryCache(cacheKey, result);
  return result;
}

export async function fetchExercisesByBodyPart(
  bodyPart: string,
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  const cacheKey = `bodypart:${bodyPart}:${limit}:${offset}`;
  const cached = getFromMemoryCache<ExerciseDbExercise[]>(cacheKey);
  if (cached) return cached;

  const url = `${EXERCISEDB_BASE_URL}/bodyparts/${encodeURIComponent(bodyPart)}/exercises?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  const data: ExerciseDbApiResponse = await response.json();
  const result = data.data.map(normalizeExercise);
  setMemoryCache(cacheKey, result);
  return result;
}

export async function fetchExercisesByTarget(
  target: string,
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  // Use muscle endpoint for target filtering
  return fetchExercisesByMuscle(target, limit, offset);
}

export async function fetchExercisesByEquipment(
  equipment: string,
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  const cacheKey = `equipment:${equipment}:${limit}:${offset}`;
  const cached = getFromMemoryCache<ExerciseDbExercise[]>(cacheKey);
  if (cached) return cached;

  const url = `${EXERCISEDB_BASE_URL}/equipments/${encodeURIComponent(equipment)}/exercises?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  const data: ExerciseDbApiResponse = await response.json();
  const result = data.data.map(normalizeExercise);
  setMemoryCache(cacheKey, result);
  return result;
}

export async function fetchExercisesByName(
  name: string,
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  const cacheKey = `search:${name}:${limit}:${offset}`;
  const cached = getFromMemoryCache<ExerciseDbExercise[]>(cacheKey);
  if (cached) return cached;

  const url = `${EXERCISEDB_BASE_URL}/exercises?limit=${limit}&offset=${offset}&search=${encodeURIComponent(name)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  const data: ExerciseDbApiResponse = await response.json();
  const result = data.data.map(normalizeExercise);
  setMemoryCache(cacheKey, result);
  return result;
}

export async function fetchBodyPartList(): Promise<string[]> {
  const cacheKey = 'list:bodyparts';
  const cached = getFromMemoryCache<string[]>(cacheKey);
  if (cached) return cached;

  const url = `${EXERCISEDB_BASE_URL}/bodyparts`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  const data: { success: boolean; data: { name: string }[] } = await response.json();
  const result = data.data.map(item => item.name);
  setMemoryCache(cacheKey, result);
  return result;
}

export async function fetchEquipmentList(): Promise<string[]> {
  const cacheKey = 'list:equipments';
  const cached = getFromMemoryCache<string[]>(cacheKey);
  if (cached) return cached;

  const url = `${EXERCISEDB_BASE_URL}/equipments`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  const data: { success: boolean; data: { name: string }[] } = await response.json();
  const result = data.data.map(item => item.name);
  setMemoryCache(cacheKey, result);
  return result;
}

export async function fetchTargetList(): Promise<string[]> {
  const cacheKey = 'list:muscles';
  const cached = getFromMemoryCache<string[]>(cacheKey);
  if (cached) return cached;

  const url = `${EXERCISEDB_BASE_URL}/muscles`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  const data: { success: boolean; data: { name: string }[] } = await response.json();
  const result = data.data.map(item => item.name);
  setMemoryCache(cacheKey, result);
  return result;
}

export function isCacheExpired(fetchedAt: Date): boolean {
  const now = new Date();
  const diff = now.getTime() - fetchedAt.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= CACHE_TTL_DAYS;
}

export type { ExerciseDbExercise };
