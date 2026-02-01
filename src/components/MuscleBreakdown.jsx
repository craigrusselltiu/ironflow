import { MUSCLE_GROUPS } from '../data/exercises';
import { getFatigueColor } from '../utils/muscleCalculations';

const MUSCLE_LABELS = {
  [MUSCLE_GROUPS.CHEST]: 'Chest',
  [MUSCLE_GROUPS.FRONT_DELTS]: 'Front Delts',
  [MUSCLE_GROUPS.REAR_DELTS]: 'Rear Delts',
  [MUSCLE_GROUPS.BICEPS]: 'Biceps',
  [MUSCLE_GROUPS.TRICEPS]: 'Triceps',
  [MUSCLE_GROUPS.TRAPS]: 'Traps',
  [MUSCLE_GROUPS.UPPER_BACK]: 'Upper Back',
  [MUSCLE_GROUPS.LATS]: 'Lats',
  [MUSCLE_GROUPS.LOWER_BACK]: 'Lower Back',
  [MUSCLE_GROUPS.ABS]: 'Abs',
  [MUSCLE_GROUPS.QUADS]: 'Quads',
  [MUSCLE_GROUPS.HAMSTRINGS]: 'Hamstrings',
  [MUSCLE_GROUPS.GLUTES]: 'Glutes',
  [MUSCLE_GROUPS.CALVES]: 'Calves',
};

export function MuscleBreakdown({ fatigue }) {
  const sortedMuscles = Object.entries(fatigue)
    .sort((a, b) => b[1] - a[1])
    .filter(([, value]) => value > 0);

  return (
    <div className="muscle-breakdown">
      <h4>Muscle Breakdown</h4>
      {sortedMuscles.length === 0 ? (
        <p className="no-fatigue">Add exercises to see muscle engagement</p>
      ) : (
        <div className="muscle-breakdown-list">
          {sortedMuscles.map(([muscle, value]) => (
            <div key={muscle} className="muscle-breakdown-item">
              <span className="muscle-name">{MUSCLE_LABELS[muscle]}</span>
              <div className="fatigue-bar-container">
                <div
                  className="fatigue-bar"
                  style={{
                    width: `${value}%`,
                    backgroundColor: getFatigueColor(value),
                  }}
                />
              </div>
              <span className="fatigue-value">{value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
