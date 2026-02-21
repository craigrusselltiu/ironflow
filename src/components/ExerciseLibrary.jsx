import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ExerciseCard } from './ExerciseCard';
import { cacheExercise } from '../data/exerciseCache';
import { useExercises, useExerciseLists } from '../hooks/useExercises';

// Target muscle display names and colors (keyed by IronFlow muscle names)
const TARGET_CONFIG = {
  abs: { label: 'Abs', color: '#ffd93d' },
  chest: { label: 'Chest', color: '#e53935' },
  lats: { label: 'Lats', color: '#7c4dff' },
  upperBack: { label: 'Upper Back', color: '#9575cd' },
  frontDelts: { label: 'Front Delts', color: '#00acc1' },
  sideDelts: { label: 'Side Delts', color: '#00bcd4' },
  rearDelts: { label: 'Rear Delts', color: '#0097a7' },
  biceps: { label: 'Biceps', color: '#ff9800' },
  triceps: { label: 'Triceps', color: '#ff5722' },
  forearms: { label: 'Forearms', color: '#e64a19' },
  glutes: { label: 'Glutes', color: '#f06292' },
  quads: { label: 'Quads', color: '#ab47bc' },
  hamstrings: { label: 'Hamstrings', color: '#ec407a' },
  calves: { label: 'Calves', color: '#e91e63' },
  traps: { label: 'Traps', color: '#26a69a' },
  lowerBack: { label: 'Lower Back', color: '#8d6e63' },
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
  const [selectedTarget, setSelectedTarget] = useState(() => sessionStorage.getItem('library_target') || 'all');
  const [selectedEquipment, setSelectedEquipment] = useState(() => sessionStorage.getItem('library_equipment') || null);
  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem('library_search') || '');
  const [muscleFiltersOpen, setMuscleFiltersOpen] = useState(() => sessionStorage.getItem('library_muscleFiltersOpen') === 'true');
  const [equipmentFiltersOpen, setEquipmentFiltersOpen] = useState(() => sessionStorage.getItem('library_equipmentFiltersOpen') === 'true');

  // Persist filters to sessionStorage
  useEffect(() => {
    if (searchTerm) sessionStorage.setItem('library_search', searchTerm);
    else sessionStorage.removeItem('library_search');
  }, [searchTerm]);
  useEffect(() => {
    if (selectedTarget !== 'all') sessionStorage.setItem('library_target', selectedTarget);
    else sessionStorage.removeItem('library_target');
  }, [selectedTarget]);
  useEffect(() => {
    if (selectedEquipment) sessionStorage.setItem('library_equipment', selectedEquipment);
    else sessionStorage.removeItem('library_equipment');
  }, [selectedEquipment]);
  useEffect(() => {
    sessionStorage.setItem('library_muscleFiltersOpen', muscleFiltersOpen ? 'true' : 'false');
  }, [muscleFiltersOpen]);
  useEffect(() => {
    sessionStorage.setItem('library_equipmentFiltersOpen', equipmentFiltersOpen ? 'true' : 'false');
  }, [equipmentFiltersOpen]);

  // Get targets and equipment from the exercise lists hook
  const { targets: availableTargets, equipment: availableEquipment } = useExerciseLists();

  // Fetch exercises with filters
  const filters = useMemo(() => ({
    search: searchTerm || undefined,
    targetMuscles: selectedTarget !== 'all' ? selectedTarget : undefined,
    equipment: selectedEquipment || undefined,
  }), [searchTerm, selectedTarget, selectedEquipment]);

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

  const handleEquipmentClick = (equipment) => {
    setSearchTerm('');
    setSelectedEquipment(prev => prev === equipment ? null : equipment);
  };

  const hasMuscleFilter = selectedTarget !== 'all';
  const hasEquipmentFilter = !!selectedEquipment;

  const muscleLabel = hasMuscleFilter
    ? TARGET_CONFIG[selectedTarget]?.label || selectedTarget
    : 'Muscle Group';

  const equipmentLabel = hasEquipmentFilter
    ? selectedEquipment.charAt(0).toUpperCase() + selectedEquipment.slice(1)
    : 'Equipment';

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
        <div className="filter-toggles">
          <button
            className={`filter-toggle ${muscleFiltersOpen ? 'open' : ''} ${hasMuscleFilter ? 'has-active' : ''}`}
            onClick={() => setMuscleFiltersOpen(prev => !prev)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
            <span>{muscleLabel}</span>
            <svg className="filter-toggle-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <button
            className={`filter-toggle ${equipmentFiltersOpen ? 'open' : ''} ${hasEquipmentFilter ? 'has-active' : ''}`}
            onClick={() => setEquipmentFiltersOpen(prev => !prev)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
            <span>{equipmentLabel}</span>
            <svg className="filter-toggle-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>

      {muscleFiltersOpen && (
        <>
          <div className="filter-section-label">Muscle Group</div>
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
        </>
      )}

      {equipmentFiltersOpen && (
        <>
          <div className="filter-section-label">Equipment</div>
          <div className="category-tabs">
            <button
              className={`category-tab ${!selectedEquipment ? 'active' : ''}`}
              onClick={() => setSelectedEquipment(null)}
            >
              <span className="tab-label">All</span>
            </button>
            {availableEquipment.map((eq) => (
              <button
                key={eq}
                className={`category-tab ${selectedEquipment === eq ? 'active' : ''}`}
                onClick={() => handleEquipmentClick(eq)}
              >
                <span className="tab-label">{eq.charAt(0).toUpperCase() + eq.slice(1)}</span>
              </button>
            ))}
          </div>
        </>
      )}

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
