import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Header } from './Header';
import { ExerciseLibrary } from './ExerciseLibrary';
import { WeeklyPlanner } from './WeeklyPlanner';
import { MuscleMap } from './MuscleMap';
import { ExerciseCard } from './ExerciseCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateMuscleFatigue } from '../utils/muscleCalculations';
import { exercises } from '../data/exercises';

const INITIAL_ROUTINE = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

function generateInstanceId() {
  return `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function App() {
  const [weeklyRoutine, setWeeklyRoutine] = useLocalStorage('ironflow-routine', INITIAL_ROUTINE);
  const [activeExercise, setActiveExercise] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fatigue = calculateMuscleFatigue(weeklyRoutine);

  const findDayContaining = useCallback((instanceId) => {
    for (const [day, exercises] of Object.entries(weeklyRoutine)) {
      if (exercises.some(e => e.instanceId === instanceId)) {
        return day;
      }
    }
    return null;
  }, [weeklyRoutine]);

  const handleDragStart = (event) => {
    const { active } = event;
    const data = active.data.current;

    if (data?.type === 'library') {
      setActiveExercise(data.exercise);
    } else if (data?.type === 'scheduled') {
      setActiveExercise(data.exercise);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overId = over.id;
    const overData = over.data.current;

    // If dragging from library
    if (activeData?.type === 'library') {
      return; // Handle in dragEnd
    }

    // If dragging a scheduled exercise
    if (activeData?.type === 'scheduled') {
      const activeInstanceId = activeData.instanceId;
      const sourceDay = findDayContaining(activeInstanceId);

      if (!sourceDay) return;

      let targetDay = null;

      // Check if hovering over a day bucket
      if (overData?.type === 'day') {
        targetDay = overData.day;
      } else {
        // Hovering over another exercise - find its day
        targetDay = findDayContaining(overId);
      }

      if (!targetDay || sourceDay === targetDay) return;

      // Move exercise to new day
      setWeeklyRoutine(prev => {
        const sourceExercises = [...prev[sourceDay]];
        const exerciseIndex = sourceExercises.findIndex(e => e.instanceId === activeInstanceId);
        if (exerciseIndex === -1) return prev;

        const [exercise] = sourceExercises.splice(exerciseIndex, 1);
        const targetExercises = [...prev[targetDay], exercise];

        return {
          ...prev,
          [sourceDay]: sourceExercises,
          [targetDay]: targetExercises,
        };
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveExercise(null);

    if (!over) return;

    const activeData = active.data.current;
    const overId = over.id;
    const overData = over.data.current;

    // If dragging from library
    if (activeData?.type === 'library') {
      let targetDay = null;

      if (overData?.type === 'day') {
        targetDay = overData.day;
      } else {
        // Dropped on an exercise - find its day
        targetDay = findDayContaining(overId);
      }

      if (!targetDay) return;

      // Add new exercise instance
      const newInstance = {
        exerciseId: activeData.exercise.id,
        instanceId: generateInstanceId(),
      };

      setWeeklyRoutine(prev => ({
        ...prev,
        [targetDay]: [...prev[targetDay], newInstance],
      }));
      return;
    }

    // If dragging a scheduled exercise (reordering within same day)
    if (activeData?.type === 'scheduled') {
      const activeInstanceId = activeData.instanceId;
      const sourceDay = findDayContaining(activeInstanceId);

      if (!sourceDay) return;

      // Check if reordering within the same day
      const overInstanceId = overId;
      const overDay = findDayContaining(overInstanceId);

      if (sourceDay === overDay && overDay) {
        // Reorder within the day
        setWeeklyRoutine(prev => {
          const dayExercises = [...prev[sourceDay]];
          const oldIndex = dayExercises.findIndex(e => e.instanceId === activeInstanceId);
          const newIndex = dayExercises.findIndex(e => e.instanceId === overInstanceId);

          if (oldIndex === -1 || newIndex === -1) return prev;

          return {
            ...prev,
            [sourceDay]: arrayMove(dayExercises, oldIndex, newIndex),
          };
        });
      }
    }
  };

  const handleRemoveExercise = (day, instanceId) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day].filter(e => e.instanceId !== instanceId),
    }));
  };

  const handleClearRoutine = () => {
    if (window.confirm('Are you sure you want to clear your entire routine?')) {
      setWeeklyRoutine(INITIAL_ROUTINE);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="app">
        <Header onClearRoutine={handleClearRoutine} />

        <main className="main-content">
          <aside className="sidebar left-sidebar">
            <ExerciseLibrary />
          </aside>

          <section className="planner-section">
            <WeeklyPlanner
              weeklyRoutine={weeklyRoutine}
              onRemoveExercise={handleRemoveExercise}
            />
          </section>

          <aside className="sidebar right-sidebar">
            <MuscleMap fatigue={fatigue} />
          </aside>
        </main>
      </div>

      <DragOverlay>
        {activeExercise ? (
          <ExerciseCard
            exercise={activeExercise}
            isLibraryItem={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
