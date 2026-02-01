import { MUSCLE_GROUPS } from '../data/exercises';
import { getFatigueColor } from '../utils/muscleCalculations';

// Traced from anatomical reference - Front view muscles
const FRONT_MUSCLES = {
  [MUSCLE_GROUPS.CHEST]: {
    // Pectorals - two large chest muscles
    path: `
      M30,52 Q35,48 50,50 L50,56 Q42,62 34,60 Q28,58 30,52 Z
      M70,52 Q65,48 50,50 L50,56 Q58,62 66,60 Q72,58 70,52 Z
    `,
  },
  [MUSCLE_GROUPS.FRONT_DELTS]: {
    // Deltoids - shoulder caps
    path: `
      M22,46 Q28,40 32,44 L30,56 Q24,54 22,50 Z
      M78,46 Q72,40 68,44 L70,56 Q76,54 78,50 Z
    `,
  },
  [MUSCLE_GROUPS.BICEPS]: {
    // Biceps - front upper arm
    path: `
      M18,58 Q22,56 24,60 L22,78 Q18,80 16,76 Q14,66 18,58 Z
      M82,58 Q78,56 76,60 L78,78 Q82,80 84,76 Q86,66 82,58 Z
    `,
  },
  [MUSCLE_GROUPS.ABS]: {
    // Abdominals - 6-pack segments
    path: `
      M44,62 L56,62 L56,70 L44,70 Z
      M44,72 L56,72 L56,80 L44,80 Z
      M44,82 L56,82 L56,92 Q50,94 44,92 Z
    `,
  },
  [MUSCLE_GROUPS.QUADS]: {
    // Quadriceps - front thighs
    path: `
      M34,100 Q40,96 48,100 L46,138 Q40,142 34,138 Q32,118 34,100 Z
      M66,100 Q60,96 52,100 L54,138 Q60,142 66,138 Q68,118 66,100 Z
    `,
  },
};

// Traced from anatomical reference - Back view muscles
const BACK_MUSCLES = {
  [MUSCLE_GROUPS.TRAPS]: {
    // Trapezius - upper back diamond
    path: `
      M36,40 Q50,34 64,40 L60,52 Q50,48 40,52 Z
    `,
  },
  [MUSCLE_GROUPS.REAR_DELTS]: {
    // Rear deltoids - back of shoulders
    path: `
      M22,46 Q28,42 32,46 L30,56 Q24,54 22,50 Z
      M78,46 Q72,42 68,46 L70,56 Q76,54 78,50 Z
    `,
  },
  [MUSCLE_GROUPS.UPPER_BACK]: {
    // Rhomboids - mid upper back
    path: `
      M40,52 Q50,48 60,52 L58,66 Q50,62 42,66 Z
    `,
  },
  [MUSCLE_GROUPS.LATS]: {
    // Latissimus dorsi - large wing muscles
    path: `
      M28,56 Q36,52 42,60 L40,86 Q34,90 28,84 Q24,70 28,56 Z
      M72,56 Q64,52 58,60 L60,86 Q66,90 72,84 Q76,70 72,56 Z
    `,
  },
  [MUSCLE_GROUPS.TRICEPS]: {
    // Triceps - back of upper arm
    path: `
      M18,58 Q22,56 24,60 L22,78 Q18,80 16,76 Q14,66 18,58 Z
      M82,58 Q78,56 76,60 L78,78 Q82,80 84,76 Q86,66 82,58 Z
    `,
  },
  [MUSCLE_GROUPS.LOWER_BACK]: {
    // Erector spinae - lower back
    path: `
      M44,74 L56,74 L54,94 Q50,96 46,94 Z
    `,
  },
  [MUSCLE_GROUPS.GLUTES]: {
    // Gluteus maximus
    path: `
      M34,96 Q42,92 50,96 Q58,92 66,96 L64,116 Q50,122 36,116 Z
    `,
  },
  [MUSCLE_GROUPS.HAMSTRINGS]: {
    // Hamstrings - back of thighs
    path: `
      M36,118 Q42,114 48,120 L46,148 Q40,152 36,148 Q34,132 36,118 Z
      M64,118 Q58,114 52,120 L54,148 Q60,152 64,148 Q66,132 64,118 Z
    `,
  },
  [MUSCLE_GROUPS.CALVES]: {
    // Calves - back of lower leg
    path: `
      M36,152 Q40,150 44,154 L42,174 Q38,178 36,174 Q34,162 36,152 Z
      M64,152 Q60,150 56,154 L58,174 Q62,178 64,174 Q66,162 64,152 Z
    `,
  },
};

// Body outline - front view (traced from reference)
const FRONT_OUTLINE = `
  M50,10
  Q60,10 62,20 Q64,30 58,36
  L58,40
  Q72,42 80,52
  Q86,62 84,74
  L82,82
  Q80,86 80,90
  L78,94
  Q74,92 72,94
  L68,96
  Q60,94 50,96
  Q40,94 32,96
  L28,94
  Q26,92 22,94
  L20,90
  Q20,86 18,82
  L16,74
  Q14,62 20,52
  Q28,42 42,40
  L42,36
  Q36,30 38,20
  Q40,10 50,10
  Z
  M32,96 L30,138 Q28,146 30,156 L32,178 L38,182 L44,178 L46,156 Q48,146 46,138 L44,96 Z
  M68,96 L70,138 Q72,146 70,156 L68,178 L62,182 L56,178 L54,156 Q52,146 54,138 L56,96 Z
`;

// Body outline - back view (same silhouette)
const BACK_OUTLINE = FRONT_OUTLINE;

function MuscleGroup({ path, color, opacity }) {
  return (
    <path
      d={path}
      fill={color}
      fillOpacity={opacity}
      stroke={color}
      strokeWidth="0.8"
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
        viewBox="0 0 100 190"
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
          const opacity = fatigueLevel > 0 ? 0.9 : 0.4;

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
