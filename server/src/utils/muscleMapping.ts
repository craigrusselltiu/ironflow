// Maps ExerciseDB body parts and targets to IronFlow muscle groups

export type IronFlowMuscle =
  | 'chest'
  | 'frontDelts'
  | 'sideDelts'
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
  shoulders: ['frontDelts', 'sideDelts', 'rearDelts'],
  'upper arms': ['biceps', 'triceps'],
  'lower arms': ['forearms'],
  'upper legs': ['quads', 'hamstrings', 'glutes'],
  'lower legs': ['calves'],
  waist: ['abs', 'lowerBack'],
  neck: ['traps'],
  cardio: [],
};

// Maps ExerciseDB target/muscle to single IronFlow muscle
// Supports both old RapidAPI names and new exercisedb.dev names
const targetMapping: Record<string, IronFlowMuscle | null> = {
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
  'lateral raise': 'sideDelts',
  'side delts': 'sideDelts',
  'front delts': 'frontDelts',
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

  // Cardio (no muscle mapping)
  'cardiovascular system': null,
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
