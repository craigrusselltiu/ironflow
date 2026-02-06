import { MUSCLE_GROUPS } from '../data/exercises';
import { getExerciseById } from '../data/exerciseCache';

export const RECOMMENDED_SETS = {
  [MUSCLE_GROUPS.CHEST]: 16,
  [MUSCLE_GROUPS.FRONT_DELTS]: 12,
  [MUSCLE_GROUPS.SIDE_DELTS]: 12,
  [MUSCLE_GROUPS.REAR_DELTS]: 12,
  [MUSCLE_GROUPS.BICEPS]: 10,
  [MUSCLE_GROUPS.TRICEPS]: 12,
  [MUSCLE_GROUPS.FOREARMS]: 10,
  [MUSCLE_GROUPS.TRAPS]: 10,
  [MUSCLE_GROUPS.LATS]: 16,
  [MUSCLE_GROUPS.UPPER_BACK]: 14,
  [MUSCLE_GROUPS.LOWER_BACK]: 10,
  [MUSCLE_GROUPS.ABS]: 10,
  [MUSCLE_GROUPS.QUADS]: 16,
  [MUSCLE_GROUPS.HAMSTRINGS]: 12,
  [MUSCLE_GROUPS.GLUTES]: 14,
  [MUSCLE_GROUPS.CALVES]: 12,
};

export function calculateMuscleFatigue(weeklyRoutine, countSecondary = true) {
  const sets = {};

  // Initialize all muscle groups to 0
  Object.values(MUSCLE_GROUPS).forEach(muscle => {
    sets[muscle] = 0;
  });

  // Count sets per muscle from all exercises in the week
  Object.values(weeklyRoutine).forEach(dayExercises => {
    dayExercises.forEach(exerciseInstance => {
      const exercise = getExerciseById(exerciseInstance.exerciseId);
      if (!exercise) return;

      const exerciseSets = exerciseInstance.plannedSets || 3;

      // Add primary muscle sets
      if (exercise.primaryMuscles) {
        exercise.primaryMuscles.forEach(muscle => {
          if (sets[muscle] !== undefined) {
            sets[muscle] += exerciseSets;
          }
        });
      }

      // Add secondary muscle sets (only if toggle is on)
      if (countSecondary && exercise.secondaryMuscles) {
        exercise.secondaryMuscles.forEach(muscle => {
          if (sets[muscle] !== undefined) {
            sets[muscle] += exerciseSets;
          }
        });
      }
    });
  });

  // Convert to fatigue percentages
  const fatigue = {};
  Object.values(MUSCLE_GROUPS).forEach(muscle => {
    const recommended = RECOMMENDED_SETS[muscle] || 10;
    fatigue[muscle] = Math.min(100, Math.round((sets[muscle] / recommended) * 100));
  });

  return { fatigue, sets };
}

export function getFatigueColor(fatigueLevel) {
  // Clamp between 0 and 100
  const level = Math.max(0, Math.min(100, fatigueLevel));

  // Green (0%) -> Yellow (50%) -> Red (100%)
  let r, g, b;

  if (level <= 50) {
    // Green to Yellow
    const t = level / 50;
    r = Math.round(50 + 205 * t);  // 50 -> 255
    g = Math.round(205 - 50 * t);   // 205 -> 155
    b = 50;
  } else {
    // Yellow to Red
    const t = (level - 50) / 50;
    r = 255;
    g = Math.round(155 - 155 * t);  // 155 -> 0
    b = 50;
  }

  return `rgb(${r}, ${g}, ${b})`;
}

export function getFatigueLevel(fatiguePercent) {
  if (fatiguePercent === 0) return 'none';
  if (fatiguePercent <= 20) return 'light';
  if (fatiguePercent <= 40) return 'moderate';
  if (fatiguePercent <= 60) return 'high';
  if (fatiguePercent <= 80) return 'very-high';
  return 'extreme';
}
