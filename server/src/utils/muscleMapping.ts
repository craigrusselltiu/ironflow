// Maps ExerciseDB body parts and targets to IronFlow muscle groups

export type IronFlowMuscle =
  | 'chest'
  | 'frontDelts'
  | 'rearDelts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'traps'
  | 'upperBack'
  | 'lats'
  | 'lowerBack'
  | 'abs'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves';

// Maps ExerciseDB bodyPart to IronFlow muscles
const bodyPartMapping: Record<string, IronFlowMuscle[]> = {
  back: ['upperBack', 'lats'],
  chest: ['chest'],
  shoulders: ['frontDelts', 'rearDelts'],
  'upper arms': ['biceps', 'triceps'],
  'lower arms': ['forearms'],
  'upper legs': ['quads', 'hamstrings', 'glutes'],
  'lower legs': ['calves'],
  waist: ['abs', 'lowerBack'],
  neck: ['traps'],
  cardio: [],
};

// Maps ExerciseDB target to single IronFlow muscle
const targetMapping: Record<string, IronFlowMuscle | null> = {
  abs: 'abs',
  abductors: 'glutes',
  adductors: 'quads',
  biceps: 'biceps',
  calves: 'calves',
  'cardiovascular system': null,
  delts: 'frontDelts',
  forearms: 'forearms',
  glutes: 'glutes',
  hamstrings: 'hamstrings',
  lats: 'lats',
  'levator scapulae': 'traps',
  pectorals: 'chest',
  quads: 'quads',
  'serratus anterior': 'chest',
  spine: 'lowerBack',
  traps: 'traps',
  triceps: 'triceps',
  'upper back': 'upperBack',
};

export function mapBodyPartToMuscles(bodyPart: string): IronFlowMuscle[] {
  return bodyPartMapping[bodyPart.toLowerCase()] || [];
}

export function mapTargetToMuscle(target: string): IronFlowMuscle | null {
  return targetMapping[target.toLowerCase()] ?? null;
}

export function getExerciseMuscles(
  bodyPart: string,
  target: string,
  secondaryMuscles: string[]
): { primary: IronFlowMuscle | null; secondary: IronFlowMuscle[] } {
  const primary = mapTargetToMuscle(target);

  const secondary: IronFlowMuscle[] = [];
  for (const muscle of secondaryMuscles) {
    const mapped = mapTargetToMuscle(muscle);
    if (mapped && mapped !== primary) {
      secondary.push(mapped);
    }
  }

  // Add body part muscles as secondary if not already included
  const bodyPartMuscles = mapBodyPartToMuscles(bodyPart);
  for (const muscle of bodyPartMuscles) {
    if (muscle !== primary && !secondary.includes(muscle)) {
      secondary.push(muscle);
    }
  }

  return { primary, secondary };
}
