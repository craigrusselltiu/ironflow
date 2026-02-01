import { useState, useEffect, useCallback, useRef } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ExerciseCard } from './ExerciseCard';
import { getHardcodedExercises, cacheExercise } from '../data/exerciseCache';
import { api } from '../api/client';

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

// Map ExerciseDB target/muscle to IronFlow muscle name
// Supports both old RapidAPI names and new exercisedb.dev names
const targetToMuscle = {
  // Core muscles
  abs: 'abs',
  abdominals: 'abs',
  'lower abs': 'abs',
  obliques: 'abs',
  core: 'abs',

  // Back muscles
  lats: 'lats',
  'latissimus dorsi': 'lats',
  'upper back': 'upperBack',
  back: 'upperBack',
  rhomboids: 'upperBack',
  'lower back': 'lowerBack',
  spine: 'lowerBack',

  // Shoulder muscles
  delts: 'frontDelts',
  deltoids: 'frontDelts',
  shoulders: 'frontDelts',
  'rear deltoids': 'rearDelts',
  'rotator cuff': 'rearDelts',

  // Arm muscles
  biceps: 'biceps',
  brachialis: 'biceps',
  triceps: 'triceps',
  forearms: 'forearms',
  'wrist extensors': 'forearms',
  'wrist flexors': 'forearms',
  'grip muscles': 'forearms',
  wrists: 'forearms',
  hands: 'forearms',

  // Chest muscles
  pectorals: 'chest',
  chest: 'chest',
  'upper chest': 'chest',
  'serratus anterior': 'chest',

  // Neck/Trap muscles
  traps: 'traps',
  trapezius: 'traps',
  'levator scapulae': 'traps',
  sternocleidomastoid: 'traps',

  // Leg muscles
  quads: 'quads',
  quadriceps: 'quads',
  adductors: 'quads',
  'inner thighs': 'quads',
  hamstrings: 'hamstrings',
  glutes: 'glutes',
  abductors: 'glutes',
  'hip flexors': 'glutes',
  groin: 'quads',
  calves: 'calves',
  soleus: 'calves',
  shins: 'calves',
  'ankle stabilizers': 'calves',
  ankles: 'calves',
  feet: 'calves',
};

// Format exercise name to title case
function formatName(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Map API exercise to display format with proper muscle groups
function mapExercise(exercise) {
  // Get muscle mappings
  const primaryMuscle = exercise.primaryMuscle || targetToMuscle[exercise.target?.toLowerCase()] || null;
  const secondaryMusclesMapping = exercise.secondaryMusclesMapping ||
    (exercise.secondaryMuscles || [])
      .map(m => targetToMuscle[m.toLowerCase()])
      .filter(m => m && m !== primaryMuscle);

  // Create exercise with proper muscle arrays for caching
  const enriched = {
    ...exercise,
    primaryMuscle,
    secondaryMusclesMapping,
  };

  // Cache the exercise for lookup in DayBucket and muscle calculations
  cacheExercise(enriched);

  return {
    id: exercise.id,
    name: formatName(exercise.name),
    bodyPart: exercise.bodyPart,
    target: exercise.target,
    equipment: exercise.equipment,
    primaryMuscles: primaryMuscle ? [primaryMuscle] : [],
    secondaryMuscles: secondaryMusclesMapping,
  };
}

export function ExerciseLibrary() {
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState(Object.keys(BODY_PART_CONFIG));
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);
  const BATCH_SIZE = 30;

  // Fetch body part list on mount
  useEffect(() => {
    const fetchBodyParts = async () => {
      try {
        const data = await api.get('/exercises/lists/bodyParts', { skipAuth: true });
        setBodyParts(data);
      } catch {
        // Use default body parts if backend unavailable
        setBodyParts(Object.keys(BODY_PART_CONFIG));
      }
    };
    fetchBodyParts();
  }, []);

  // Fetch exercises from backend API
  const fetchData = useCallback(async (bodyPart, currentOffset, append = false) => {
    if (currentOffset === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      let endpoint;
      if (bodyPart === 'all') {
        endpoint = `/exercises?limit=${BATCH_SIZE}&offset=${currentOffset}`;
      } else {
        endpoint = `/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=${BATCH_SIZE}&offset=${currentOffset}`;
      }
      const data = await api.get(endpoint, { skipAuth: true });
      const mapped = data.map(mapExercise);

      if (append) {
        setExercises(prev => [...prev, ...mapped]);
      } else {
        setExercises(mapped);
      }

      setHasMore(data.length === BATCH_SIZE);
      setOffset(currentOffset + BATCH_SIZE);
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
      setError(err.message);
      // Fallback to hardcoded on complete failure
      if (currentOffset === 0) {
        const hardcoded = getHardcodedExercises();
        const filtered = bodyPart === 'all'
          ? hardcoded
          : hardcoded.filter(e => {
              const categoryToBodyPart = {
                push: ['chest', 'shoulders', 'upper arms'],
                pull: ['back', 'upper arms', 'lower arms'],
                legs: ['upper legs', 'lower legs'],
                core: ['waist'],
                cardio: ['cardio'],
              };
              return categoryToBodyPart[e.category]?.includes(bodyPart);
            });
        setExercises(filtered);
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Reset and fetch when filter changes
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setExercises([]);
    fetchData(selectedBodyPart, 0, false);
  }, [selectedBodyPart, fetchData]);

  // Handle scroll for lazy loading
  const handleScroll = useCallback((e) => {
    if (isLoading || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchData(selectedBodyPart, offset, true);
    }
  }, [isLoading, isLoadingMore, hasMore, offset, selectedBodyPart, fetchData]);

  // Filter by search term
  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBodyPartClick = (bodyPart) => {
    setSearchTerm('');
    setSelectedBodyPart(prev => prev === bodyPart ? 'all' : bodyPart);
  };

  return (
    <div className="exercise-library-modern">
      <div className="library-header">
        <h2>Exercises</h2>
        <span className="exercise-total">
          {isLoading ? '...' : filteredExercises.length}
          {hasMore && !isLoading ? '+' : ''}
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

      {error && !isLoading && exercises.length > 0 && (
        <div className="library-fallback-notice">
          Using offline exercises
        </div>
      )}

      <div
        className="exercise-list-modern"
        ref={listRef}
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="library-loading">
            <div className="loading-spinner-small"></div>
            <span>Loading exercises...</span>
          </div>
        ) : (
          <>
            <SortableContext
              items={filteredExercises.map(e => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredExercises.map((exercise, idx) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isLibraryItem={true}
                  exerciseIndex={idx}
                />
              ))}
            </SortableContext>

            {isLoadingMore && (
              <div className="library-loading-more">
                <div className="loading-spinner-small"></div>
              </div>
            )}

            {!isLoadingMore && hasMore && filteredExercises.length > 0 && (
              <button
                className="library-load-more-btn"
                onClick={() => fetchData(selectedBodyPart, offset, true)}
              >
                Load More
              </button>
            )}

            {!hasMore && filteredExercises.length > 0 && (
              <div className="library-end-notice">
                {filteredExercises.length} exercises
              </div>
            )}
          </>
        )}

        {!isLoading && filteredExercises.length === 0 && (
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
