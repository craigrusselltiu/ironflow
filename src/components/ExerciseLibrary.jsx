import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ExerciseCard } from './ExerciseCard';
import { exercises, CATEGORIES, CATEGORY_COLORS } from '../data/exercises';

export function ExerciseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="exercise-library">
      <h2>Exercise Library</h2>

      <div className="library-filters">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="category-filters">
          <button
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {Object.entries(CATEGORIES).map(([key, value]) => (
            <button
              key={value}
              className={`category-btn ${selectedCategory === value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(value)}
              style={{
                '--category-color': CATEGORY_COLORS[value],
              }}
            >
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="exercise-list">
        <SortableContext
          items={filteredExercises.map(e => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isLibraryItem={true}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
