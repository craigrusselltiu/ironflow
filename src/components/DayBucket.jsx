import { useState, useCallback, memo } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ExerciseCard } from './ExerciseCard';
import { getExerciseById } from '../data/exerciseCache';

const DAY_NAMES = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export const DayBucket = memo(function DayBucket({ day, dayAbbrev, dayIndex, scheduledExercises, onRemoveExercise, onUpdateSetsReps, isBucketDropTarget, isBucketDragActive }) {
  const [editingInstanceId, setEditingInstanceId] = useState(null);

  const { setNodeRef, isOver } = useDroppable({
    id: day,
    data: {
      type: 'day',
      day,
    }
  });

  const hasExercises = scheduledExercises.length > 0;

  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragNodeRef,
    setActivatorNodeRef,
    isDragging: isBucketDragging,
  } = useDraggable({
    id: `bucket-${day}`,
    data: { type: 'bucket', day },
    disabled: !hasExercises,
  });

  // Compose drag + drop refs on the outer div so the entire bucket is a drop target
  const composedRef = useCallback((node) => {
    setDragNodeRef(node);
    setNodeRef(node);
  }, [setDragNodeRef, setNodeRef]);

  const exerciseInstances = scheduledExercises.map(instance => {
    const exercise = getExerciseById(instance.exerciseId);
    return { ...instance, exercise };
  }).filter(instance => instance.exercise);

  const isWeekend = day === 'saturday' || day === 'sunday';
  const showDropHighlight = isOver || isBucketDropTarget;

  return (
    <div
      ref={composedRef}
      className={`day-bucket-modern ${showDropHighlight ? 'drag-over' : ''} ${hasExercises ? 'has-exercises' : ''} ${isWeekend ? 'weekend' : ''} ${isBucketDragging ? 'bucket-dragging' : ''} ${isBucketDropTarget ? 'bucket-drop-target' : ''} ${isBucketDragActive ? 'bucket-drag-active' : ''}`}
      style={{ '--day-index': dayIndex }}
      {...dragAttributes}
    >
      <div className="day-header-modern">
        {hasExercises ? (
          <button
            ref={setActivatorNodeRef}
            className="bucket-drag-handle"
            {...dragListeners}
            title="Drag to swap with another day"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="9" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/>
              <circle cx="15" cy="5" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
            </svg>
          </button>
        ) : (
          <div className="bucket-drag-handle-spacer" />
        )}
        <div className="day-label">
          <span className="day-abbrev">{dayAbbrev}</span>
          <span className="day-full">{DAY_NAMES[day]}</span>
        </div>
        {hasExercises ? (
          <span className="exercise-count-modern">{scheduledExercises.length}</span>
        ) : (
          <div className="exercise-count-spacer" />
        )}
      </div>
      <div className="day-content">
        <SortableContext
          items={scheduledExercises.map(e => e.instanceId)}
          strategy={verticalListSortingStrategy}
        >
          {exerciseInstances.map((instance, idx) => (
            <ExerciseCard
              key={instance.instanceId}
              exercise={instance.exercise}
              instanceId={instance.instanceId}
              onRemove={onRemoveExercise}
              plannedSets={instance.plannedSets}
              plannedReps={instance.plannedReps}
              onUpdateSetsReps={onUpdateSetsReps}
              day={day}
              exerciseIndex={idx}
              isEditing={editingInstanceId === instance.instanceId}
              onStartEditing={() => setEditingInstanceId(instance.instanceId)}
              onStopEditing={() => setEditingInstanceId(null)}
              onTabToNext={() => {
                if (idx + 1 < exerciseInstances.length) {
                  setEditingInstanceId(exerciseInstances[idx + 1].instanceId);
                } else {
                  setEditingInstanceId(null);
                }
              }}
            />
          ))}
        </SortableContext>
        {scheduledExercises.length === 0 && (
          <div className="empty-day-modern">
            <div className="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
              </svg>
            </div>
            <span>Drop here</span>
          </div>
        )}
      </div>
    </div>
  );
});
