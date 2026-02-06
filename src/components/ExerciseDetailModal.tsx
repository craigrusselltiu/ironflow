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

  const formatLabel = (str: string) => {
    return str
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

        <div className="edm-layout">
          <div className="edm-gif-panel">
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className="edm-gif"
            />
          </div>

          <div className="edm-info-panel">
            <h2 className="edm-name">{exercise.name}</h2>

            <div className="edm-tags">
              <span className="edm-tag edm-tag--body">{formatLabel(exercise.bodyPart)}</span>
              <span className="edm-tag edm-tag--target">{formatLabel(exercise.targetMuscles)}</span>
              <span className="edm-tag edm-tag--equip">{formatLabel(exercise.equipment)}</span>
            </div>

            {exercise.secondaryMuscles.length > 0 && (
              <div className="edm-secondary">
                <span className="edm-secondary-label">Secondary:</span>
                {exercise.secondaryMuscles.map(formatLabel).join(', ')}
              </div>
            )}

            {exercise.instructions.length > 0 && (
              <div className="edm-instructions">
                <h3>Instructions</h3>
                <ol>
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            )}

            {showAddToDay && onAddToDay && (
              <div className="edm-add-section">
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
    </div>
  );
}
