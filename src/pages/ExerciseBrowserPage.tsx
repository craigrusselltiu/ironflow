import { useState, useEffect, useCallback } from 'react';
import { useExercises, useExerciseLists } from '../hooks/useExercises';
import { ExerciseDetailModal } from '../components/ExerciseDetailModal';
import { useRoutine } from '../contexts/RoutineContext';
import { cacheExercise } from '../data/exerciseCache';
import type { Exercise, ExerciseFilters } from '../types/exercise';

export function ExerciseBrowserPage() {
  const { addExerciseToDay } = useRoutine();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTarget, setActiveTarget] = useState<string | null>(null);
  const [activeEquipment, setActiveEquipment] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filters: ExerciseFilters = {};
  if (debouncedSearch) {
    filters.search = debouncedSearch;
  }
  if (activeTarget) {
    filters.targetMuscles = activeTarget;
  }
  if (activeEquipment) {
    filters.equipment = activeEquipment;
  }

  const { exercises, isLoading, error, loadMore, hasMore } = useExercises({
    limit: 50,
    filters,
  });

  const { targets, equipment, isLoading: listsLoading } = useExerciseLists();

  const handleTargetClick = (target: string) => {
    setActiveTarget(prev => prev === target ? null : target);
  };

  const handleEquipmentClick = (equip: string) => {
    setActiveEquipment(prev => prev === equip ? null : equip);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveTarget(null);
    setActiveEquipment(null);
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoading && hasMore) {
      loadMore();
    }
  }, [isLoading, hasMore, loadMore]);

  const formatLabel = (str: string) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const hasActiveFilters = debouncedSearch || activeTarget || activeEquipment;

  return (
    <div className="exercise-browser-page">
      <header className="browser-header">
        <div className="browser-header-content">
          <h1>Exercise Library</h1>
          <p className="browser-subtitle">
            Browse and search through 1300+ exercises with detailed instructions
          </p>
        </div>
      </header>

      <div className="browser-content">
        <div className="browser-filters">
          <div className="search-container">
            <input
              type="text"
              className="browser-search-input"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear
              </button>
            )}
          </div>

          {!listsLoading && (
            <>
              <div className="filter-section">
                <h3>Target Muscle</h3>
                <div className="filter-chips">
                  {targets.map((target) => (
                    <button
                      key={target}
                      className={`filter-chip ${activeTarget === target ? 'active' : ''}`}
                      onClick={() => handleTargetClick(target)}
                    >
                      {formatLabel(target)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3>Equipment</h3>
                <div className="filter-chips">
                  {equipment.map((equip) => (
                    <button
                      key={equip}
                      className={`filter-chip ${activeEquipment === equip ? 'active' : ''}`}
                      onClick={() => handleEquipmentClick(equip)}
                    >
                      {formatLabel(equip)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="exercise-grid-container" onScroll={handleScroll}>
          {error && (
            <div className="browser-error">
              <p>Failed to load exercises: {error}</p>
              <p className="error-hint">Make sure the backend server is running.</p>
            </div>
          )}

          {!error && exercises.length === 0 && !isLoading && (
            <div className="browser-empty">
              <p>No exercises found</p>
              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          )}

          <div className="exercise-grid">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="exercise-browser-card"
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="card-gif-container">
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="card-gif"
                    loading="lazy"
                  />
                </div>
                <div className="card-info">
                  <h3 className="card-name">{exercise.name}</h3>
                  <div className="card-meta">
                    <span className="card-target">{formatLabel(exercise.targetMuscles)}</span>
                    <span className="card-equipment">{formatLabel(exercise.equipment)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="browser-loading">
              <div className="loading-spinner"></div>
              <p>Loading exercises...</p>
            </div>
          )}

          {!isLoading && hasMore && exercises.length > 0 && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          )}
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="12" width="28" height="8" rx="2" fill="currentColor"/>
                <rect x="6" y="8" width="4" height="16" rx="1" fill="currentColor"/>
                <rect x="22" y="8" width="4" height="16" rx="1" fill="currentColor"/>
              </svg>
            </span>
            <span>IronFlow &copy; 2026</span>
          </div>
          <div className="footer-copy">
            Built for lifters who take training seriously.
          </div>
        </div>
      </footer>

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onAddToDay={(exercise, day) => {
            // Cache the API exercise so it can be looked up by DayBucket
            cacheExercise(exercise);
            addExerciseToDay(exercise.id, day);
          }}
          showAddToDay={true}
        />
      )}
    </div>
  );
}
