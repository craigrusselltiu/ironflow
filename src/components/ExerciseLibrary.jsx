import { useState, useMemo, useCallback, useRef } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ExerciseCard } from './ExerciseCard';
import { cacheExercise } from '../data/exerciseCache';
import { useExercises, useExerciseLists } from '../hooks/useExercises';

// Target muscle display names and colors
const TARGET_CONFIG = {
  abs: { label: 'Abs', color: '#ffd93d' },
  pectorals: { label: 'Pectorals', color: '#e53935' },
  lats: { label: 'Lats', color: '#7c4dff' },
  'upper back': { label: 'Upper Back', color: '#9575cd' },
  delts: { label: 'Delts', color: '#00bcd4' },
  biceps: { label: 'Biceps', color: '#ff9800' },
  triceps: { label: 'Triceps', color: '#ff5722' },
  forearms: { label: 'Forearms', color: '#e64a19' },
  glutes: { label: 'Glutes', color: '#f06292' },
  quads: { label: 'Quads', color: '#ab47bc' },
  hamstrings: { label: 'Hamstrings', color: '#ec407a' },
  calves: { label: 'Calves', color: '#e91e63' },
  traps: { label: 'Traps', color: '#26a69a' },
  spine: { label: 'Spine', color: '#8d6e63' },
  'serratus anterior': { label: 'Serratus', color: '#ef5350' },
  abductors: { label: 'Abductors', color: '#ad1457' },
  adductors: { label: 'Adductors', color: '#c2185b' },
  'levator scapulae': { label: 'Levator Scap.', color: '#5c6bc0' },
  'cardiovascular system': { label: 'Cardio', color: '#6bcb77' },
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
    targetMuscles: exercise.targetMuscles,
    equipment: exercise.equipment,
    primaryMuscles: exercise.primaryMuscle ? [exercise.primaryMuscle] : [],
    secondaryMuscles: exercise.secondaryMusclesMapping || [],
  };
}

export function ExerciseLibrary() {
  const [selectedTarget, setSelectedTarget] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get targets from the exercise lists hook
  const { targets: availableTargets } = useExerciseLists();

  // Fetch exercises with filters
  const filters = useMemo(() => ({
    search: searchTerm || undefined,
    targetMuscles: selectedTarget !== 'all' ? selectedTarget : undefined,
  }), [searchTerm, selectedTarget]);

  const { exercises: rawExercises, loadMore, hasMore } = useExercises({
    limit: 50,
    filters,
  });

  // Map exercises to display format
  const exercises = useMemo(() => {
    return rawExercises.map(mapExercise);
  }, [rawExercises]);

  // Filter targets to only those in config
  const targets = useMemo(() => {
    return availableTargets.filter(t => TARGET_CONFIG[t]);
  }, [availableTargets]);

  // Scroll-based loading
  const listRef = useRef(null);
  const handleScroll = useCallback((e) => {
    if (!hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMore();
    }
  }, [hasMore, loadMore]);

  const handleTargetClick = (target) => {
    setSearchTerm('');
    setSelectedTarget(prev => prev === target ? 'all' : target);
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
          className={`category-tab ${selectedTarget === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedTarget('all')}
        >
          <span className="tab-label">All</span>
        </button>
        {targets.map((target) => {
          const config = TARGET_CONFIG[target] || { label: target, color: '#888' };
          return (
            <button
              key={target}
              className={`category-tab ${selectedTarget === target ? 'active' : ''}`}
              onClick={() => handleTargetClick(target)}
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
