import { useState, useRef, useEffect } from 'react';
import { useRoutine } from '../contexts/RoutineContext';

interface RoutineSaveDropdownProps {
  onOpenTemplates: () => void;
}

export function RoutineSaveDropdown({ onOpenTemplates }: RoutineSaveDropdownProps) {
  const { activeRoutine, weeklyRoutine, saveAsTemplate } = useRoutine();
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalExercises = Object.values(weeklyRoutine).reduce((sum, day) => sum + day.length, 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveAsTemplate = async () => {
    if (!templateName.trim()) return;
    setIsSaving(true);
    try {
      await saveAsTemplate(templateName.trim(), templateDesc.trim() || undefined);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowSaveDialog(false);
        setTemplateName('');
        setTemplateDesc('');
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to save template:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadTemplate = () => {
    setIsOpen(false);
    onOpenTemplates();
  };

  return (
    <div className="routine-save-dropdown" ref={dropdownRef}>
      <button
        className="save-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
        <span>Routine</span>
        <svg className={`dropdown-chevron ${isOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isOpen && (
        <div className="save-dropdown-menu">
          {!showSaveDialog ? (
            <>
              <button
                className="save-dropdown-item"
                onClick={() => {
                  setTemplateName(activeRoutine?.name || 'My Template');
                  setShowSaveDialog(true);
                }}
                disabled={totalExercises === 0}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-label">Save as Template</span>
                  <span className="dropdown-item-desc">Save current routine for reuse</span>
                </div>
              </button>
              <button
                className="save-dropdown-item"
                onClick={handleLoadTemplate}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-label">Load Template</span>
                  <span className="dropdown-item-desc">Apply a pre-built or saved template</span>
                </div>
              </button>
            </>
          ) : (
            <div className="save-template-form">
              {saveSuccess ? (
                <div className="save-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Template saved!</span>
                </div>
              ) : (
                <>
                  <div className="save-form-header">
                    <button className="save-form-back" onClick={() => setShowSaveDialog(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </button>
                    <span>Save as Template</span>
                  </div>
                  <input
                    type="text"
                    className="save-template-input"
                    placeholder="Template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveAsTemplate();
                    }}
                  />
                  <input
                    type="text"
                    className="save-template-input"
                    placeholder="Description (optional)"
                    value={templateDesc}
                    onChange={(e) => setTemplateDesc(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveAsTemplate();
                    }}
                  />
                  <button
                    className="save-template-btn"
                    onClick={handleSaveAsTemplate}
                    disabled={!templateName.trim() || isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Template'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
