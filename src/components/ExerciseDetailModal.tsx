import { useState } from 'react';
import type { Exercise } from '../types/exercise';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
  onAddToDay?: (exercise: Exercise, day: string) => void;
  showAddToDay?: boolean;
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export function ExerciseDetailModal({
  exercise,
  onClose,
  onAddToDay,
  showAddToDay = true,
}: ExerciseDetailModalProps) {
  const [selectedDay, setSelectedDay] = useState('monday');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToDay = () => {
    if (onAddToDay) {
      onAddToDay(exercise, selectedDay);
      onClose();
    }
  };

  const formatBodyPart = (bodyPart: string) => {
    return bodyPart
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content exercise-detail-modal">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="exercise-detail-header">
          <div className="exercise-gif-container">
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className="exercise-gif"
            />
          </div>
        </div>

        <div className="exercise-detail-body">
          <h2 className="exercise-detail-name">{exercise.name}</h2>

          <div className="exercise-meta">
            <span className="meta-tag body-part-tag">
              {formatBodyPart(exercise.bodyPart)}
            </span>
            <span className="meta-tag target-tag">
              {formatBodyPart(exercise.target)}
            </span>
            <span className="meta-tag equipment-tag">
              {formatBodyPart(exercise.equipment)}
            </span>
          </div>

          {exercise.secondaryMuscles.length > 0 && (
            <div className="secondary-muscles">
              <span className="secondary-label">Secondary muscles:</span>
              <span className="secondary-list">
                {exercise.secondaryMuscles.map(formatBodyPart).join(', ')}
              </span>
            </div>
          )}

          {exercise.instructions.length > 0 && (
            <div className="exercise-instructions">
              <h3>Instructions</h3>
              <ol>
                {exercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}

          {showAddToDay && onAddToDay && (
            <div className="add-to-day-section">
              <h3>Add to Routine</h3>
              <div className="add-to-day-controls">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="day-select"
                >
                  {DAYS.map((day) => (
                    <option key={day.key} value={day.key}>
                      {day.label}
                    </option>
                  ))}
                </select>
                <button className="add-to-day-btn" onClick={handleAddToDay}>
                  Add to {DAYS.find(d => d.key === selectedDay)?.label}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
