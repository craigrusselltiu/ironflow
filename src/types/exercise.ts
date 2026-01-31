export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
  primaryMuscle: string | null;
  secondaryMusclesMapping: string[];
}

export interface ExerciseFilters {
  search?: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
}
