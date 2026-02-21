import { MUSCLE_GROUPS } from '../data/exercises';
import { getExerciseById } from '../data/exerciseCache';

// Weekly recommended sets per muscle group based on Renaissance Periodization
// MAV (Maximum Adaptive Volume) research by Dr. Mike Israetel.
// Values represent the midpoint of each muscle group's MAV range,
// adjusted for indirect stimulus from compound movements.
export const RECOMMENDED_SETS = {
  [MUSCLE_GROUPS.CHEST]: 16,        // MAV 12–20
  [MUSCLE_GROUPS.FRONT_DELTS]: 8,   // MAV 6–8 (heavily stimulated by pressing)
  [MUSCLE_GROUPS.SIDE_DELTS]: 16,   // MAV 16–22
  [MUSCLE_GROUPS.REAR_DELTS]: 16,   // MAV 16–22
  [MUSCLE_GROUPS.BICEPS]: 14,       // MAV 14–20
  [MUSCLE_GROUPS.TRICEPS]: 12,      // MAV 10–14
  [MUSCLE_GROUPS.FOREARMS]: 8,      // MAV 4–10 (indirect work from pulling/gripping)
  [MUSCLE_GROUPS.TRAPS]: 14,        // MAV 12–20
  [MUSCLE_GROUPS.LATS]: 16,         // MAV 14–22 (back vertical pulling)
  [MUSCLE_GROUPS.UPPER_BACK]: 16,   // MAV 14–22 (back horizontal pulling)
  [MUSCLE_GROUPS.LOWER_BACK]: 6,    // ~2–6 direct sets (heavy indirect from compounds)
  [MUSCLE_GROUPS.ABS]: 16,          // MAV 16–20
  [MUSCLE_GROUPS.QUADS]: 16,        // MAV 12–18
  [MUSCLE_GROUPS.HAMSTRINGS]: 12,   // MAV 10–16
  [MUSCLE_GROUPS.GLUTES]: 10,       // MAV 4–12
  [MUSCLE_GROUPS.CALVES]: 14,       // MAV 12–16
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

      // Add secondary muscle sets at half credit (only if toggle is on)
      if (countSecondary && exercise.secondaryMuscles) {
        exercise.secondaryMuscles.forEach(muscle => {
          if (sets[muscle] !== undefined) {
            sets[muscle] += exerciseSets * 0.5;
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
