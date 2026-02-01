import { MUSCLE_GROUPS } from '../data/exercises';
import { getFatigueColor } from '../utils/muscleCalculations';

// Simple body outline path from the provided SVG
const BODY_OUTLINE = `M44.777,94.501c-1.737,0-3.151-1.414-3.151-3.151V40.284
  c0-0.259-0.197-0.475-0.455-0.498c-0.015-0.001-0.03-0.002-0.045-0.002
  c-0.239,0-0.448,0.171-0.492,0.411c-0.788,4.348-2.557,15.348-3.171,19.22
  c-0.245,1.54-1.549,2.657-3.102,2.657c-0.167,0-0.335-0.013-0.504-0.041
  c-1.716-0.273-2.891-1.891-2.619-3.606c0.297-1.868,2.918-18.329,3.533-21.09
  c1.438-6.473,7.046-6.473,10.397-6.473h9.665c3.351,0,8.958,0,10.396,6.473
  c0.641,2.88,3.504,20.908,3.533,21.09c0.132,0.832-0.067,1.664-0.562,2.345
  c-0.495,0.681-1.226,1.129-2.057,1.261c-0.168,0.027-0.336,0.04-0.5,0.04
  c-1.557,0-2.864-1.117-3.108-2.656c-0.614-3.865-2.381-14.851-3.171-19.218
  c-0.043-0.24-0.252-0.411-0.492-0.411c-0.015,0-0.03,0-0.045,0.002
  c-0.258,0.023-0.455,0.239-0.455,0.498v51.065c0,1.737-1.414,3.151-3.151,3.151
  c-1.737,0-3.151-1.414-3.151-3.151V65.782c0-0.276-0.224-0.5-0.5-0.5h-3.141
  c-0.276,0-0.5,0.224-0.5,0.5V91.35C47.928,93.087,46.515,94.501,44.777,94.501z`;

// Front view muscle regions mapped to the simple figure
const FRONT_MUSCLES = {
  [MUSCLE_GROUPS.FRONT_DELTS]: {
    // Shoulders
    path: `M35,33 Q38,30 41,33 L40,38 Q37,39 35,36 Z
           M65,33 Q62,30 59,33 L60,38 Q63,39 65,36 Z`,
  },
  [MUSCLE_GROUPS.CHEST]: {
    // Chest area
    path: `M43,34 Q50,32 57,34 L56,42 Q50,44 44,42 Z`,
  },
  [MUSCLE_GROUPS.BICEPS]: {
    // Upper arms front
    path: `M34,40 Q36,38 38,40 L37,52 Q35,54 33,52 Z
           M66,40 Q64,38 62,40 L63,52 Q65,54 67,52 Z`,
  },
  [MUSCLE_GROUPS.ABS]: {
    // Core/abs
    path: `M45,44 L55,44 L55,62 L45,62 Z`,
  },
  [MUSCLE_GROUPS.QUADS]: {
    // Front thighs
    path: `M44,66 Q47,64 50,66 L49,82 Q46,84 44,82 Z
           M56,66 Q53,64 50,66 L51,82 Q54,84 56,82 Z`,
  },
};

// Back view muscle regions mapped to the simple figure
const BACK_MUSCLES = {
  [MUSCLE_GROUPS.TRAPS]: {
    // Upper back/traps
    path: `M43,30 Q50,28 57,30 L56,36 Q50,34 44,36 Z`,
  },
  [MUSCLE_GROUPS.REAR_DELTS]: {
    // Rear shoulders
    path: `M35,33 Q38,30 41,33 L40,38 Q37,39 35,36 Z
           M65,33 Q62,30 59,33 L60,38 Q63,39 65,36 Z`,
  },
  [MUSCLE_GROUPS.UPPER_BACK]: {
    // Mid back
    path: `M44,38 Q50,36 56,38 L55,48 Q50,46 45,48 Z`,
  },
  [MUSCLE_GROUPS.LATS]: {
    // Lats
    path: `M40,42 Q44,40 46,44 L45,56 Q42,58 40,54 Z
           M60,42 Q56,40 54,44 L55,56 Q58,58 60,54 Z`,
  },
  [MUSCLE_GROUPS.TRICEPS]: {
    // Back of arms
    path: `M34,40 Q36,38 38,40 L37,52 Q35,54 33,52 Z
           M66,40 Q64,38 62,40 L63,52 Q65,54 67,52 Z`,
  },
  [MUSCLE_GROUPS.LOWER_BACK]: {
    // Lower back
    path: `M46,54 L54,54 L53,64 Q50,66 47,64 Z`,
  },
  [MUSCLE_GROUPS.GLUTES]: {
    // Glutes
    path: `M44,64 Q50,62 56,64 L55,72 Q50,74 45,72 Z`,
  },
  [MUSCLE_GROUPS.HAMSTRINGS]: {
    // Back of thighs
    path: `M44,74 Q47,72 50,74 L49,88 Q46,90 44,88 Z
           M56,74 Q53,72 50,74 L51,88 Q54,90 56,88 Z`,
  },
  [MUSCLE_GROUPS.CALVES]: {
    // Calves
    path: `M44,88 Q46,86 48,88 L47,94 Q45,96 44,94 Z
           M56,88 Q54,86 52,88 L53,94 Q55,96 56,94 Z`,
  },
};

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

function BodyView({ title, muscles, fatigue }) {
  return (
    <div className="svg-body-view">
      <h4>{title}</h4>
      <svg
        viewBox="0 0 100 100"
        className="muscle-svg"
        aria-label={`${title} muscle map`}
      >
        {/* Head */}
        <circle
          cx="50"
          cy="20.695"
          r="7.899"
          fill="none"
          stroke="#4a4a4a"
          strokeWidth="1"
          strokeMiterlimit="10"
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

        {/* Body outline */}
        <path
          d={BODY_OUTLINE}
          fill="none"
          stroke="#4a4a4a"
          strokeWidth="1"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
}

export function SvgMuscleMap({ fatigue }) {
  return (
    <div className="svg-muscle-map">
      <h2>Targeted Muscle Groups</h2>

      <div className="svg-body-views">
        <BodyView
          title="FRONT"
          muscles={FRONT_MUSCLES}
          fatigue={fatigue}
        />
        <BodyView
          title="BACK"
          muscles={BACK_MUSCLES}
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
    </div>
  );
}
