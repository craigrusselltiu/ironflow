import { DayBucket } from './DayBucket';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_ABBREV = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT',
  sunday: 'SUN',
};

export function WeeklyPlanner({ weeklyRoutine, onRemoveExercise, onUpdateSetsReps, bucketOverDay, activeBucketDay }) {
  const totalExercises = Object.values(weeklyRoutine).reduce((sum, day) => sum + day.length, 0);
  const activeDays = Object.values(weeklyRoutine).filter(day => day.length > 0).length;

  return (
    <div className="weekly-planner-modern">
      <div className="planner-header">
        <div className="planner-title">
          <h2>Weekly Schedule</h2>
          <div className="planner-stats">
            <span className="stat-pill">
              <span className="stat-number">{totalExercises}</span>
              <span className="stat-label">exercises</span>
            </span>
            <span className="stat-pill">
              <span className="stat-number">{activeDays}</span>
              <span className="stat-label">active days</span>
            </span>
          </div>
        </div>
      </div>
      <div className="days-scroll">
        <div className="days-track">
          {DAYS.map((day, index) => (
            <DayBucket
              key={day}
              day={day}
              dayAbbrev={DAY_ABBREV[day]}
              dayIndex={index}
              scheduledExercises={weeklyRoutine[day] || []}
              onRemoveExercise={(instanceId) => onRemoveExercise(day, instanceId)}
              onUpdateSetsReps={onUpdateSetsReps}
              isBucketDropTarget={bucketOverDay === day}
              isBucketDragActive={!!activeBucketDay}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
