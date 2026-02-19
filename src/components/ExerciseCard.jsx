import { useState, useEffect, useRef, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CATEGORY_COLORS } from '../data/exercises';

// Target muscle colors and display names (keyed by IronFlow muscle names)
const MUSCLE_DISPLAY = {
  chest: 'Chest',
  frontDelts: 'Front Delts',
  sideDelts: 'Side Delts',
  rearDelts: 'Rear Delts',
  lats: 'Lats',
  upperBack: 'Upper Back',
  lowerBack: 'Lower Back',
  traps: 'Traps',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  abs: 'Abs',
  glutes: 'Glutes',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
};

const TARGET_COLORS = {
  abs: '#ffd93d',
  chest: '#e53935',
  lats: '#7c4dff',
  upperBack: '#9575cd',
  frontDelts: '#00acc1',
  sideDelts: '#00bcd4',
  rearDelts: '#0097a7',
  biceps: '#ff9800',
  triceps: '#ff5722',
  forearms: '#e64a19',
  glutes: '#f06292',
  quads: '#ab47bc',
  hamstrings: '#ec407a',
  calves: '#e91e63',
  traps: '#26a69a',
  lowerBack: '#8d6e63',
};

// Format label for display
function formatLabel(str) {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const ExerciseCard = memo(function ExerciseCard({
  exercise,
  instanceId,
  onRemove,
  isLibraryItem = false,
  plannedSets,
  plannedReps,
  onUpdateSetsReps,
  day,
  exerciseIndex = 0,
  isEditing = false,
  onStartEditing,
  onStopEditing,
  onTabToNext,
}) {
  const [sets, setSets] = useState(plannedSets || '');
  const [reps, setReps] = useState(plannedReps || '');
  const skipBlurRef = useRef(false);

  // Initialize local state when editing starts
  useEffect(() => {
    if (isEditing) {
      setSets(plannedSets || '');
      setReps(plannedReps || '');
    }
  }, [isEditing]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: instanceId || exercise.id,
    data: {
      type: isLibraryItem ? 'library' : 'scheduled',
      exercise,
      instanceId,
    }
  });

  // Use IronFlow primaryMuscle for color and display label
  const primaryMuscle = exercise.primaryMuscles?.[0];
  const cardColor = primaryMuscle && TARGET_COLORS[primaryMuscle]
    ? TARGET_COLORS[primaryMuscle]
    : CATEGORY_COLORS[exercise.category] || '#888';

  const displayLabel = primaryMuscle && MUSCLE_DISPLAY[primaryMuscle]
    ? MUSCLE_DISPLAY[primaryMuscle]
    : exercise.category || '';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--category-color': cardColor,
    '--card-index': exerciseIndex,
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onStartEditing?.();
  };

  const saveValues = () => {
    const newSets = sets ? parseInt(sets, 10) : null;
    const newReps = reps ? parseInt(reps, 10) : null;
    if (onUpdateSetsReps) {
      onUpdateSetsReps(day, instanceId, newSets, newReps);
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    saveValues();
    onStopEditing?.();
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    onStopEditing?.();
  };

  const handleBlur = (e) => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false;
      return;
    }
    if (!e.currentTarget.contains(e.relatedTarget)) {
      saveValues();
      onStopEditing?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave(e);
    } else if (e.key === 'Escape') {
      handleCancel(e);
    } else if (e.key === 'Tab' && !e.shiftKey && e.target.classList.contains('reps-input-modern')) {
      e.preventDefault();
      skipBlurRef.current = true;
      saveValues();
      if (onTabToNext) {
        onTabToNext();
      } else {
        onStopEditing?.();
      }
    }
  };

  const hasSetsReps = plannedSets && plannedReps;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`exercise-card-modern ${isDragging ? 'dragging' : ''} ${isLibraryItem ? 'library-item' : 'scheduled-item'}`}
      {...attributes}
      {...listeners}
    >
      <div className="card-accent"></div>

      <div className="card-main">
        <div className="card-top">
          <span className="exercise-name-modern">{exercise.name}</span>
          {!isLibraryItem && onRemove && (
            <button
              className="remove-btn-modern"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(instanceId);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Remove"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        <div className="card-bottom">
          <span className="exercise-category-modern">{displayLabel}</span>

          {!isLibraryItem && (
            <div className="sets-reps-modern">
              {isEditing ? (
                <div
                  className="sets-reps-editor"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onBlur={handleBlur}
                >
                  <input
                    type="number"
                    min="1"
                    max="20"
                    placeholder="0"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="sets-input-modern"
                    autoFocus
                  />
                  <span className="x-separator">x</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="0"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="reps-input-modern"
                  />
                  <button className="editor-btn save" onClick={handleSave}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </button>
                  <button className="editor-btn cancel" onClick={handleCancel}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className={`sets-reps-display-modern ${hasSetsReps ? 'has-value' : ''}`}
                  onClick={handleEditClick}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {hasSetsReps ? (
                    <>
                      <span className="sets-value">{plannedSets}</span>
                      <span className="x-label">x</span>
                      <span className="reps-value">{plannedReps}</span>
                    </>
                  ) : (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
                      </svg>
                      <span>Sets</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
