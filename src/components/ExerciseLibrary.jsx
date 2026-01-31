import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ExerciseCard } from './ExerciseCard';
import { exercises, CATEGORIES, CATEGORY_COLORS } from '../data/exercises';

const CATEGORY_ICONS = {
  push: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pull: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  legs: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 4v16M18 4v16" strokeLinecap="round"/>
    </svg>
  ),
  core: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  cardio: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export function ExerciseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="exercise-library-modern">
      <div className="library-header">
        <h2>Exercises</h2>
        <span className="exercise-total">{filteredExercises.length}</span>
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
          className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          <span className="tab-label">All</span>
        </button>
        {Object.entries(CATEGORIES).map(([key, value]) => (
          <button
            key={value}
            className={`category-tab ${selectedCategory === value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(value)}
            style={{ '--tab-color': CATEGORY_COLORS[value] }}
          >
            {CATEGORY_ICONS[value]}
            <span className="tab-label">{key.charAt(0) + key.slice(1).toLowerCase()}</span>
          </button>
        ))}
      </div>

      <div className="exercise-list-modern">
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
        {filteredExercises.length === 0 && (
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
