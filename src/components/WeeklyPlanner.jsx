import { DayBucket } from './DayBucket';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function WeeklyPlanner({ weeklyRoutine, onRemoveExercise }) {
  return (
    <div className="weekly-planner">
      <h2>Weekly Schedule</h2>
      <div className="days-grid">
        {DAYS.map(day => (
          <DayBucket
            key={day}
            day={day}
            scheduledExercises={weeklyRoutine[day] || []}
            onRemoveExercise={(instanceId) => onRemoveExercise(day, instanceId)}
          />
        ))}
      </div>
    </div>
  );
}
