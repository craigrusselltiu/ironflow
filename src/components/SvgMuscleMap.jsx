import { MUSCLE_GROUPS } from '../data/exercises';
import { getFatigueColor } from '../utils/muscleCalculations';

// More anatomically accurate muscle paths for front view
const FRONT_MUSCLES = {
  [MUSCLE_GROUPS.CHEST]: {
    // Pectorals - left and right
    path: `
      M32,48 Q38,44 50,46 Q50,52 46,58 Q40,60 34,56 Q30,52 32,48 Z
      M68,48 Q62,44 50,46 Q50,52 54,58 Q60,60 66,56 Q70,52 68,48 Z
    `,
    label: 'Chest',
  },
  [MUSCLE_GROUPS.FRONT_DELTS]: {
    // Front deltoids - caps on shoulders
    path: `
      M26,44 Q30,38 34,42 Q34,50 30,54 Q26,52 24,48 Q24,44 26,44 Z
      M74,44 Q70,38 66,42 Q66,50 70,54 Q74,52 76,48 Q76,44 74,44 Z
    `,
    label: 'Front Delts',
  },
  [MUSCLE_GROUPS.BICEPS]: {
    // Biceps - upper arm front
    path: `
      M22,56 Q26,54 28,58 L26,74 Q22,76 20,72 Q18,64 22,56 Z
      M78,56 Q74,54 72,58 L74,74 Q78,76 80,72 Q82,64 78,56 Z
    `,
    label: 'Biceps',
  },
  [MUSCLE_GROUPS.ABS]: {
    // Abdominals - 6-pack area
    path: `
      M42,60 L58,60 L58,68 L42,68 Z
      M42,70 L58,70 L58,78 L42,78 Z
      M42,80 L58,80 L58,90 Q50,92 42,90 Z
    `,
    label: 'Abs',
  },
  [MUSCLE_GROUPS.QUADS]: {
    // Quadriceps - front thighs
    path: `
      M36,98 Q42,94 48,98 L46,130 Q42,134 36,130 Q34,114 36,98 Z
      M64,98 Q58,94 52,98 L54,130 Q58,134 64,130 Q66,114 64,98 Z
    `,
    label: 'Quads',
  },
  [MUSCLE_GROUPS.CALVES]: {
    // Calves - lower legs front
    path: `
      M38,138 Q42,136 46,140 L44,162 Q40,166 38,162 Q36,150 38,138 Z
      M62,138 Q58,136 54,140 L56,162 Q60,166 62,162 Q64,150 62,138 Z
    `,
    label: 'Calves',
  },
};

// More anatomically accurate muscle paths for back view
const BACK_MUSCLES = {
  [MUSCLE_GROUPS.TRAPS]: {
    // Trapezius - upper back/neck
    path: `
      M38,36 Q50,32 62,36 L60,48 Q50,44 40,48 Z
    `,
    label: 'Traps',
  },
  [MUSCLE_GROUPS.REAR_DELTS]: {
    // Rear deltoids
    path: `
      M26,44 Q30,40 34,44 L32,54 Q28,52 26,48 Z
      M74,44 Q70,40 66,44 L68,54 Q72,52 74,48 Z
    `,
    label: 'Rear Delts',
  },
  [MUSCLE_GROUPS.UPPER_BACK]: {
    // Rhomboids/mid-back
    path: `
      M40,50 Q50,46 60,50 L58,66 Q50,62 42,66 Z
    `,
    label: 'Upper Back',
  },
  [MUSCLE_GROUPS.LATS]: {
    // Latissimus dorsi - wings
    path: `
      M32,54 Q38,50 42,58 L40,80 Q36,84 32,78 Q28,66 32,54 Z
      M68,54 Q62,50 58,58 L60,80 Q64,84 68,78 Q72,66 68,54 Z
    `,
    label: 'Lats',
  },
  [MUSCLE_GROUPS.TRICEPS]: {
    // Triceps - back of arm
    path: `
      M22,56 Q26,54 28,58 L26,76 Q22,78 20,74 Q18,66 22,56 Z
      M78,56 Q74,54 72,58 L74,76 Q78,78 80,74 Q82,66 78,56 Z
    `,
    label: 'Triceps',
  },
  [MUSCLE_GROUPS.LOWER_BACK]: {
    // Erector spinae
    path: `
      M44,72 L56,72 L54,92 Q50,94 46,92 Z
    `,
    label: 'Lower Back',
  },
  [MUSCLE_GROUPS.GLUTES]: {
    // Gluteus maximus
    path: `
      M36,94 Q44,90 50,94 Q56,90 64,94 L62,112 Q50,118 38,112 Z
    `,
    label: 'Glutes',
  },
  [MUSCLE_GROUPS.HAMSTRINGS]: {
    // Hamstrings - back of thighs
    path: `
      M38,114 Q44,110 48,116 L46,142 Q42,146 38,142 Q36,128 38,114 Z
      M62,114 Q56,110 52,116 L54,142 Q58,146 62,142 Q64,128 62,114 Z
    `,
    label: 'Hamstrings',
  },
};

// Body outline for front view - more anatomical
const FRONT_OUTLINE = `
  M50,8
  Q58,8 60,16
  Q62,24 58,30
  L58,34
  Q68,36 76,46
  Q82,54 80,62
  L78,78
  Q76,82 78,86
  L80,90
  Q78,92 76,90
  L72,92
  Q70,94 68,92
  L66,94
  L64,94
  L62,96
  Q56,94 50,96
  Q44,94 38,96
  L36,94
  L34,94
  L32,92
  Q30,94 28,92
  L24,90
  Q22,92 20,90
  L22,86
  Q24,82 22,78
  L20,62
  Q18,54 24,46
  Q32,36 42,34
  L42,30
  Q38,24 40,16
  Q42,8 50,8
  Z
  M38,96 L36,130 Q34,138 36,146 L38,168 L42,172 L46,168 L48,146 Q50,136 48,130 L46,96 Z
  M62,96 L64,130 Q66,138 64,146 L62,168 L58,172 L54,168 L52,146 Q50,136 52,130 L54,96 Z
`;

// Body outline for back view - more anatomical
const BACK_OUTLINE = `
  M50,8
  Q58,8 60,16
  Q62,24 58,30
  L58,34
  Q68,36 76,46
  Q82,54 80,62
  L78,78
  Q76,82 78,86
  L80,90
  Q78,92 76,90
  L72,92
  Q70,94 68,92
  L66,94
  L64,94
  L62,96
  Q56,94 50,96
  Q44,94 38,96
  L36,94
  L34,94
  L32,92
  Q30,94 28,92
  L24,90
  Q22,92 20,90
  L22,86
  Q24,82 22,78
  L20,62
  Q18,54 24,46
  Q32,36 42,34
  L42,30
  Q38,24 40,16
  Q42,8 50,8
  Z
  M38,96 L36,130 Q34,138 36,146 L38,168 L42,172 L46,168 L48,146 Q50,136 48,130 L46,96 Z
  M62,96 L64,130 Q66,138 64,146 L62,168 L58,172 L54,168 L52,146 Q50,136 52,130 L54,96 Z
`;

function MuscleGroup({ path, color, opacity }) {
  return (
    <path
      d={path}
      fill={color}
      fillOpacity={opacity}
      stroke={color}
      strokeWidth="0.5"
      strokeLinejoin="round"
      style={{ transition: 'fill 0.3s, fill-opacity 0.3s' }}
    />
  );
}

function BodyView({ title, muscles, outline, fatigue }) {
  return (
    <div className="svg-body-view">
      <h4>{title}</h4>
      <svg
        viewBox="0 0 100 180"
        className="muscle-svg"
        aria-label={`${title} muscle map`}
      >
        {/* Body outline */}
        <path
          d={outline}
          fill="none"
          stroke="#4a4a4a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Muscle groups */}
        {Object.entries(muscles).map(([muscleKey, muscle]) => {
          const fatigueLevel = fatigue[muscleKey] || 0;
          const color = fatigueLevel > 0 ? getFatigueColor(fatigueLevel) : '#2a2a2a';
          const opacity = fatigueLevel > 0 ? 0.85 + (fatigueLevel / 100) * 0.15 : 0.4;

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
          <p className="no-fatigue">Add exercises to see muscle engagement</p>
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
