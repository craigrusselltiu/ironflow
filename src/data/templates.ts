import type { Template } from '../storage/types';

export const SYSTEM_TEMPLATES: Template[] = [
  {
    id: 'system-ppl',
    name: 'Push / Pull / Legs',
    description: 'Classic 6-day split hitting each muscle group twice per week. Push (chest, shoulders, triceps), Pull (back, biceps), Legs (quads, hamstrings, glutes, calves).',
    isSystem: true,
    exercises: [
      // Monday - Push
      { exerciseId: 'EIeI8Vf', day: 0, orderIndex: 0, plannedSets: 4, plannedReps: 8 },   // Barbell bench press
      { exerciseId: 'ns0SIbU', day: 0, orderIndex: 1, plannedSets: 3, plannedReps: 10 },  // Dumbbell incline bench press
      { exerciseId: 'kTbSH9h', day: 0, orderIndex: 2, plannedSets: 3, plannedReps: 10 },  // Barbell seated overhead press
      { exerciseId: 'DsgkuIt', day: 0, orderIndex: 3, plannedSets: 3, plannedReps: 15 },  // Dumbbell lateral raise
      { exerciseId: 'gAwDzB3', day: 0, orderIndex: 4, plannedSets: 3, plannedReps: 12 },  // Cable triceps pushdown
      // Tuesday - Pull
      { exerciseId: 'eZyBC3j', day: 1, orderIndex: 0, plannedSets: 4, plannedReps: 8 },   // Barbell bent over row
      { exerciseId: 'lBDjFxJ', day: 1, orderIndex: 1, plannedSets: 3, plannedReps: 8 },   // Pull-up
      { exerciseId: 'fUBheHs', day: 1, orderIndex: 2, plannedSets: 3, plannedReps: 12 },  // Cable seated row
      { exerciseId: '25GPyDY', day: 1, orderIndex: 3, plannedSets: 3, plannedReps: 10 },  // Barbell curl
      { exerciseId: 'slDvUAU', day: 1, orderIndex: 4, plannedSets: 3, plannedReps: 12 },  // Dumbbell hammer curl
      // Wednesday - Legs
      { exerciseId: 'qXTaZnJ', day: 2, orderIndex: 0, plannedSets: 4, plannedReps: 8 },   // Barbell full squat
      { exerciseId: 'wQ2c4XD', day: 2, orderIndex: 1, plannedSets: 3, plannedReps: 10 },  // Barbell romanian deadlift
      { exerciseId: '10Z2DXU', day: 2, orderIndex: 2, plannedSets: 3, plannedReps: 12 },  // Sled 45° leg press
      { exerciseId: '17lJ1kr', day: 2, orderIndex: 3, plannedSets: 3, plannedReps: 12 },  // Lever lying leg curl
      { exerciseId: '8ozhUIZ', day: 2, orderIndex: 4, plannedSets: 4, plannedReps: 15 },  // Barbell standing calf raise
      // Thursday - Push
      { exerciseId: 'A6wtbuL', day: 3, orderIndex: 0, plannedSets: 4, plannedReps: 8 },   // Dumbbell standing overhead press
      { exerciseId: 'SpYC0Kp', day: 3, orderIndex: 1, plannedSets: 3, plannedReps: 10 },  // Dumbbell bench press
      { exerciseId: 'DsgkuIt', day: 3, orderIndex: 2, plannedSets: 3, plannedReps: 15 },  // Dumbbell lateral raise
      { exerciseId: 'J6Dx1Mu', day: 3, orderIndex: 3, plannedSets: 3, plannedReps: 10 },  // Barbell close-grip bench press
      { exerciseId: 'PdmaD0N', day: 3, orderIndex: 4, plannedSets: 3, plannedReps: 12 },  // Dumbbell standing triceps extension
      // Friday - Pull
      { exerciseId: 'Qqi7bko', day: 4, orderIndex: 0, plannedSets: 4, plannedReps: 8 },   // Wide grip pull-up
      { exerciseId: 'BJ0Hz5L', day: 4, orderIndex: 1, plannedSets: 3, plannedReps: 10 },  // Dumbbell bent over row
      { exerciseId: 'ecpY0rH', day: 4, orderIndex: 2, plannedSets: 3, plannedReps: 12 },  // Reverse grip lat pulldown
      { exerciseId: 'ae9UoXQ', day: 4, orderIndex: 3, plannedSets: 3, plannedReps: 10 },  // Dumbbell incline curl
      { exerciseId: 'xiA6lRr', day: 4, orderIndex: 4, plannedSets: 3, plannedReps: 12 },  // Dumbbell seated bicep curl
      // Saturday - Legs
      { exerciseId: 'ila4NZS', day: 5, orderIndex: 0, plannedSets: 4, plannedReps: 6 },   // Barbell deadlift
      { exerciseId: 'zG0zs85', day: 5, orderIndex: 1, plannedSets: 3, plannedReps: 10 },  // Barbell front squat
      { exerciseId: 'my33uHU', day: 5, orderIndex: 2, plannedSets: 3, plannedReps: 12 },  // Lever leg extension
      { exerciseId: '17lJ1kr', day: 5, orderIndex: 3, plannedSets: 3, plannedReps: 12 },  // Lever lying leg curl
      { exerciseId: '8ozhUIZ', day: 5, orderIndex: 4, plannedSets: 4, plannedReps: 15 },  // Barbell standing calf raise
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'system-upper-lower',
    name: 'Upper / Lower',
    description: '4-day split alternating upper and lower body. Great balance of volume and recovery for intermediate lifters.',
    isSystem: true,
    exercises: [
      // Monday - Upper
      { exerciseId: 'EIeI8Vf', day: 0, orderIndex: 0, plannedSets: 4, plannedReps: 8 },   // Barbell bench press
      { exerciseId: 'eZyBC3j', day: 0, orderIndex: 1, plannedSets: 4, plannedReps: 8 },   // Barbell bent over row
      { exerciseId: 'kTbSH9h', day: 0, orderIndex: 2, plannedSets: 3, plannedReps: 10 },  // Barbell seated overhead press
      { exerciseId: 'lBDjFxJ', day: 0, orderIndex: 3, plannedSets: 3, plannedReps: 8 },   // Pull-up
      { exerciseId: '25GPyDY', day: 0, orderIndex: 4, plannedSets: 3, plannedReps: 10 },  // Barbell curl
      { exerciseId: 'gAwDzB3', day: 0, orderIndex: 5, plannedSets: 3, plannedReps: 12 },  // Cable triceps pushdown
      // Tuesday - Lower
      { exerciseId: 'qXTaZnJ', day: 1, orderIndex: 0, plannedSets: 4, plannedReps: 8 },   // Barbell full squat
      { exerciseId: 'wQ2c4XD', day: 1, orderIndex: 1, plannedSets: 3, plannedReps: 10 },  // Barbell romanian deadlift
      { exerciseId: '10Z2DXU', day: 1, orderIndex: 2, plannedSets: 3, plannedReps: 12 },  // Sled 45° leg press
      { exerciseId: '17lJ1kr', day: 1, orderIndex: 3, plannedSets: 3, plannedReps: 12 },  // Lever lying leg curl
      { exerciseId: '8ozhUIZ', day: 1, orderIndex: 4, plannedSets: 4, plannedReps: 15 },  // Barbell standing calf raise
      // Thursday - Upper
      { exerciseId: 'SpYC0Kp', day: 3, orderIndex: 0, plannedSets: 4, plannedReps: 10 },  // Dumbbell bench press
      { exerciseId: 'BJ0Hz5L', day: 3, orderIndex: 1, plannedSets: 4, plannedReps: 10 },  // Dumbbell bent over row
      { exerciseId: 'A6wtbuL', day: 3, orderIndex: 2, plannedSets: 3, plannedReps: 10 },  // Dumbbell standing overhead press
      { exerciseId: 'fUBheHs', day: 3, orderIndex: 3, plannedSets: 3, plannedReps: 12 },  // Cable seated row
      { exerciseId: 'slDvUAU', day: 3, orderIndex: 4, plannedSets: 3, plannedReps: 12 },  // Dumbbell hammer curl
      { exerciseId: 'PdmaD0N', day: 3, orderIndex: 5, plannedSets: 3, plannedReps: 12 },  // Dumbbell standing triceps extension
      // Friday - Lower
      { exerciseId: 'ila4NZS', day: 4, orderIndex: 0, plannedSets: 4, plannedReps: 6 },   // Barbell deadlift
      { exerciseId: 'zG0zs85', day: 4, orderIndex: 1, plannedSets: 3, plannedReps: 10 },  // Barbell front squat
      { exerciseId: 'my33uHU', day: 4, orderIndex: 2, plannedSets: 3, plannedReps: 12 },  // Lever leg extension
      { exerciseId: '17lJ1kr', day: 4, orderIndex: 3, plannedSets: 3, plannedReps: 12 },  // Lever lying leg curl
      { exerciseId: '8ozhUIZ', day: 4, orderIndex: 4, plannedSets: 4, plannedReps: 15 },  // Barbell standing calf raise
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'system-full-body',
    name: 'Full Body',
    description: '3-day full body program focusing on compound movements. Ideal for beginners or those with limited training days.',
    isSystem: true,
    exercises: [
      // Monday
      { exerciseId: 'qXTaZnJ', day: 0, orderIndex: 0, plannedSets: 4, plannedReps: 8 },   // Barbell full squat
      { exerciseId: 'EIeI8Vf', day: 0, orderIndex: 1, plannedSets: 4, plannedReps: 8 },   // Barbell bench press
      { exerciseId: 'eZyBC3j', day: 0, orderIndex: 2, plannedSets: 4, plannedReps: 8 },   // Barbell bent over row
      { exerciseId: 'DsgkuIt', day: 0, orderIndex: 3, plannedSets: 3, plannedReps: 15 },  // Dumbbell lateral raise
      { exerciseId: '8ozhUIZ', day: 0, orderIndex: 4, plannedSets: 3, plannedReps: 15 },  // Barbell standing calf raise
      // Wednesday
      { exerciseId: 'ila4NZS', day: 2, orderIndex: 0, plannedSets: 4, plannedReps: 6 },   // Barbell deadlift
      { exerciseId: 'kTbSH9h', day: 2, orderIndex: 1, plannedSets: 4, plannedReps: 8 },   // Barbell seated overhead press
      { exerciseId: 'lBDjFxJ', day: 2, orderIndex: 2, plannedSets: 4, plannedReps: 8 },   // Pull-up
      { exerciseId: '25GPyDY', day: 2, orderIndex: 3, plannedSets: 3, plannedReps: 10 },  // Barbell curl
      { exerciseId: 'gAwDzB3', day: 2, orderIndex: 4, plannedSets: 3, plannedReps: 12 },  // Cable triceps pushdown
      // Friday
      { exerciseId: 'zG0zs85', day: 4, orderIndex: 0, plannedSets: 4, plannedReps: 8 },   // Barbell front squat
      { exerciseId: 'SpYC0Kp', day: 4, orderIndex: 1, plannedSets: 4, plannedReps: 10 },  // Dumbbell bench press
      { exerciseId: 'BJ0Hz5L', day: 4, orderIndex: 2, plannedSets: 4, plannedReps: 10 },  // Dumbbell bent over row
      { exerciseId: 'A6wtbuL', day: 4, orderIndex: 3, plannedSets: 3, plannedReps: 10 },  // Dumbbell standing overhead press
      { exerciseId: '17lJ1kr', day: 4, orderIndex: 4, plannedSets: 3, plannedReps: 12 },  // Lever lying leg curl
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];
