import { MUSCLE_GROUPS } from '../data/exercises';
import { getFatigueColor } from './muscleCalculations';

// Maps ASCII regions to muscle groups
const FRONT_MUSCLE_MAP = {
  'HEAD': null,
  'NECK': MUSCLE_GROUPS.TRAPS,
  'SHOULDER_L': MUSCLE_GROUPS.FRONT_DELTS,
  'SHOULDER_R': MUSCLE_GROUPS.FRONT_DELTS,
  'CHEST': MUSCLE_GROUPS.CHEST,
  'BICEP_L': MUSCLE_GROUPS.BICEPS,
  'BICEP_R': MUSCLE_GROUPS.BICEPS,
  'ABS': MUSCLE_GROUPS.ABS,
  'QUAD_L': MUSCLE_GROUPS.QUADS,
  'QUAD_R': MUSCLE_GROUPS.QUADS,
  'CALF_L': MUSCLE_GROUPS.CALVES,
  'CALF_R': MUSCLE_GROUPS.CALVES,
};

const BACK_MUSCLE_MAP = {
  'HEAD': null,
  'TRAPS': MUSCLE_GROUPS.TRAPS,
  'SHOULDER_L': MUSCLE_GROUPS.REAR_DELTS,
  'SHOULDER_R': MUSCLE_GROUPS.REAR_DELTS,
  'UPPER_BACK': MUSCLE_GROUPS.UPPER_BACK,
  'LATS': MUSCLE_GROUPS.LATS,
  'TRICEP_L': MUSCLE_GROUPS.TRICEPS,
  'TRICEP_R': MUSCLE_GROUPS.TRICEPS,
  'LOWER_BACK': MUSCLE_GROUPS.LOWER_BACK,
  'GLUTE_L': MUSCLE_GROUPS.GLUTES,
  'GLUTE_R': MUSCLE_GROUPS.GLUTES,
  'HAM_L': MUSCLE_GROUPS.HAMSTRINGS,
  'HAM_R': MUSCLE_GROUPS.HAMSTRINGS,
  'CALF_L': MUSCLE_GROUPS.CALVES,
  'CALF_R': MUSCLE_GROUPS.CALVES,
};

const DEFAULT_COLOR = '#555';

export function generateAsciiBody(fatigue, view = 'front') {
  const muscleMap = view === 'front' ? FRONT_MUSCLE_MAP : BACK_MUSCLE_MAP;

  const getColor = (region) => {
    const muscle = muscleMap[region];
    if (!muscle) return DEFAULT_COLOR;
    const fatigueLevel = fatigue[muscle] || 0;
    return fatigueLevel > 0 ? getFatigueColor(fatigueLevel) : DEFAULT_COLOR;
  };

  const colorSpan = (text, region) => {
    const color = getColor(region);
    return { text, color };
  };

  if (view === 'front') {
    return generateFrontView(colorSpan);
  } else {
    return generateBackView(colorSpan);
  }
}

function generateFrontView(colorSpan) {
  // Front view ASCII art with muscle regions
  return [
    [
      { text: '       ', color: 'transparent' },
      colorSpan('O', 'HEAD'),
    ],
    [
      { text: '      ', color: 'transparent' },
      colorSpan('/', 'SHOULDER_L'),
      colorSpan('█', 'CHEST'),
      colorSpan('█', 'CHEST'),
      colorSpan('█', 'CHEST'),
      colorSpan('\\', 'SHOULDER_R'),
    ],
    [
      { text: '     ', color: 'transparent' },
      colorSpan('│', 'BICEP_L'),
      colorSpan('█', 'CHEST'),
      colorSpan('█', 'CHEST'),
      colorSpan('█', 'CHEST'),
      colorSpan('█', 'CHEST'),
      colorSpan('█', 'CHEST'),
      colorSpan('│', 'BICEP_R'),
    ],
    [
      { text: '     ', color: 'transparent' },
      colorSpan('│', 'BICEP_L'),
      { text: ' ', color: 'transparent' },
      colorSpan('█', 'ABS'),
      colorSpan('█', 'ABS'),
      colorSpan('█', 'ABS'),
      { text: ' ', color: 'transparent' },
      colorSpan('│', 'BICEP_R'),
    ],
    [
      { text: '      ', color: 'transparent' },
      { text: ' ', color: 'transparent' },
      colorSpan('█', 'ABS'),
      colorSpan('█', 'ABS'),
      colorSpan('█', 'ABS'),
    ],
    [
      { text: '      ', color: 'transparent' },
      colorSpan('█', 'QUAD_L'),
      colorSpan('█', 'QUAD_L'),
      { text: ' ', color: 'transparent' },
      colorSpan('█', 'QUAD_R'),
      colorSpan('█', 'QUAD_R'),
    ],
    [
      { text: '      ', color: 'transparent' },
      colorSpan('█', 'QUAD_L'),
      colorSpan('█', 'QUAD_L'),
      { text: ' ', color: 'transparent' },
      colorSpan('█', 'QUAD_R'),
      colorSpan('█', 'QUAD_R'),
    ],
    [
      { text: '      ', color: 'transparent' },
      colorSpan('█', 'CALF_L'),
      colorSpan('█', 'CALF_L'),
      { text: ' ', color: 'transparent' },
      colorSpan('█', 'CALF_R'),
      colorSpan('█', 'CALF_R'),
    ],
    [
      { text: '      ', color: 'transparent' },
      colorSpan('▀', 'CALF_L'),
      colorSpan('▀', 'CALF_L'),
      { text: ' ', color: 'transparent' },
      colorSpan('▀', 'CALF_R'),
      colorSpan('▀', 'CALF_R'),
    ],
  ];
}

function generateBackView(colorSpan) {
  // Back view ASCII art with muscle regions
  return [
    [
      { text: '       ', color: 'transparent' },
      colorSpan('O', 'HEAD'),
    ],
    [
      { text: '      ', color: 'transparent' },
      colorSpan('/', 'SHOULDER_L'),
      colorSpan('█', 'TRAPS'),
      colorSpan('█', 'TRAPS'),
      colorSpan('█', 'TRAPS'),
      colorSpan('\\', 'SHOULDER_R'),
    ],
    [
      { text: '     ', color: 'transparent' },
      colorSpan('│', 'TRICEP_L'),
      colorSpan('█', 'UPPER_BACK'),
      colorSpan('█', 'UPPER_BACK'),
      colorSpan('█', 'UPPER_BACK'),
      colorSpan('█', 'UPPER_BACK'),
      colorSpan('█', 'UPPER_BACK'),
      colorSpan('│', 'TRICEP_R'),
    ],
    [
      { text: '     ', color: 'transparent' },
      colorSpan('│', 'TRICEP_L'),
      { text: ' ', color: 'transparent' },
      colorSpan('█', 'LATS'),
      colorSpan('█', 'LOWER_BACK'),
      colorSpan('█', 'LATS'),
      { text: ' ', color: 'transparent' },
      colorSpan('│', 'TRICEP_R'),
    ],
    [
      { text: '      ', color: 'transparent' },
      { text: ' ', color: 'transparent' },
      colorSpan('█', 'LOWER_BACK'),
      colorSpan('█', 'LOWER_BACK'),
      colorSpan('█', 'LOWER_BACK'),
    ],
    [
      { text: '      ', color: 'transparent' },
      colorSpan('█', 'GLUTE_L'),
      colorSpan('█', 'GLUTE_L'),
      { text: ' ', color: 'transparent' },
      colorSpan('█', 'GLUTE_R'),
      colorSpan('█', 'GLUTE_R'),
    ],
    [
      { text: '      ', color: 'transparent' },
      colorSpan('█', 'HAM_L'),
      colorSpan('█', 'HAM_L'),
      { text: ' ', color: 'transparent' },
      colorSpan('█', 'HAM_R'),
      colorSpan('█', 'HAM_R'),
    ],
    [
      { text: '      ', color: 'transparent' },
      colorSpan('█', 'CALF_L'),
      colorSpan('█', 'CALF_L'),
      { text: ' ', color: 'transparent' },
      colorSpan('█', 'CALF_R'),
      colorSpan('█', 'CALF_R'),
    ],
    [
      { text: '      ', color: 'transparent' },
      colorSpan('▀', 'CALF_L'),
      colorSpan('▀', 'CALF_L'),
      { text: ' ', color: 'transparent' },
      colorSpan('▀', 'CALF_R'),
      colorSpan('▀', 'CALF_R'),
    ],
  ];
}
