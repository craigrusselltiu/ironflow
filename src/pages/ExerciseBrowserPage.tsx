import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useExercises, useExerciseLists } from '../hooks/useExercises';
import { ExerciseDetailModal } from '../components/ExerciseDetailModal';
import { useRoutine } from '../contexts/RoutineContext';
import type { Exercise, ExerciseFilters } from '../types/exercise';

export function ExerciseBrowserPage() {
  const { addExerciseToDay } = useRoutine();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeBodyPart, setActiveBodyPart] = useState<string | null>(null);
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
  } else if (activeBodyPart) {
    filters.bodyPart = activeBodyPart;
  } else if (activeEquipment) {
    filters.equipment = activeEquipment;
  }

  const { exercises, isLoading, error, loadMore, hasMore } = useExercises({
    limit: 50,
    filters,
  });

  const { bodyParts, equipment, isLoading: listsLoading } = useExerciseLists();

  const handleBodyPartClick = (bodyPart: string) => {
    setSearchTerm('');
    setActiveEquipment(null);
    setActiveBodyPart(prev => prev === bodyPart ? null : bodyPart);
  };

  const handleEquipmentClick = (equip: string) => {
    setSearchTerm('');
    setActiveBodyPart(null);
    setActiveEquipment(prev => prev === equip ? null : equip);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) {
      setActiveBodyPart(null);
      setActiveEquipment(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveBodyPart(null);
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

  const hasActiveFilters = debouncedSearch || activeBodyPart || activeEquipment;

  return (
    <div className="exercise-browser-page">
      <header className="browser-header">
        <div className="browser-header-content">
          <Link to="/" className="back-link">&larr; Back to Planner</Link>
          <h1>Exercise Library</h1>
          <p className="browser-subtitle">
            Browse and search through hundreds of exercises
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
                <h3>Body Part</h3>
                <div className="filter-chips">
                  {bodyParts.map((part) => (
                    <button
                      key={part}
                      className={`filter-chip ${activeBodyPart === part ? 'active' : ''}`}
                      onClick={() => handleBodyPartClick(part)}
                    >
                      {formatLabel(part)}
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
                    <span className="card-target">{formatLabel(exercise.target)}</span>
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

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onAddToDay={(exercise, day) => {
            addExerciseToDay(exercise.id, day);
          }}
          showAddToDay={true}
        />
      )}
    </div>
  );
}
