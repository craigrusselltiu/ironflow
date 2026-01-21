import { MUSCLE_GROUPS } from '../data/exercises';
import { getFatigueColor } from './muscleCalculations';

const FRONT_MUSCLE_MAP = {
  'HEAD': null,
  'NECK': MUSCLE_GROUPS.TRAPS,
  'DELT_L': MUSCLE_GROUPS.FRONT_DELTS,
  'DELT_R': MUSCLE_GROUPS.FRONT_DELTS,
  'CHEST': MUSCLE_GROUPS.CHEST,
  'BICEP_L': MUSCLE_GROUPS.BICEPS,
  'BICEP_R': MUSCLE_GROUPS.BICEPS,
  'FOREARM_L': MUSCLE_GROUPS.BICEPS,
  'FOREARM_R': MUSCLE_GROUPS.BICEPS,
  'ABS': MUSCLE_GROUPS.ABS,
  'OBLIQUE_L': MUSCLE_GROUPS.ABS,
  'OBLIQUE_R': MUSCLE_GROUPS.ABS,
  'QUAD_L': MUSCLE_GROUPS.QUADS,
  'QUAD_R': MUSCLE_GROUPS.QUADS,
  'CALF_L': MUSCLE_GROUPS.CALVES,
  'CALF_R': MUSCLE_GROUPS.CALVES,
};

const BACK_MUSCLE_MAP = {
  'HEAD': null,
  'TRAP': MUSCLE_GROUPS.TRAPS,
  'DELT_L': MUSCLE_GROUPS.REAR_DELTS,
  'DELT_R': MUSCLE_GROUPS.REAR_DELTS,
  'UPPER_BACK': MUSCLE_GROUPS.UPPER_BACK,
  'LAT_L': MUSCLE_GROUPS.LATS,
  'LAT_R': MUSCLE_GROUPS.LATS,
  'TRICEP_L': MUSCLE_GROUPS.TRICEPS,
  'TRICEP_R': MUSCLE_GROUPS.TRICEPS,
  'FOREARM_L': MUSCLE_GROUPS.TRICEPS,
  'FOREARM_R': MUSCLE_GROUPS.TRICEPS,
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

  const c = (text, region) => ({ text, color: getColor(region) });

  if (view === 'front') {
    return [
      // Head
      [c('     ▄███▄     ', 'HEAD')],
      [c('     █████     ', 'HEAD')],
      [c('     ▀███▀     ', 'HEAD')],
      // Neck
      [c('      ███      ', 'NECK')],
      // Shoulders + upper chest
      [c('  ▄██', 'DELT_L'), c('█████', 'CHEST'), c('██▄  ', 'DELT_R')],
      [c(' ████', 'DELT_L'), c('█████', 'CHEST'), c('████ ', 'DELT_R')],
      // Arms + chest
      [c('██', 'BICEP_L'), c('██', 'DELT_L'), c('███████', 'CHEST'), c('██', 'DELT_R'), c('██', 'BICEP_R')],
      [c('██', 'BICEP_L'), c('█', 'OBLIQUE_L'), c('███████', 'CHEST'), c('█', 'OBLIQUE_R'), c('██', 'BICEP_R')],
      [c('██', 'BICEP_L'), c('█', 'OBLIQUE_L'), c('███████', 'CHEST'), c('█', 'OBLIQUE_R'), c('██', 'BICEP_R')],
      // Arms + abs
      [c('██', 'BICEP_L'), c('█', 'OBLIQUE_L'), c('███████', 'ABS'), c('█', 'OBLIQUE_R'), c('██', 'BICEP_R')],
      [c('▐█', 'FOREARM_L'), c('█', 'OBLIQUE_L'), c('███████', 'ABS'), c('█', 'OBLIQUE_R'), c('█▌', 'FOREARM_R')],
      [c(' █', 'FOREARM_L'), c('█', 'OBLIQUE_L'), c('███████', 'ABS'), c('█', 'OBLIQUE_R'), c('█ ', 'FOREARM_R')],
      [c(' ▀', 'FOREARM_L'), c('█', 'OBLIQUE_L'), c('███████', 'ABS'), c('█', 'OBLIQUE_R'), c('▀ ', 'FOREARM_R')],
      // Lower abs
      [c('  ▀', 'OBLIQUE_L'), c('███████', 'ABS'), c('▀  ', 'OBLIQUE_R')],
      [c('   ', 'OBLIQUE_L'), c('▀▀▀▀▀▀▀', 'ABS'), c('   ', 'OBLIQUE_R')],
      // Quads
      [c('    ███ ███    ', 'QUAD_L')],
      [c('   ', 'QUAD_L'), c('███', 'QUAD_L'), c(' ', 'HEAD'), c('███', 'QUAD_R'), c('   ', 'QUAD_R')],
      [c('   ', 'QUAD_L'), c('███', 'QUAD_L'), c(' ', 'HEAD'), c('███', 'QUAD_R'), c('   ', 'QUAD_R')],
      [c('   ', 'QUAD_L'), c('███', 'QUAD_L'), c(' ', 'HEAD'), c('███', 'QUAD_R'), c('   ', 'QUAD_R')],
      [c('   ', 'QUAD_L'), c('▐█▌', 'QUAD_L'), c(' ', 'HEAD'), c('▐█▌', 'QUAD_R'), c('   ', 'QUAD_R')],
      // Calves
      [c('   ', 'CALF_L'), c('▐█▌', 'CALF_L'), c(' ', 'HEAD'), c('▐█▌', 'CALF_R'), c('   ', 'CALF_R')],
      [c('   ', 'CALF_L'), c('▐█▌', 'CALF_L'), c(' ', 'HEAD'), c('▐█▌', 'CALF_R'), c('   ', 'CALF_R')],
      [c('   ', 'CALF_L'), c('▐█▌', 'CALF_L'), c(' ', 'HEAD'), c('▐█▌', 'CALF_R'), c('   ', 'CALF_R')],
      [c('    █   █    ', 'CALF_L')],
      // Feet
      [c('   ▄█▄ ▄█▄   ', 'CALF_L')],
    ];
  } else {
    return [
      // Head
      [c('     ▄███▄     ', 'HEAD')],
      [c('     █████     ', 'HEAD')],
      [c('     ▀███▀     ', 'HEAD')],
      // Traps
      [c('     ▄███▄     ', 'TRAP')],
      // Shoulders + traps
      [c('  ▄██', 'DELT_L'), c('█████', 'TRAP'), c('██▄  ', 'DELT_R')],
      [c(' ████', 'DELT_L'), c('█████', 'TRAP'), c('████ ', 'DELT_R')],
      // Arms + upper back
      [c('██', 'TRICEP_L'), c('██', 'DELT_L'), c('███████', 'UPPER_BACK'), c('██', 'DELT_R'), c('██', 'TRICEP_R')],
      [c('██', 'TRICEP_L'), c('██', 'LAT_L'), c('█████', 'UPPER_BACK'), c('██', 'LAT_R'), c('██', 'TRICEP_R')],
      [c('██', 'TRICEP_L'), c('██', 'LAT_L'), c('█████', 'UPPER_BACK'), c('██', 'LAT_R'), c('██', 'TRICEP_R')],
      // Arms + lats + lower back
      [c('██', 'TRICEP_L'), c('██', 'LAT_L'), c('█████', 'LOWER_BACK'), c('██', 'LAT_R'), c('██', 'TRICEP_R')],
      [c('▐█', 'FOREARM_L'), c('██', 'LAT_L'), c('█████', 'LOWER_BACK'), c('██', 'LAT_R'), c('█▌', 'FOREARM_R')],
      [c(' █', 'FOREARM_L'), c('▐█', 'LAT_L'), c('█████', 'LOWER_BACK'), c('█▌', 'LAT_R'), c('█ ', 'FOREARM_R')],
      [c(' ▀', 'FOREARM_L'), c(' █', 'LAT_L'), c('█████', 'LOWER_BACK'), c('█ ', 'LAT_R'), c('▀ ', 'FOREARM_R')],
      // Lower back
      [c('  ▀', 'LAT_L'), c('███████', 'LOWER_BACK'), c('▀  ', 'LAT_R')],
      [c('   ', 'LAT_L'), c('▄█████▄', 'LOWER_BACK'), c('   ', 'LAT_R')],
      // Glutes
      [c('   ', 'GLUTE_L'), c('███', 'GLUTE_L'), c(' ', 'HEAD'), c('███', 'GLUTE_R'), c('   ', 'GLUTE_R')],
      [c('   ', 'GLUTE_L'), c('███', 'GLUTE_L'), c(' ', 'HEAD'), c('███', 'GLUTE_R'), c('   ', 'GLUTE_R')],
      // Hamstrings
      [c('   ', 'HAM_L'), c('███', 'HAM_L'), c(' ', 'HEAD'), c('███', 'HAM_R'), c('   ', 'HAM_R')],
      [c('   ', 'HAM_L'), c('███', 'HAM_L'), c(' ', 'HEAD'), c('███', 'HAM_R'), c('   ', 'HAM_R')],
      [c('   ', 'HAM_L'), c('▐█▌', 'HAM_L'), c(' ', 'HEAD'), c('▐█▌', 'HAM_R'), c('   ', 'HAM_R')],
      // Calves
      [c('   ', 'CALF_L'), c('▐█▌', 'CALF_L'), c(' ', 'HEAD'), c('▐█▌', 'CALF_R'), c('   ', 'CALF_R')],
      [c('   ', 'CALF_L'), c('▐█▌', 'CALF_L'), c(' ', 'HEAD'), c('▐█▌', 'CALF_R'), c('   ', 'CALF_R')],
      [c('   ', 'CALF_L'), c('▐█▌', 'CALF_L'), c(' ', 'HEAD'), c('▐█▌', 'CALF_R'), c('   ', 'CALF_R')],
      [c('    █   █    ', 'CALF_L')],
      // Feet
      [c('   ▄█▄ ▄█▄   ', 'CALF_L')],
    ];
  }
}
