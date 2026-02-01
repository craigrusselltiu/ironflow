import { useState, useMemo, useCallback, useRef } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ExerciseCard } from './ExerciseCard';
import { cacheExercise } from '../data/exerciseCache';
import { useExercises, useExerciseLists } from '../hooks/useExercises';

// Body part display names and colors
const BODY_PART_CONFIG = {
  back: { label: 'Back', color: '#7c4dff' },
  chest: { label: 'Chest', color: '#4a90d9' },
  shoulders: { label: 'Shoulders', color: '#00bcd4' },
  'upper arms': { label: 'Arms', color: '#ff9800' },
  'lower arms': { label: 'Forearms', color: '#ff5722' },
  'upper legs': { label: 'Legs', color: '#ff6b6b' },
  'lower legs': { label: 'Calves', color: '#e91e63' },
  waist: { label: 'Core', color: '#ffd93d' },
  neck: { label: 'Neck', color: '#9c27b0' },
  cardio: { label: 'Cardio', color: '#6bcb77' },
};

// Format exercise name to title case
function formatName(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Map exercise to display format with proper muscle groups
function mapExercise(exercise) {
  // Cache the exercise for lookup in DayBucket and muscle calculations
  cacheExercise(exercise);

  return {
    id: exercise.id,
    name: formatName(exercise.name),
    bodyPart: exercise.bodyPart,
    target: exercise.target,
    equipment: exercise.equipment,
    primaryMuscles: exercise.primaryMuscle ? [exercise.primaryMuscle] : [],
    secondaryMuscles: exercise.secondaryMusclesMapping || [],
  };
}

export function ExerciseLibrary() {
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get body parts from the exercise lists hook
  const { bodyParts: availableBodyParts } = useExerciseLists();

  // Fetch exercises with filters
  const filters = useMemo(() => ({
    search: searchTerm || undefined,
    bodyPart: selectedBodyPart !== 'all' ? selectedBodyPart : undefined,
  }), [searchTerm, selectedBodyPart]);

  const { exercises: rawExercises, loadMore, hasMore } = useExercises({
    limit: 50,
    filters,
  });

  // Map exercises to display format
  const exercises = useMemo(() => {
    return rawExercises.map(mapExercise);
  }, [rawExercises]);

  // Filter body parts to only those in config
  const bodyParts = useMemo(() => {
    return availableBodyParts.filter(bp => BODY_PART_CONFIG[bp]);
  }, [availableBodyParts]);

  // Scroll-based loading
  const listRef = useRef(null);
  const handleScroll = useCallback((e) => {
    if (!hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMore();
    }
  }, [hasMore, loadMore]);

  const handleBodyPartClick = (bodyPart) => {
    setSearchTerm('');
    setSelectedBodyPart(prev => prev === bodyPart ? 'all' : bodyPart);
  };

  return (
    <div className="exercise-library-modern">
      <div className="library-header">
        <h2>Exercises</h2>
        <span className="exercise-total">
          {exercises.length}
          {hasMore ? '+' : ''}
        </span>
      </div>

      <div className="library-search">
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-modern"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="category-tabs">
        <button
          className={`category-tab ${selectedBodyPart === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedBodyPart('all')}
        >
          <span className="tab-label">All</span>
        </button>
        {bodyParts.map((part) => {
          const config = BODY_PART_CONFIG[part] || { label: part, color: '#888' };
          return (
            <button
              key={part}
              className={`category-tab ${selectedBodyPart === part ? 'active' : ''}`}
              onClick={() => handleBodyPartClick(part)}
              style={{ '--tab-color': config.color }}
            >
              <span className="tab-label">{config.label}</span>
            </button>
          );
        })}
      </div>

      <div
        className="exercise-list-modern"
        ref={listRef}
        onScroll={handleScroll}
      >
        <SortableContext
          items={exercises.map(e => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {exercises.map((exercise, idx) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isLibraryItem={true}
              exerciseIndex={idx}
            />
          ))}
        </SortableContext>

        {!hasMore && exercises.length > 0 && (
          <div className="library-end-notice">
            {exercises.length} exercises
          </div>
        )}

        {exercises.length === 0 && (
          <div className="no-results">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
              <path d="M8 8l6 6M14 8l-6 6"/>
            </svg>
            <span>No exercises found</span>
          </div>
        )}
      </div>
    </div>
  );
}
