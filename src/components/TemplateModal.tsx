import { useState } from 'react';
import { useRoutine } from '../contexts/RoutineContext';
import { ConfirmModal } from './ConfirmModal';
import type { Template } from '../storage/types';
import exercises from '../data/exercises.json';

interface TemplateModalProps {
  onClose: () => void;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getExerciseName(exerciseId: string): string {
  const exercise = (exercises as Array<{ id: string; name: string }>).find(e => e.id === exerciseId);
  return exercise?.name || 'Unknown Exercise';
}

function getTemplateDaySummary(template: Template): { day: string; count: number }[] {
  const dayCounts: Record<number, number> = {};
  template.exercises.forEach(ex => {
    dayCounts[ex.day] = (dayCounts[ex.day] || 0) + 1;
  });
  return Object.entries(dayCounts)
    .map(([day, count]) => ({ day: DAY_NAMES[parseInt(day)], count }))
    .sort((a, b) => DAY_NAMES.indexOf(a.day) - DAY_NAMES.indexOf(b.day));
}

export function TemplateModal({ onClose }: TemplateModalProps) {
  const { templates, applyTemplate, deleteTemplate, weeklyRoutine } = useRoutine();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [confirmTemplate, setConfirmTemplate] = useState<Template | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const totalExercises = Object.values(weeklyRoutine).reduce((sum, day) => sum + day.length, 0);
  const systemTemplates = templates.filter(t => t.isSystem);
  const userTemplates = templates.filter(t => !t.isSystem);

  const handleApply = async (template: Template) => {
    if (totalExercises > 0) {
      setConfirmTemplate(template);
      return;
    }
    await doApply(template);
  };

  const doApply = async (template: Template) => {
    setIsApplying(true);
    try {
      await applyTemplate(template.id);
      setConfirmTemplate(null);
      onClose();
    } catch (err) {
      console.error('Failed to apply template:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const doDelete = async () => {
    if (!confirmDeleteId) return;
    await deleteTemplate(confirmDeleteId);
    if (selectedTemplate?.id === confirmDeleteId) {
      setSelectedTemplate(null);
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content template-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>

        {confirmTemplate ? (
          <div className="template-confirm">
            <div className="template-confirm-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3>Replace Current Routine?</h3>
            <p>Your current routine has {totalExercises} exercise{totalExercises !== 1 ? 's' : ''}. Applying "{confirmTemplate.name}" will replace all of them.</p>
            <div className="template-confirm-actions">
              <button className="btn-outline" onClick={() => setConfirmTemplate(null)}>Cancel</button>
              <button className="btn-primary" onClick={() => doApply(confirmTemplate)} disabled={isApplying}>
                {isApplying ? 'Applying...' : 'Replace & Apply'}
              </button>
            </div>
          </div>
        ) : selectedTemplate ? (
          <div className="template-detail">
            <div className="template-detail-header">
              <button className="template-back-btn" onClick={() => setSelectedTemplate(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back
              </button>
            </div>
            <h2 className="template-detail-name">{selectedTemplate.name}</h2>
            {selectedTemplate.description && (
              <p className="template-detail-desc">{selectedTemplate.description}</p>
            )}
            <div className="template-detail-days">
              {[0, 1, 2, 3, 4, 5, 6].map(day => {
                const dayExercises = selectedTemplate.exercises
                  .filter(ex => ex.day === day)
                  .sort((a, b) => a.orderIndex - b.orderIndex);
                if (dayExercises.length === 0) return null;
                return (
                  <div key={day} className="template-day-block">
                    <h4 className="template-day-label">{DAY_NAMES[day]}</h4>
                    <ul className="template-exercise-list">
                      {dayExercises.map((ex, i) => (
                        <li key={i} className="template-exercise-item">
                          <span className="template-exercise-name">{getExerciseName(ex.exerciseId)}</span>
                          {ex.plannedSets && ex.plannedReps && (
                            <span className="template-exercise-sets">{ex.plannedSets}×{ex.plannedReps}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <button
              className="btn-primary template-apply-btn"
              onClick={() => handleApply(selectedTemplate)}
              disabled={isApplying}
            >
              {isApplying ? 'Applying...' : 'Apply Template'}
            </button>
          </div>
        ) : (
          <div className="template-list-view">
            <h2 className="template-modal-title">Templates</h2>
            <p className="template-modal-subtitle">Choose a template to apply to your routine</p>

            {systemTemplates.length > 0 && (
              <div className="template-section">
                <h3 className="template-section-title">Pre-Built Templates</h3>
                <div className="template-cards">
                  {systemTemplates.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onClick={() => setSelectedTemplate(template)}
                      onApply={() => handleApply(template)}
                    />
                  ))}
                </div>
              </div>
            )}

            {userTemplates.length > 0 && (
              <div className="template-section">
                <h3 className="template-section-title">My Templates</h3>
                <div className="template-cards">
                  {userTemplates.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onClick={() => setSelectedTemplate(template)}
                      onApply={() => handleApply(template)}
                      onDelete={() => handleDelete(template.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {userTemplates.length === 0 && (
              <div className="template-section">
                <h3 className="template-section-title">My Templates</h3>
                <p className="template-empty-hint">Save your current routine as a template using the Routine dropdown above.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <ConfirmModal
          title="Delete Template?"
          message="This template will be permanently removed. This action cannot be undone."
          confirmLabel="Delete"
          variant="danger"
          onConfirm={doDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}

function TemplateCard({
  template,
  onClick,
  onApply,
  onDelete,
}: {
  template: Template;
  onClick: () => void;
  onApply: () => void;
  onDelete?: () => void;
}) {
  const daySummary = getTemplateDaySummary(template);
  const totalExercises = template.exercises.length;

  return (
    <div className="template-card" onClick={onClick}>
      <div className="template-card-header">
        <h4 className="template-card-name">{template.name}</h4>
        {template.isSystem && (
          <span className="template-system-badge">Built-in</span>
        )}
      </div>
      {template.description && (
        <p className="template-card-desc">{template.description}</p>
      )}
      <div className="template-card-meta">
        <span className="template-card-stat">{totalExercises} exercises</span>
        <span className="template-card-stat">{daySummary.length} days</span>
      </div>
      <div className="template-card-footer">
        <div className="template-card-days">
          {DAY_NAMES.map((day, i) => {
            const info = daySummary.find(d => d.day === day);
            return (
              <span key={day} className={`template-day-dot ${info ? 'active' : ''}`} title={info ? `${day}: ${info.count} exercises` : `${day}: Rest`}>
                {day.charAt(0)}
              </span>
            );
          })}
        </div>
        <div className="template-card-actions" onClick={e => e.stopPropagation()}>
          {onDelete && (
            <button className="template-card-delete" onClick={onDelete} title="Delete template">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          )}
          <button className="btn-apply template-card-apply" onClick={onApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
