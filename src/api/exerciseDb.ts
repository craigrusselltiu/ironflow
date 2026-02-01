// Placeholder image for exercises (ExerciseDB has CORS restrictions on images)
export function getExerciseGifUrl(): string {
  return '/resource/home_banner.png';
}

// Exercise format returned by backend API
export interface ExerciseDbExercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// Note: All ExerciseDB API calls must go through the backend server
// due to CORS restrictions. Use the /api/exercises endpoints instead.
