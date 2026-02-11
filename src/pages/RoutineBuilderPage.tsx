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
import { ConfirmModal } from '../components/ConfirmModal';
import { useRoutine } from '../contexts/RoutineContext';
import { calculateMuscleFatigue } from '../utils/muscleCalculations';
import { getExerciseById } from '../data/exerciseCache';

const DAY_DISPLAY: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday',
  friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

export function RoutineBuilderPage() {
  const { weeklyRoutine, setWeeklyRoutine, addExerciseToDay, removeExerciseFromDay, clearRoutine, updateExerciseSetsReps, persistRoutineOrder, isLoading, loadedTemplate } = useRoutine();
  const [activeExercise, setActiveExercise] = useState(null);
  const [activeBucketDay, setActiveBucketDay] = useState<string | null>(null);
  const [bucketOverDay, setBucketOverDay] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [countSecondary, setCountSecondary] = useState(() => {
    const stored = localStorage.getItem('ironflow_count_secondary');
    return stored !== null ? JSON.parse(stored) : false;
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

    if (data?.type === 'bucket') {
      setActiveBucketDay(data.day);
      setActiveExercise(null);
    } else if (data?.type === 'library') {
      setActiveExercise(data.exercise);
    } else if (data?.type === 'scheduled') {
      setActiveExercise(data.exercise);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) {
      setBucketOverDay(null);
      return;
    }

    const activeData = active.data.current;
    const overId = over.id;
    const overData = over.data.current;

    if (activeData?.type === 'bucket') {
      // Resolve which day the bucket is hovering over for visual feedback
      const overIdStr = String(overId);
      let targetDay: string | null = null;
      if (overData?.type === 'day') targetDay = overData.day;
      else if (overData?.type === 'bucket') targetDay = overData.day;
      else if (overIdStr.startsWith('bucket-')) targetDay = overIdStr.replace('bucket-', '');
      else {
        targetDay = findDayContaining(overId);
        if (!targetDay && overIdStr in weeklyRoutine) targetDay = overIdStr;
      }
      setBucketOverDay(targetDay !== activeData.day ? targetDay : null);
      return;
    }

    if (activeData?.type === 'library') {
      setBucketOverDay(null);
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

    const activeData = active.data.current;

    // Handle bucket swap
    if (activeData?.type === 'bucket') {
      setActiveBucketDay(null);
      setBucketOverDay(null);
      if (!over) return;

      const overData = over.data.current;
      const overId = String(over.id);
      let targetDay: string | null = null;

      // Target can be a droppable day zone, another bucket's draggable, or an exercise inside a day
      if (overData?.type === 'day') {
        targetDay = overData.day;
      } else if (overData?.type === 'bucket') {
        targetDay = overData.day;
      } else if (overId.startsWith('bucket-')) {
        targetDay = overId.replace('bucket-', '');
      } else {
        // Dropped on an exercise card or other element - find which day it belongs to
        targetDay = findDayContaining(overId);
        // Also check if overId is a day name directly (droppable zone)
        if (!targetDay && overId in weeklyRoutine) {
          targetDay = overId;
        }
      }

      const sourceDay = activeData.day;
      if (!targetDay || sourceDay === targetDay) return;

      const newRoutine = {
        ...weeklyRoutine,
        [sourceDay]: weeklyRoutine[targetDay],
        [targetDay]: weeklyRoutine[sourceDay],
      };
      setWeeklyRoutine(newRoutine);
      persistRoutineOrder(newRoutine);
      return;
    }

    if (!over) {
      // Persist any cross-day moves that happened during drag-over
      if (activeData?.type === 'scheduled') {
        persistRoutineOrder(weeklyRoutine);
      }
      return;
    }

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
        const dayExercises = [...weeklyRoutine[sourceDay]];
        const oldIndex = dayExercises.findIndex(e => e.instanceId === activeInstanceId);
        const newIndex = dayExercises.findIndex(e => e.instanceId === overInstanceId);

        if (oldIndex === -1 || newIndex === -1) return;

        const newRoutine = {
          ...weeklyRoutine,
          [sourceDay]: arrayMove(dayExercises, oldIndex, newIndex),
        };
        setWeeklyRoutine(newRoutine);
        persistRoutineOrder(newRoutine);
      } else {
        // Cross-day move already happened in handleDragOver, persist current state
        persistRoutineOrder(weeklyRoutine);
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
            <p>
              {loadedTemplate ? (
                <span className="loaded-template-badge">{loadedTemplate.name}</span>
              ) : (
                'Drag exercises to build your weekly plan'
              )}
            </p>
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
              <>
              <div className="header-divider" />
              <button className="clear-btn" onClick={() => setShowClearConfirm(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                <span>Clear All</span>
              </button>
              </>
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
                <div className="skeleton-planner">
                  <div className="skeleton-header">
                    <div className="skeleton-bar skeleton-title" />
                    <div className="skeleton-bar skeleton-subtitle" />
                  </div>
                  <div className="skeleton-days">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="skeleton-day">
                        <div className="skeleton-bar skeleton-day-label" />
                        <div className="skeleton-bar skeleton-card" />
                        <div className="skeleton-bar skeleton-card short" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <WeeklyPlanner
                  weeklyRoutine={weeklyRoutine}
                  onRemoveExercise={handleRemoveExercise}
                  onUpdateSetsReps={updateExerciseSetsReps}
                  bucketOverDay={bucketOverDay}
                  activeBucketDay={activeBucketDay}
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
        ) : activeBucketDay ? (
          <BucketDragPreview day={activeBucketDay} exercises={weeklyRoutine[activeBucketDay]} />
        ) : null}
      </DragOverlay>

      {showTemplateModal && (
        <TemplateModal onClose={() => setShowTemplateModal(false)} />
      )}

      {showClearConfirm && (
        <ConfirmModal
          title="Clear Entire Routine?"
          message={`This will remove all ${totalExercises} exercise${totalExercises !== 1 ? 's' : ''} from your routine. This action cannot be undone.`}
          confirmLabel="Clear All"
          variant="danger"
          onConfirm={() => {
            clearRoutine();
            setShowClearConfirm(false);
          }}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </DndContext>
  );
}

function BucketDragPreview({ day, exercises }: { day: string; exercises: Array<{ exerciseId: string }> }) {
  const names = exercises.slice(0, 3).map(e => getExerciseById(e.exerciseId)?.name).filter(Boolean);
  const remaining = exercises.length - names.length;

  return (
    <div className="bucket-drag-preview">
      <div className="bucket-preview-header">
        <span className="bucket-preview-day">{DAY_DISPLAY[day] || day}</span>
        <span className="bucket-preview-count">{exercises.length} exercise{exercises.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="bucket-preview-list">
        {names.map((name, i) => (
          <div key={i} className="bucket-preview-item">{name}</div>
        ))}
        {remaining > 0 && (
          <div className="bucket-preview-item bucket-preview-more">+{remaining} more</div>
        )}
      </div>
    </div>
  );
}
