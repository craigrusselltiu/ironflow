import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ExerciseLibrary } from '../components/ExerciseLibrary';
import { WeeklyPlanner } from '../components/WeeklyPlanner';
import { SvgMuscleMap } from '../components/SvgMuscleMap';
import { ExerciseCard } from '../components/ExerciseCard';
import { useRoutine } from '../contexts/RoutineContext';
import { calculateMuscleFatigue } from '../utils/muscleCalculations';

function generateInstanceId() {
  return `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function RoutineBuilderPage() {
  const { weeklyRoutine, setWeeklyRoutine, removeExerciseFromDay, clearRoutine, updateExerciseSetsReps, isLoading } = useRoutine();
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

    if (activeData?.type === 'library') {
      return;
    }

    if (activeData?.type === 'scheduled') {
      const activeInstanceId = activeData.instanceId;
      const sourceDay = findDayContaining(activeInstanceId);

      if (!sourceDay) return;

      let targetDay = null;

      if (overData?.type === 'day') {
        targetDay = overData.day;
      } else {
        targetDay = findDayContaining(overId);
      }

      if (!targetDay || sourceDay === targetDay) return;

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

    if (activeData?.type === 'library') {
      let targetDay = null;

      if (overData?.type === 'day') {
        targetDay = overData.day;
      } else {
        targetDay = findDayContaining(overId);
      }

      if (!targetDay) return;

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

    if (activeData?.type === 'scheduled') {
      const activeInstanceId = activeData.instanceId;
      const sourceDay = findDayContaining(activeInstanceId);

      if (!sourceDay) return;

      const overInstanceId = overId;
      const overDay = findDayContaining(overInstanceId);

      if (sourceDay === overDay && overDay) {
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
    removeExerciseFromDay(day, instanceId);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="routine-builder-page">
        <div className="builder-header">
          <div className="builder-header-content">
            <h1>Routine Builder</h1>
            <p>Drag exercises from the library to build your weekly routine</p>
          </div>
          <button className="btn-ghost btn-danger" onClick={clearRoutine}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Clear All
          </button>
        </div>

        <div className="builder-layout">
          <aside className="builder-sidebar library-sidebar">
            <ExerciseLibrary />
          </aside>

          <section className="builder-main">
            {isLoading ? (
              <div className="builder-loading">
                <div className="loading-spinner"></div>
                <p>Loading your routine...</p>
              </div>
            ) : (
              <WeeklyPlanner
                weeklyRoutine={weeklyRoutine}
                onRemoveExercise={handleRemoveExercise}
                onUpdateSetsReps={updateExerciseSetsReps}
              />
            )}
          </section>

          <aside className="builder-sidebar muscle-sidebar">
            <SvgMuscleMap fatigue={fatigue} />
          </aside>
        </div>
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
