import { MUSCLE_GROUPS } from '../data/exercises';
import { getFatigueColor } from '../utils/muscleCalculations';

// Muscle paths for front view
const FRONT_MUSCLES = {
  [MUSCLE_GROUPS.CHEST]: {
    path: 'M35,55 Q45,50 55,52 L58,65 Q50,70 42,65 Z M65,55 Q55,50 45,52 L42,65 Q50,70 58,65 Z',
    label: 'Chest',
    cx: 50,
    cy: 58,
  },
  [MUSCLE_GROUPS.FRONT_DELTS]: {
    path: 'M28,52 Q32,45 38,50 L35,62 Q30,60 28,55 Z M72,52 Q68,45 62,50 L65,62 Q70,60 72,55 Z',
    label: 'Front Delts',
    cx: 30,
    cy: 55,
  },
  [MUSCLE_GROUPS.BICEPS]: {
    path: 'M22,62 Q26,60 28,65 L26,80 Q22,78 20,72 Z M78,62 Q74,60 72,65 L74,80 Q78,78 80,72 Z',
    label: 'Biceps',
    cx: 24,
    cy: 70,
  },
  [MUSCLE_GROUPS.ABS]: {
    path: 'M42,68 L58,68 L58,100 Q50,102 42,100 Z',
    label: 'Abs',
    cx: 50,
    cy: 84,
  },
  [MUSCLE_GROUPS.QUADS]: {
    path: 'M38,105 Q42,102 48,105 L46,145 Q42,148 38,145 Z M62,105 Q58,102 52,105 L54,145 Q58,148 62,145 Z',
    label: 'Quads',
    cx: 43,
    cy: 125,
  },
  [MUSCLE_GROUPS.CALVES]: {
    path: 'M40,150 Q44,148 46,152 L45,175 Q42,178 40,175 Z M60,150 Q56,148 54,152 L55,175 Q58,178 60,175 Z',
    label: 'Calves',
    cx: 43,
    cy: 162,
  },
};

// Muscle paths for back view
const BACK_MUSCLES = {
  [MUSCLE_GROUPS.TRAPS]: {
    path: 'M40,42 Q50,38 60,42 L58,55 Q50,52 42,55 Z',
    label: 'Traps',
    cx: 50,
    cy: 48,
  },
  [MUSCLE_GROUPS.REAR_DELTS]: {
    path: 'M28,52 Q32,48 36,52 L34,62 Q30,60 28,58 Z M72,52 Q68,48 64,52 L66,62 Q70,60 72,58 Z',
    label: 'Rear Delts',
    cx: 30,
    cy: 56,
  },
  [MUSCLE_GROUPS.UPPER_BACK]: {
    path: 'M40,55 Q50,52 60,55 L58,72 Q50,70 42,72 Z',
    label: 'Upper Back',
    cx: 50,
    cy: 63,
  },
  [MUSCLE_GROUPS.LATS]: {
    path: 'M35,65 Q40,62 42,70 L40,88 Q35,85 32,78 Z M65,65 Q60,62 58,70 L60,88 Q65,85 68,78 Z',
    label: 'Lats',
    cx: 36,
    cy: 76,
  },
  [MUSCLE_GROUPS.TRICEPS]: {
    path: 'M24,62 Q28,60 30,66 L28,82 Q24,80 22,74 Z M76,62 Q72,60 70,66 L72,82 Q76,80 78,74 Z',
    label: 'Triceps',
    cx: 26,
    cy: 72,
  },
  [MUSCLE_GROUPS.LOWER_BACK]: {
    path: 'M42,78 L58,78 L56,98 Q50,100 44,98 Z',
    label: 'Lower Back',
    cx: 50,
    cy: 88,
  },
  [MUSCLE_GROUPS.GLUTES]: {
    path: 'M38,100 Q45,98 50,102 Q55,98 62,100 L60,118 Q50,122 40,118 Z',
    label: 'Glutes',
    cx: 50,
    cy: 108,
  },
  [MUSCLE_GROUPS.HAMSTRINGS]: {
    path: 'M40,120 Q44,118 48,122 L46,150 Q42,152 40,148 Z M60,120 Q56,118 52,122 L54,150 Q58,152 60,148 Z',
    label: 'Hamstrings',
    cx: 44,
    cy: 135,
  },
};

// Body outline for front view
const FRONT_OUTLINE = `
  M50,15
  Q60,15 62,25
  Q64,35 60,40
  L60,42
  Q70,42 75,52
  L80,62
  Q82,75 78,85
  L75,88
  Q72,90 72,95
  L70,105
  Q65,102 50,102
  Q35,102 30,105
  L28,95
  Q28,90 25,88
  L22,85
  Q18,75 20,62
  L25,52
  Q30,42 40,42
  L40,40
  Q36,35 38,25
  Q40,15 50,15
  Z
  M30,105 L28,145 Q25,150 28,175 L32,180 L36,180 L40,175 Q42,150 40,145 L38,105 Z
  M70,105 L72,145 Q75,150 72,175 L68,180 L64,180 L60,175 Q58,150 60,145 L62,105 Z
`;

// Body outline for back view
const BACK_OUTLINE = `
  M50,15
  Q60,15 62,25
  Q64,35 60,40
  L60,42
  Q70,42 75,52
  L80,62
  Q82,75 78,85
  L75,88
  Q72,90 72,95
  L70,105
  Q65,102 50,102
  Q35,102 30,105
  L28,95
  Q28,90 25,88
  L22,85
  Q18,75 20,62
  L25,52
  Q30,42 40,42
  L40,40
  Q36,35 38,25
  Q40,15 50,15
  Z
  M30,105 L28,145 Q25,150 28,175 L32,180 L36,180 L40,175 Q42,150 40,145 L38,105 Z
  M70,105 L72,145 Q75,150 72,175 L68,180 L64,180 L60,175 Q58,150 60,145 L62,105 Z
`;

function MuscleGroup({ path, color, opacity }) {
  return (
    <path
      d={path}
      fill={color}
      fillOpacity={opacity}
      stroke={color}
      strokeWidth="0.5"
      style={{ transition: 'fill 0.3s, fill-opacity 0.3s' }}
    />
  );
}

function BodyView({ title, muscles, outline, fatigue }) {
  return (
    <div className="svg-body-view">
      <h4>{title}</h4>
      <svg
        viewBox="0 0 100 200"
        className="muscle-svg"
        aria-label={`${title} muscle map`}
      >
        {/* Body outline */}
        <path
          d={outline}
          fill="none"
          stroke="#3a3a3a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Muscle groups */}
        {Object.entries(muscles).map(([muscleKey, muscle]) => {
          const fatigueLevel = fatigue[muscleKey] || 0;
          const color = fatigueLevel > 0 ? getFatigueColor(fatigueLevel) : '#2a2a2a';
          const opacity = fatigueLevel > 0 ? 0.8 + (fatigueLevel / 100) * 0.2 : 0.3;

          return (
            <MuscleGroup
              key={muscleKey}
              path={muscle.path}
              color={color}
              opacity={opacity}
            />
          );
        })}
      </svg>
    </div>
  );
}

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

export function SvgMuscleMap({ fatigue }) {
  const sortedMuscles = Object.entries(fatigue)
    .sort((a, b) => b[1] - a[1])
    .filter(([, value]) => value > 0);

  return (
    <div className="svg-muscle-map">
      <h2>Targeted Muscle Groups</h2>

      <div className="svg-body-views">
        <BodyView
          title="FRONT"
          muscles={FRONT_MUSCLES}
          outline={FRONT_OUTLINE}
          fatigue={fatigue}
        />
        <BodyView
          title="BACK"
          muscles={BACK_MUSCLES}
          outline={BACK_OUTLINE}
          fatigue={fatigue}
        />
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
