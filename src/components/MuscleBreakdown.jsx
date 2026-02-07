import { MUSCLE_GROUPS } from '../data/exercises';
import { getFatigueColor, RECOMMENDED_SETS } from '../utils/muscleCalculations';

const MUSCLE_LABELS = {
  [MUSCLE_GROUPS.CHEST]: 'Chest',
  [MUSCLE_GROUPS.FRONT_DELTS]: 'Front Delts',
  [MUSCLE_GROUPS.SIDE_DELTS]: 'Side Delts',
  [MUSCLE_GROUPS.REAR_DELTS]: 'Rear Delts',
  [MUSCLE_GROUPS.BICEPS]: 'Biceps',
  [MUSCLE_GROUPS.TRICEPS]: 'Triceps',
  [MUSCLE_GROUPS.FOREARMS]: 'Forearms',
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

export function MuscleBreakdown({ fatigue, sets }) {
  const sortedMuscles = Object.entries(fatigue)
    .sort((a, b) => b[1] - a[1])
    .filter(([, value]) => value > 0);

  return (
    <div className="muscle-breakdown">
      <div className="muscle-breakdown-header">
        <h4>Muscle Breakdown</h4>
        <span className="muscle-breakdown-tooltip-wrapper">
          <svg className="muscle-breakdown-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span className="muscle-breakdown-tooltip">
            Shows your weekly sets per muscle vs. recommended targets. Secondary muscles count for half a set. Bar color shifts from green to red as you approach the target.
          </span>
        </span>
      </div>
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
              <span className="fatigue-value">{Math.floor(sets[muscle])} / {RECOMMENDED_SETS[muscle]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
