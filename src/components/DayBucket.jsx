import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ExerciseCard } from './ExerciseCard';
import { exercises } from '../data/exercises';

const DAY_NAMES = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export function DayBucket({ day, scheduledExercises, onRemoveExercise }) {
  const { setNodeRef, isOver } = useDroppable({
    id: day,
    data: {
      type: 'day',
      day,
    }
  });

  const exerciseInstances = scheduledExercises.map(instance => {
    const exercise = exercises.find(e => e.id === instance.exerciseId);
    return { ...instance, exercise };
  }).filter(instance => instance.exercise);

  return (
    <div className={`day-bucket ${isOver ? 'drag-over' : ''}`}>
      <div className="day-header">
        <h3>{DAY_NAMES[day]}</h3>
        <span className="exercise-count">{scheduledExercises.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className="day-exercises"
      >
        <SortableContext
          items={scheduledExercises.map(e => e.instanceId)}
          strategy={verticalListSortingStrategy}
        >
          {exerciseInstances.map(instance => (
            <ExerciseCard
              key={instance.instanceId}
              exercise={instance.exercise}
              instanceId={instance.instanceId}
              onRemove={onRemoveExercise}
            />
          ))}
        </SortableContext>
        {scheduledExercises.length === 0 && (
          <div className="empty-day">
            Drop exercises here
          </div>
        )}
      </div>
    </div>
  );
}
