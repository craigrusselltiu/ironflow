const EXERCISEDB_BASE_URL = 'https://exercisedb.p.rapidapi.com';
const CACHE_TTL_DAYS = 7;

interface ExerciseDbExercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

function getHeaders(): Record<string, string> {
  const apiKey = process.env.EXERCISEDB_API_KEY;
  if (!apiKey) {
    throw new Error('EXERCISEDB_API_KEY environment variable is required');
  }
  return {
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  };
}

export async function fetchExercises(
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  const url = `${EXERCISEDB_BASE_URL}/exercises?limit=${limit}&offset=${offset}`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchExerciseById(id: string): Promise<ExerciseDbExercise> {
  const url = `${EXERCISEDB_BASE_URL}/exercises/exercise/${id}`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchExercisesByBodyPart(
  bodyPart: string,
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  const url = `${EXERCISEDB_BASE_URL}/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=${limit}&offset=${offset}`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchExercisesByTarget(
  target: string,
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  const url = `${EXERCISEDB_BASE_URL}/exercises/target/${encodeURIComponent(target)}?limit=${limit}&offset=${offset}`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchExercisesByEquipment(
  equipment: string,
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  const url = `${EXERCISEDB_BASE_URL}/exercises/equipment/${encodeURIComponent(equipment)}?limit=${limit}&offset=${offset}`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchExercisesByName(
  name: string,
  limit = 50,
  offset = 0
): Promise<ExerciseDbExercise[]> {
  const url = `${EXERCISEDB_BASE_URL}/exercises/name/${encodeURIComponent(name)}?limit=${limit}&offset=${offset}`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchBodyPartList(): Promise<string[]> {
  const url = `${EXERCISEDB_BASE_URL}/exercises/bodyPartList`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchEquipmentList(): Promise<string[]> {
  const url = `${EXERCISEDB_BASE_URL}/exercises/equipmentList`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  return response.json();
}

export async function fetchTargetList(): Promise<string[]> {
  const url = `${EXERCISEDB_BASE_URL}/exercises/targetList`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status}`);
  }
  return response.json();
}

export function isCacheExpired(fetchedAt: Date): boolean {
  const now = new Date();
  const diff = now.getTime() - fetchedAt.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= CACHE_TTL_DAYS;
}

export type { ExerciseDbExercise };
