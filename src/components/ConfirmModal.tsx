interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'warning' | 'danger';
}

export function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel, isLoading, variant = 'warning' }: ConfirmModalProps) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="template-confirm">
          <div className={`template-confirm-icon ${variant === 'danger' ? 'danger' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3>{title}</h3>
          <p>{message}</p>
          <div className="template-confirm-actions">
            <button className="btn-outline" onClick={onCancel}>Cancel</button>
            <button className={`btn-primary ${variant === 'danger' ? 'btn-primary-danger' : ''}`} onClick={onConfirm} disabled={isLoading}>
              {isLoading ? 'Working...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
