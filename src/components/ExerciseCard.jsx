import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CATEGORY_COLORS } from '../data/exercises';

export function ExerciseCard({ exercise, instanceId, onRemove, isLibraryItem = false }) {
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
    borderLeft: `4px solid ${CATEGORY_COLORS[exercise.category]}`,
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
        <span className="exercise-name">{exercise.name}</span>
        <span className="exercise-category">{exercise.category}</span>
      </div>
      {!isLibraryItem && onRemove && (
        <button
          className="remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(instanceId);
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          ×
        </button>
      )}
    </div>
  );
}
