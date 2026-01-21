import { MUSCLE_GROUPS, exercises } from '../data/exercises';

const PRIMARY_FATIGUE = 40;
const SECONDARY_FATIGUE = 20;
const MAX_FATIGUE = 100;

export function calculateMuscleFatigue(weeklyRoutine) {
  const fatigue = {};

  // Initialize all muscle groups to 0
  Object.values(MUSCLE_GROUPS).forEach(muscle => {
    fatigue[muscle] = 0;
  });

  // Calculate fatigue from all exercises in the week
  Object.values(weeklyRoutine).forEach(dayExercises => {
    dayExercises.forEach(exerciseInstance => {
      const exercise = exercises.find(e => e.id === exerciseInstance.exerciseId);
      if (!exercise) return;

      // Add primary muscle fatigue
      exercise.primaryMuscles.forEach(muscle => {
        fatigue[muscle] = Math.min(MAX_FATIGUE, fatigue[muscle] + PRIMARY_FATIGUE);
      });

      // Add secondary muscle fatigue
      exercise.secondaryMuscles.forEach(muscle => {
        fatigue[muscle] = Math.min(MAX_FATIGUE, fatigue[muscle] + SECONDARY_FATIGUE);
      });
    });
  });

  return fatigue;
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
