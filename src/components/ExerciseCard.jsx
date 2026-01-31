import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CATEGORY_COLORS } from '../data/exercises';

export function ExerciseCard({
  exercise,
  instanceId,
  onRemove,
  isLibraryItem = false,
  plannedSets,
  plannedReps,
  onUpdateSetsReps,
  day,
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderLeft: `4px solid ${CATEGORY_COLORS[exercise.category] || '#888'}`,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`exercise-card ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="exercise-card-content">
        <div className="exercise-info">
          <span className="exercise-name">{exercise.name}</span>
          <span className="exercise-category">{exercise.category}</span>
        </div>

        {!isLibraryItem && (
          <div className="exercise-sets-reps">
            {isEditing ? (
              <div
                className="sets-reps-edit"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <input
                  type="number"
                  min="1"
                  max="20"
                  placeholder="Sets"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="sets-input"
                  autoFocus
                />
                <span className="sets-reps-separator">x</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Reps"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="reps-input"
                />
                <button
                  className="save-btn"
                  onClick={handleSave}
                  title="Save"
                >
                  ✓
                </button>
                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                  title="Cancel"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                className="sets-reps-display"
                onClick={handleEditClick}
                onPointerDown={(e) => e.stopPropagation()}
                title="Click to edit sets and reps"
              >
                {plannedSets && plannedReps ? (
                  <span className="sets-reps-value">
                    {plannedSets} x {plannedReps}
                  </span>
                ) : (
                  <span className="sets-reps-placeholder">
                    + Sets/Reps
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {!isLibraryItem && onRemove && (
        <button
          className="remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(instanceId);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          title="Remove exercise"
        >
          ×
        </button>
      )}
    </div>
  );
}
