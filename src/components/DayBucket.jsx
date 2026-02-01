import { useDroppable } from '@dnd-kit/core';
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

export function DayBucket({ day, dayAbbrev, dayIndex, scheduledExercises, onRemoveExercise, onUpdateSetsReps }) {
  const { setNodeRef, isOver } = useDroppable({
    id: day,
    data: {
      type: 'day',
      day,
    }
  });

  const exerciseInstances = scheduledExercises.map(instance => {
    const exercise = getExerciseById(instance.exerciseId);
    return { ...instance, exercise };
  }).filter(instance => instance.exercise);

  const hasExercises = scheduledExercises.length > 0;
  const isWeekend = day === 'saturday' || day === 'sunday';

  return (
    <div
      className={`day-bucket-modern ${isOver ? 'drag-over' : ''} ${hasExercises ? 'has-exercises' : ''} ${isWeekend ? 'weekend' : ''}`}
      style={{ '--day-index': dayIndex }}
    >
      <div className="day-header-modern">
        <div className="day-label">
          <span className="day-abbrev">{dayAbbrev}</span>
          <span className="day-full">{DAY_NAMES[day]}</span>
        </div>
        {hasExercises && (
          <span className="exercise-count-modern">{scheduledExercises.length}</span>
        )}
      </div>
      <div
        ref={setNodeRef}
        className="day-content"
      >
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
}
