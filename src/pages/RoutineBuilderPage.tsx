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
import { MuscleBreakdown } from '../components/MuscleBreakdown';
import { ExerciseCard } from '../components/ExerciseCard';
import { RoutineSaveDropdown } from '../components/RoutineSaveDropdown';
import { TemplateModal } from '../components/TemplateModal';
import { useRoutine } from '../contexts/RoutineContext';
import { calculateMuscleFatigue } from '../utils/muscleCalculations';

export function RoutineBuilderPage() {
  const { weeklyRoutine, setWeeklyRoutine, addExerciseToDay, removeExerciseFromDay, clearRoutine, updateExerciseSetsReps, isLoading } = useRoutine();
  const [activeExercise, setActiveExercise] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [countSecondary, setCountSecondary] = useState(() => {
    const stored = localStorage.getItem('ironflow_count_secondary');
    return stored !== null ? JSON.parse(stored) : true;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { fatigue, sets } = calculateMuscleFatigue(weeklyRoutine, countSecondary);

  const handleToggleSecondary = () => {
    setCountSecondary(prev => {
      const next = !prev;
      localStorage.setItem('ironflow_count_secondary', JSON.stringify(next));
      return next;
    });
  };

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

      addExerciseToDay(activeData.exercise.id, targetDay);
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

  const totalExercises = Object.values(weeklyRoutine).reduce((sum, day) => sum + day.length, 0);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="routine-builder-modern">
        <header className="builder-header-modern">
          <div className="header-left">
            <h1>Routine Builder</h1>
            <p>Drag exercises to build your weekly plan</p>
          </div>
          <div className="header-right">
            <RoutineSaveDropdown onOpenTemplates={() => setShowTemplateModal(true)} />
            <div className="secondary-toggle-group">
              <label className="secondary-toggle">
                <span className="secondary-toggle-label">Count Secondary Muscles</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={countSecondary}
                  className={`secondary-toggle-switch ${countSecondary ? 'active' : ''}`}
                  onClick={handleToggleSecondary}
                >
                  <span className="secondary-toggle-knob" />
                </button>
              </label>
              <span className="secondary-toggle-tooltip-wrapper">
                <svg className="secondary-toggle-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span className="secondary-toggle-tooltip">
                  When enabled, secondary muscles receive half credit toward their weekly set totals. When disabled, only primary muscles are counted.
                </span>
              </span>
            </div>
            {totalExercises > 0 && (
              <button className="clear-btn" onClick={clearRoutine}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                <span>Clear All</span>
              </button>
            )}
          </div>
        </header>

        <div className="builder-content">
          <aside className="sidebar-left">
            <ExerciseLibrary />
          </aside>

          <main className="main-area">
            {isLoading ? (
              <div className="builder-loading-modern">
                <div className="loading-pulse"></div>
                <p>Loading your routine...</p>
              </div>
            ) : (
              <>
                <WeeklyPlanner
                  weeklyRoutine={weeklyRoutine}
                  onRemoveExercise={handleRemoveExercise}
                  onUpdateSetsReps={updateExerciseSetsReps}
                />
                <MuscleBreakdown fatigue={fatigue} sets={sets} />
              </>
            )}
          </main>

          <aside className="sidebar-right">
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

      {showTemplateModal && (
        <TemplateModal onClose={() => setShowTemplateModal(false)} />
      )}
    </DndContext>
  );
}
