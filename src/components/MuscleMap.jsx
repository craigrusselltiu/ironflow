import { generateAsciiBody } from '../utils/asciiBody';
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

export function MuscleMap({ fatigue }) {
  const frontBody = generateAsciiBody(fatigue, 'front');
  const backBody = generateAsciiBody(fatigue, 'back');

  const renderAsciiLine = (line) => {
    return line.map((segment, i) => (
      <span key={i} style={{ color: segment.color }}>
        {segment.text}
      </span>
    ));
  };

  const sortedMuscles = Object.entries(fatigue)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, value]) => value > 0);

  return (
    <div className="muscle-map">
      <h2>Muscle Fatigue</h2>

      <div className="body-views">
        <div className="body-view">
          <h4>Front</h4>
          <pre className="ascii-body">
            {frontBody.map((line, i) => (
              <div key={i}>{renderAsciiLine(line)}</div>
            ))}
          </pre>
        </div>

        <div className="body-view">
          <h4>Back</h4>
          <pre className="ascii-body">
            {backBody.map((line, i) => (
              <div key={i}>{renderAsciiLine(line)}</div>
            ))}
          </pre>
        </div>
      </div>

      <div className="fatigue-legend">
        <div className="legend-gradient">
          <span>0%</span>
          <div className="gradient-bar"></div>
          <span>100%</span>
        </div>
      </div>

      <div className="muscle-list">
        <h4>Muscle Breakdown</h4>
        {sortedMuscles.length === 0 ? (
          <p className="no-fatigue">Add exercises to see muscle fatigue</p>
        ) : (
          <ul>
            {sortedMuscles.map(([muscle, value]) => (
              <li key={muscle} className="muscle-item">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
