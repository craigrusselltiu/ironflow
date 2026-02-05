import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CATEGORY_COLORS } from '../data/exercises';

// Target muscle colors (matches ExerciseLibrary)
const TARGET_COLORS = {
  abs: '#ffd93d',
  lats: '#7c4dff',
  'upper back': '#9575cd',
  delts: '#00bcd4',
  biceps: '#ff9800',
  triceps: '#ff5722',
  forearms: '#e64a19',
  hamstrings: '#ec407a',
  glutes: '#f06292',
  calves: '#e91e63',
  abductors: '#ad1457',
  adductors: '#c2185b',
  'cardiovascular system': '#6bcb77',
};

// Format label for display
function formatLabel(str) {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function ExerciseCard({
  exercise,
  instanceId,
  onRemove,
  isLibraryItem = false,
  plannedSets,
  plannedReps,
  onUpdateSetsReps,
  day,
  exerciseIndex = 0,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [sets, setSets] = useState(plannedSets || '');
  const [reps, setReps] = useState(plannedReps || '');

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

  // Use target color if available, otherwise fall back to category color
  const cardColor = exercise.target
    ? TARGET_COLORS[exercise.target] || '#888'
    : CATEGORY_COLORS[exercise.category] || '#888';

  // Display target muscle if available, otherwise category
  const displayLabel = exercise.target
    ? formatLabel(exercise.target)
    : exercise.category || '';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--category-color': cardColor,
    '--card-index': exerciseIndex,
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setSets(plannedSets || '');
    setReps(plannedReps || '');
  };

  const handleSave = (e) => {
    e.stopPropagation();
    const newSets = sets ? parseInt(sets, 10) : null;
    const newReps = reps ? parseInt(reps, 10) : null;
    if (onUpdateSetsReps) {
      onUpdateSetsReps(day, instanceId, newSets, newReps);
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    setSets(plannedSets || '');
    setReps(plannedReps || '');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave(e);
    } else if (e.key === 'Escape') {
      handleCancel(e);
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
}
